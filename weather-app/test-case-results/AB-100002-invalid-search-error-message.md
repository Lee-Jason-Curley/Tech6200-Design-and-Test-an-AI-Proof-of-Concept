# Automation report — AB#100002 Invalid search value shows an error message

**Tests written:**
- `tests/work-item-100002.spec.ts` — `TC2 / Steps 1-2: invalid city "Zzzxqwv" shows the red invalid-city error and no weather card` (proves QA Acceptance Steps 1 and 2 and the Expected result). No existing test or config file was edited.

**Test type chosen:** Playwright only. The change is a screen and form, and there is no API project in the repo.

**Baseline (Step 1), run before writing anything:**
- `npx playwright test`: 3 passed, 0 failed (`example.spec.ts` x2, `work-item-100001.spec.ts`).
- `CI=true npm test -- --watchAll=false`: exit code 1 with "No tests found". There are no Jest tests in `src/`. Zero tests failed; the suite is empty, not red. This is the same state accepted for AB#100001.

**Run:** `npx playwright test` on commit `3d49c841985bbf98ccd999816a269c693c830fa0` (main, clean tree before the test file was added) against the local dev server (`http://localhost:3000`, standing in as the QA lane) and the real OpenWeatherMap API.
- Work item spec alone: 1 passed, 0 failed (1.5s).
- Full suite: 4 passed, 0 failed (1.8s).

**Proven by tests:**
- Step 1: Open the app, type "Zzzxqwv" in the city box. Test passed. Before the click, the error message has count 0, which covers the input rule that the error appears only after Search.
- Step 2: Click Search. Test passed.
- Expected result: "Invalid city. Please check the name and try again." is visible and its computed CSS `color` is `rgb(255, 0, 0)` (red). No "Temperature:" or "Weather:" text is on the page, so no weather card is shown. Test passed.

**Needs a person:** none.

**Failures:** none

**Limits hit:** none (the run took under 2 seconds, and the test made one API call).

**Notes and caveats:**
- Port 3000 was already in use by a running dev server (PID 23904) at the start of the session, so Playwright reused it instead of starting its own. The working tree was clean on `main`, so I believe it was serving main. I did not start or restart it, so I cannot prove it was built from that commit.
- The test calls the real weather API. A network or API-quota problem would show up as a failure unrelated to the app code.
- The API key was read only by the app from the gitignored `.env`. I did not read or print it, and it appears in no report or log.
- "No weather card is shown" is proven on a fresh page. `App.js` does not clear `weatherData` when a search fails, so if a user searched a valid city first and then an invalid one, the old card would stay on screen next to the error. That sequence is outside the acceptance steps and is not tested. You may want a follow-up work item for it.
- The error is set only on a 404 response. Other failures (network error, bad API key) show no message. The test relies on the API returning 404 for "Zzzxqwv", which it did in this run.
- The test file is uncommitted in the working tree. I have not committed anything.

**Can QA approve on these results alone?** Yes, for this work item's acceptance steps. TC2 passed, no step needs a person, and the change does not touch sign-in, permissions or database migrations. QA still owns the approval decision, and I have not approved or merged anything.
