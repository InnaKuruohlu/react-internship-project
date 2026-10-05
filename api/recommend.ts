const DEFAULT_MODEL = 'gemini-3.5-flash-lite'
const DEFAULT_FALLBACK_MODEL = 'gemini-2.5-flash-lite'
const MAX_MOOD_LENGTH = 200
const GEMINI_TIMEOUT_MS = 6000
const GEMINI_RETRY_DELAY_MS = 1000
const GEMINI_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models'

const SYSTEM_INSTRUCTION = [
  'Return ONLY JSON in the shape {"titles": string[]}.',
  'Include 1 to 8 real movie titles that match the mood.',
  'Do not include markdown, code fences, or any other text.',
].join(' ')

type ApiRequest = {
  method?: string
  body?: unknown
}

type ApiResponse = {
  setHeader: (name: string, value: string) => void
  status: (code: number) => {
    json: (body: unknown) => void
  }
}

class RecommendationError extends Error {
  readonly failureLog: number | string
  readonly clientStatus: number

  constructor(message: string, failureLog?: number | string, clientStatus = 502) {
    super(message)
    this.name = 'RecommendationError'
    this.failureLog = failureLog ?? this.name
    this.clientStatus = clientStatus
  }
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    res.status(405).json({ error: 'Only POST requests are accepted.' })
    return
  }

  const moodResult = readMood(req.body)
  if ('error' in moodResult) {
    res.status(400).json({ error: moodResult.error })
    return
  }

  try {
    const titles = await recommendTitles(moodResult.mood)
    res.status(200).json({ titles })
  } catch (error) {
    console.error(
      error instanceof RecommendationError
        ? error.failureLog
        : error instanceof Error
          ? error.name
          : 'Error',
    )

    const message =
      error instanceof RecommendationError
        ? error.message
        : 'The recommendation service failed to return movie titles.'
    const status = error instanceof RecommendationError ? error.clientStatus : 502
    res.status(status).json({ error: message })
  }
}

function readMood(body: unknown): { mood: string } | { error: string } {
  const parsedBody = parseBody(body)
  if (!parsedBody) {
    return { error: 'Mood is required.' }
  }

  if (!('mood' in parsedBody) || parsedBody.mood == null || parsedBody.mood === '') {
    return { error: 'Mood is required.' }
  }

  if (typeof parsedBody.mood !== 'string') {
    return { error: 'Mood must be a string.' }
  }

  if (parsedBody.mood.length > MAX_MOOD_LENGTH) {
    return { error: 'Mood must be 200 characters or fewer.' }
  }

  const mood = parsedBody.mood.trim()
  if (!mood) {
    return { error: 'Mood is required.' }
  }

  return { mood }
}

function parseBody(body: unknown): { mood?: unknown } | null {
  if (typeof body === 'string') {
    try {
      return parseBody(JSON.parse(body))
    } catch {
      return null
    }
  }

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return null
  }

  return body as { mood?: unknown }
}

async function recommendTitles(mood: string): Promise<string[]> {
  const apiKey = process.env.GEMINI_API_KEY?.trim()
  if (!apiKey) {
    throw new RecommendationError('The recommendation service is not configured.')
  }

  const model = process.env.GEMINI_MODEL?.trim() || DEFAULT_MODEL

  try {
    return await requestTitles(mood, apiKey, model)
  } catch (error) {
    if (!isRetryableGeminiFailure(error)) {
      throw error
    }

    await delay(GEMINI_RETRY_DELAY_MS)
    const fallbackModel = process.env.GEMINI_FALLBACK_MODEL?.trim() || DEFAULT_FALLBACK_MODEL
    return requestTitles(mood, apiKey, fallbackModel)
  }
}

function isRetryableGeminiFailure(error: unknown): boolean {
  return (
    error instanceof RecommendationError &&
    (error.failureLog === 503 || error.failureLog === 'AbortError')
  )
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

async function requestTitles(mood: string, apiKey: string, model: string): Promise<string[]> {
  const url = `${GEMINI_ENDPOINT}/${encodeURIComponent(model)}:generateContent`

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), GEMINI_TIMEOUT_MS)

  let response: Response
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      signal: controller.signal,
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: SYSTEM_INSTRUCTION }],
        },
        contents: [
          {
            role: 'user',
            parts: [{ text: mood }],
          },
        ],
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: 'OBJECT',
            properties: {
              titles: {
                type: 'ARRAY',
                items: { type: 'STRING' },
              },
            },
            required: ['titles'],
          },
        },
      }),
    })
  } catch (error) {
    const errorName = error instanceof Error ? error.name : 'Error'
    if (controller.signal.aborted) {
      throw new RecommendationError(
        'The recommendation request timed out. Please try again.',
        errorName,
      )
    }

    throw new RecommendationError(
      'The recommendation service could not be reached.',
      errorName,
    )
  } finally {
    clearTimeout(timeoutId)
  }

  if (response.status === 429) {
    throw new RecommendationError(
      'The AI service is busy, please try again later.',
      response.status,
      429,
    )
  }

  if (!response.ok) {
    throw new RecommendationError(
      'The recommendation service failed to return movie titles.',
      response.status,
    )
  }

  let payload: unknown
  try {
    payload = await response.json()
  } catch {
    throw new RecommendationError('The recommendation service returned an unreadable response.')
  }

  return parseTitles(extractModelText(payload))
}

function extractModelText(payload: unknown): string {
  if (!payload || typeof payload !== 'object') {
    throw new RecommendationError('The recommendation service returned an unreadable response.')
  }

  const candidates = (payload as { candidates?: unknown }).candidates
  if (!Array.isArray(candidates) || candidates.length === 0) {
    throw new RecommendationError('The recommendation service returned an unreadable response.')
  }

  const content = (candidates[0] as { content?: unknown } | null)?.content
  const parts = (content as { parts?: unknown } | null)?.parts
  if (!Array.isArray(parts)) {
    throw new RecommendationError('The recommendation service returned an unreadable response.')
  }

  const text = parts
    .filter((part): part is { text: string } => {
      return (
        !!part &&
        typeof part === 'object' &&
        typeof (part as { text?: unknown }).text === 'string' &&
        (part as { thought?: unknown }).thought !== true
      )
    })
    .map((part) => part.text)
    .join('')
    .trim()

  if (!text) {
    throw new RecommendationError('The recommendation service returned an unreadable response.')
  }

  return text
}

function parseTitles(text: string): string[] {
  let parsed: unknown
  try {
    parsed = JSON.parse(stripCodeFences(text))
  } catch {
    throw new RecommendationError('The recommendation service returned an unreadable response.')
  }

  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new RecommendationError('The recommendation service returned an invalid movie list.')
  }

  const titles = (parsed as { titles?: unknown }).titles
  if (!Array.isArray(titles) || titles.length < 1) {
    throw new RecommendationError('The recommendation service returned an invalid movie list.')
  }

  return titles.slice(0, 8).map((title) => {
    if (typeof title !== 'string') {
      throw new RecommendationError('The recommendation service returned an invalid movie list.')
    }

    const trimmed = title.trim()
    if (!trimmed) {
      throw new RecommendationError('The recommendation service returned an invalid movie list.')
    }

    return trimmed
  })
}

function stripCodeFences(text: string): string {
  const trimmed = text.trim()
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i)
  return fenced ? fenced[1].trim() : trimmed
}
