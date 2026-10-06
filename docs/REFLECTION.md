# Reflection

## What was the hardest part?

The hardest part was making the AI search work on the live site. It worked on a preview link, but on the live site it failed in different ways. First, the API key was set only for Production, not for Preview, so the app said "not configured". Then a model name I used gave a 404. Then the Gemini model was sometimes busy. It gave 503 errors or took too long.

I changed settings many times without knowing the real cause, and I lost a lot of time. What helped was the Vercel logs. My function only writes a status code or an error name there, and that number showed me what was wrong.

## What would I do differently next time?

- Look at the logs first, before I change any settings.
- Pick a stable model from the start. Test newer models on the side.
- Run `npm run build` and `npm run test` before every push. My tests were green, but Vercel failed my commit, because the build checks TypeScript and the tests do not.
- Check security earlier. At the end I found that my Firebase rules were still in test mode, and the date on them had already passed.

## What surprised me?

Two things.

First, WAVE said "0 errors", but it had only scanned the page header. The online version does not wait for React to draw the page. The browser extension gave the full result, and it also found a real problem: the page had no heading.

Second, my site worked when I clicked through it, but opening `/auth` directly showed a 404 from Vercel. Nothing was wrong in my code. A single-page app needs one rewrite rule on the host.

## What would I do with more time?

I would add proper error types instead of comparing error text, write tests for the Firebase code, look up movies by exact title and year, and split the code by page to make the first load smaller.
