# Automation report — AB#100005 Weather service URL misconfigured

(Redo of the earlier AB#100004 exercise under a new work item number. The AB#100004 test and report were left untouched.)

**Tests written:**
- `tests/work-item-100005.spec.ts` — `TC4 / Steps 1-3: wrong weather service URL for "Salt Lake City, Utah" shows no weather card and the app stays up` (proves QA Acceptance Steps 1, 2, 3 and the Expected result). No existing test or config file was edited.

**Test type chosen:** Playwright only. The change is a screen and form, and the repo has no API project.

**How the fault is applied:** `apiUrl` is hardcoded in `src/services/WeatherService.js` (no env var or config), so the test redirects requests for `https://api.openweathermap.org/**` to `https://invalid.invalid/data/2.5/weather` with a Playwright route. No app source was changed. The real URL and API key were not changed, read or printed.

**Run:** `npx playwright test` on commit `30f06ceb0d3097ca42057f7b62172f6a3c8d3aa0` (main; working tree clean before the new spec was added) against the local dev server `http://localhost:3000` (standing in as the QA lane).
- Work item spec alone: 1 passed, 0 failed (3.8s).
- Full suite: 6 passed, 1 failed (2.3s). The failure is the known `work-item-100003.spec.ts:21` test (card background `rgba(0, 0, 0, 0)` is not green), already reported under AB#100003.

**Proven by tests:**
- Step 1: weather service URL is invalid. The test asserts exactly one request went to the rerouted invalid address, so the fault was applied. Passed.
- Step 2: open the app and type "Salt Lake City, Utah". The box still holds the value afterwards. Passed.
- Step 3: click Search. Passed.
- Expected, no weather card: no "Temperature:" text, no "Weather:" text, no "Salt Lake City" heading. Passed.
- Expected, no crash or blank page: city box, enabled Search button, Clear button and the "Meteorological predictions" text are visible, and there were no uncaught page errors. Passed.
- Expected, message: unspecified in the plan, so nothing is asserted about it.

**Needs a person:**
- Whether the behavior is acceptable. `handleSearch` shows an error only for an HTTP 404. With a bad service URL there is no HTTP response, so the user sees no message at all. The plan leaves the message unspecified, so this passes, but a person should decide whether a silent failure is acceptable or needs a follow-up work item.

**Failures:**
- This work item's test: none.
- Pre-existing, not caused by this change: `AB#100003 ... TC1 / Steps 1-3` at `work-item-100003.spec.ts:21`.

**Limits hit:** none (run about 4s; no request reached the real weather API).

**Notes and caveats:**
- The simulation is at the network layer. It does not prove behavior for a reachable host with a wrong path (404, shows "Invalid city") or a bad API key (401).
- "No weather card" holds on a fresh page. `App.js` does not clear `weatherData` on a failed search, so after a successful search then a failed one, the old card would remain. That sequence is outside the acceptance steps and not tested.
- Port 3000 was already served by a running dev server (PID 23904), which Playwright reused. The tree was clean on main, but I did not start it and cannot prove its build commit.
- The suite baseline was already red (AB#100003) when this ran; the AB#100003 test was not touched. The CRA/Jest suite has no tests in `src/`.
- Nothing is committed.

**Can QA approve on these results alone?** Not cleanly. This work item's test passed, and the change does not touch sign-in, permissions or database migrations. But the suite is red from the known AB#100003 failure, and the silent failure needs a person's judgment. QA owns the approval; I have not approved or merged anything.
