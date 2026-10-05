export async function getRecommendedTitles(mood: string): Promise<string[]> {
  let response: Response

  try {
    response = await fetch('/api/recommend', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ mood }),
    })
  } catch {
    throw new Error(
      'Could not reach the recommendation service. Please check your connection.',
    )
  }

  if (!response.ok) {
    throw new Error(await readErrorMessage(response))
  }

  let data: unknown
  try {
    data = await response.json()
  } catch {
    throw new Error('The recommendation service returned an unreadable response.')
  }

  const titles = (data as { titles?: unknown } | null)?.titles
  if (!isTitleList(titles)) {
    throw new Error('The recommendation service returned an invalid movie list.')
  }

  return titles
}

async function readErrorMessage(response: Response): Promise<string> {
  try {
    const data: unknown = await response.json()
    if (
      data &&
      typeof data === 'object' &&
      'error' in data &&
      typeof data.error === 'string' &&
      data.error.trim()
    ) {
      return data.error
    }
  } catch {
    return 'Could not get movie recommendations. Please try again.'
  }

  return 'Could not get movie recommendations. Please try again.'
}

function isTitleList(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((title) => typeof title === 'string')
}
