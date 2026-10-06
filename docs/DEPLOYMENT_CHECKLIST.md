# Deployment checklist: Movie Finder

**Live site:** https://react-internship-project-navy.vercel.app
**Release:** `capstone-finalize` merged into `main`
**Date:** 2026-10-06

## 1. Before deploying

- `npm run build` passes on my computer (TypeScript check and Vite build). This caught a real problem: a test file had a type error. The tests were green, but the build failed, and Vercel rejected that commit.
- `npm run test` passes (25 tests, 7 files)
- No secrets in git. `git ls-files | grep env` showed nothing, and `.gitignore` covers `.env*`.
- The Gemini key is only a Vercel environment variable (Production and Preview). It is not in the code.
- Firebase rules replaced. The old test-mode rules had expired on 2026-09-07. The new rules let a logged-in user read and write only `users/{their uid}`. I published them and checked that favourites still work on the live site.
- But I didn't add `.env.example` to the repo, so a new developer knows which variables are needed

## 2. Quality checks
- Lighthouse on the live site: Performance 88, Accessibility 100, Best Practices 96, SEO 100
- WAVE: 0 errors, 0 contrast errors, 0 alerts on `/` and `/auth`
- Check by keyboard (Tab key): focus is visible on the AI form and on the movie cards
- AI errors show a clear message, and the normal search keeps working

## 3. After deploying (checked on the live site)

- Home page opens
- `/auth` opens directly and also after refresh (rewrite in `vercel.json`)
- AI mood search works on the live site (for example "cozy movies" and "Christmas")
- Log in, add a favourite, see it on `/favourites`

## 4. How the app fails safely

| What goes wrong | What happens |
|---|---|
| Gemini is busy (503) or slow | One retry with a second model. Then a clear message. The normal list and search still work. |
| Too many requests to Gemini (429) | "The AI service is busy, please try again later." |
| Gemini returns bad JSON | An error message. The bad answer is never shown. |
| `GEMINI_API_KEY` is missing | The function says "not configured". The rest of the app works. (I saw this when the key was set only for Production.) |
| Direct link or refresh on a page like `/auth` | The rewrite rule serves the app. No 404. |
| Logged-out user opens `/favourites` | `ProtectedRoute` sends them to login |
| A user tries to read another user's data | Firebase rules block it |

## 5. Rollback plan

The live site is whatever `main` deployed last. If a release breaks the site:

1. **Fastest (about 1 minute):** in Vercel, open **Deployments**. Pick the last Production deployment that worked (status *Ready*). Open the `...` menu and choose **Instant Rollback** (or **Promote to Production**). No git changes are needed.
2. **Permanent fix:** in GitHub, open the merged pull request and click **Revert**. This makes a new pull request that undoes the change. Merge it after the green Vercel check.
3. **If only a setting is wrong** (for example the model name in `GEMINI_MODEL`): fix it in Vercel under Environment Variables, then **Redeploy**. New values only work in new deployments.

## 6. Monitoring

- Vercel **Logs**: filter Production and the route `/api/recommend`. The messages are only a status code or an error name (`503`, `404`, `AbortError`). They never contain the key or the user's text. This is how I found the model problems.
- I check the Gemini free-plan limit by hand. There are no automatic alerts yet. Next step: Vercel alerts or an uptime check.

## 7. Sign-off

Deployed by: Inna       Date: 2026-10-06
