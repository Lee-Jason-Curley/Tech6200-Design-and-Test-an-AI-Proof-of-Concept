# Automation report — AB#100004 Weather service URL misconfigured

**Tests written:**
- `tests/work-item-100004.spec.ts` — `TC4 / Steps 1-3: wrong weather service URL for "Salt Lake City, Utah" shows no weather card and the app stays up` (proves QA Acceptance Steps 1, 2 and 3 and the Expected result). No existing test or config file was edited.

**Test type chosen:** Playwright only. The change is a screen and form, and there is no API project in the repo.

**Decisions made with the user before writing:**
- Baseline was red (see below). The user chose to proceed, treating the AB#100003 failure as a known, documented finding. The AB#100003 test was not touched.
- `apiUrl` is hardcoded in `src/services/WeatherService.js`, with no env var or config setting. The user chose to simulate the bad URL in the test itself with a Playwright route. The test redirects the request for `https://api.openweathermap.org/**` to `https://invalid.invalid/data/2.5/weather`. No app source was changed, and the real URL and API key were not changed or printed.

**Baseline (Step 1), run before writing anything:**
- `npx playwright test` on `c3a6ae0`: 4 passed, **1 failed**. The failure is `work-item-100003.spec.ts` (green card assertion, `card background rgba(0, 0, 0, 0)`), already reported under AB#100003.
- `CI=true npm test -- --watchAll=false`: exit code 1 with "No tests found". There are no Jest tests in `src/`. Zero tests failed; the suite is empty, not red.
- The agent rule says to stop on a red suite. The user explicitly approved continuing, so this report is not a clean-baseline report.

**Run:** `npx playwright test` on commit `c3a6ae01377ccb6099fc998da1ab324f6311425e` (main, clean tree before the test file was added) against the local dev server (`http://localhost:3000`, standing in as the QA lane).
- Work item spec alone: 1 passed, 0 failed (1.1s).
- Full suite: 5 passed, 1 failed (2.2s). The one failure is the known AB#100003 test.

**Proven by tests:**
- Step 1: weather service URL is invalid. The test asserts the app sent exactly one request to the rerouted, invalid address (`expect.poll(...).toBe(1)`), so the fault was really applied. Test passed.
- Step 2: open the app and type "Salt Lake City, Utah". Test passed. The box holds the typed value afterwards.
- Step 3: click Search. Test passed.
- Expected, no weather card: no "Temperature:" text, no "Weather:" text, and no "Salt Lake City" heading. Test passed.
- Expected, app does not crash or go blank: the city box, Search button (enabled), Clear button and the "Meteorological predictions" section are still visible, and there were no uncaught page errors. Test passed.
- Expected, message: the plan does not specify one, so the test asserts nothing about it.

**Needs a person:**
- Whether the user-facing behavior is acceptable. In the app, `handleSearch` shows an error only for an HTTP 404 response. With a bad service URL there is no HTTP response, so the user sees no message at all. The page just stays as it was. The plan says the message is unspecified, so this passes, but a person should decide whether a silent failure is acceptable or a follow-up work item is needed.

**Failures:**
- This work item's test: none.
- Pre-existing, not caused by this change: `AB#100003 ... TC1 / Steps 1-3` fails at `work-item-100003.spec.ts:21` (card background `rgba(0, 0, 0, 0)` is not green).

**Limits hit:** none (the run took about 1 second, and no request reached the real weather API).

**Notes and caveats:**
- The simulation is at the network layer. It proves how the app behaves when the request goes to an unresolvable host. It does not prove behavior for other misconfigurations, for example a reachable host with a wrong path (which returns 404 and would show the "Invalid city" message) or a bad API key (401).
- "No weather card is shown" holds on a fresh page. `App.js` does not clear `weatherData` on a failed search, so after a successful search followed by a failed one, the old card would remain. That sequence is outside the acceptance steps and is not tested. This is the same gap noted under AB#100002.
- Port 3000 was already in use by a running dev server (PID 23904), which Playwright reused. The working tree was clean on `main`, so I believe it serves main, but I did not start it and cannot prove its build commit.
- The API key was read only by the app from the gitignored `.env`. I did not read or print it, and it appears in no report or log.
- The test file and this report are uncommitted in the working tree. I have not committed anything.

**Can QA approve on these results alone?** Not cleanly. This work item's test passed and the change does not touch sign-in, permissions or database migrations. However, the suite baseline is red because of the known AB#100003 failure, and one point (the silent failure with no user message) needs a person's judgment. QA owns the approval decision, and I have not approved or merged anything.
