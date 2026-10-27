# Automation report — AB#100001 Search by "City, State"

**Tests written:**
- `tests/work-item-100001.spec.ts` — `TC1 / Steps 1-3: valid "City, State" input shows a weather card and no error` (proves QA Acceptance Steps 1, 2 and 3)
- `playwright.config.ts` — enabled the `webServer` entry (`npm start`, `http://localhost:3000`, `reuseExistingServer` when not CI). No existing test was edited.

**Test type chosen:** Playwright only. The change is a screen and form, and there is no API project in the repo.

**Baseline (Step 1), run before writing anything:**
- `npx playwright test`: 2 passed, 0 failed (`tests/example.spec.ts`).
- `CI=true npm test -- --watchAll=false`: exit code 1 with "No tests found". There are no Jest tests in `src/` because commit 02d7e89 removed `App.test.js`. Zero tests failed; the suite is empty, not red. I continued on that basis. Please confirm this is acceptable.

**Run:** `npx playwright test` on commit `02d7e895cc7f063f4d4febe2202b7714fd28de95` (main, clean tree before the test files were added) against the local dev server (`http://localhost:3000`, standing in as the QA lane) and the real OpenWeatherMap API.
- Work item spec alone: 1 passed, 0 failed (1.3s).
- Full suite: 3 passed, 0 failed (1.7s).

**Proven by tests:**
- Step 1: Open the app, type "Salt Lake City, Utah". Test passed.
- Step 2: Click Search. Test passed.
- Step 3: A weather card is shown for Salt Lake City (heading "Salt Lake City", "Temperature:", "Weather:" visible) and the "Invalid city. Please check the name and try again." message has count 0. Test passed.

**Needs a person:**
- None for the acceptance steps. Two process points are listed under Notes.
- The "red" colour of the error message is not asserted. The test checks that the error text is absent, not its colour. Colour only matters when an error shows, and refusal cases are out of scope for this item.

**Failures:** none

**Limits hit:** none (the run took under 2 seconds, and the test made one API call).

**Notes and caveats:**
- Port 3000 was already in use by a running dev server (PID 23904) when I ran the tests, so Playwright reused it instead of starting its own. The working tree was clean on `main`, so I believe it was serving main. I did not start or restart it, so I cannot prove it was built from that commit.
- The test calls the real weather API, as the simulation answers specified. A network or API-quota problem would show up as a failure unrelated to the app code.
- The API key was read only by the app from the gitignored `.env`. I did not read or print it, and it appears in no report or log.
- Scope was happy path only, as agreed. No refusal cases (empty input, invalid city, wrong format) are covered.
- The test files are uncommitted in the working tree. I have not committed anything.

**Can QA approve on these results alone?** Yes, for this work item's single acceptance step. TC1 passed, no step needs a person, and the change does not touch sign-in, permissions or database migrations. QA still owns the approval decision, and I have not approved or merged anything.
