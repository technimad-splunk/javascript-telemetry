# Verification report: bug-fixes

## Per-item table (input plan `plans/bug-fixes.md`)

| Id | Title | Status | Evidence |
|----|--------|--------|----------|
| 1 | Broken g-force formula | PASS | `motion_capture.ts` lines 189–195: `accelerationIncludingGravity ?? acceleration`, `Math.hypot(...) / 9.81`. No `^` misuse. |
| 2 | ObservableGauge callback leak | PASS | `grep addCallback` only lines 100–106 inside `startTelemetry`. G-force / GPS intervals set `latestG`, `latestLat` etc. only (lines 213, 262–264). |
| 3 | deviceorientation listener pile-up | PASS | Single `addEventListener("deviceorientation", orientationHandler)` at 200–217; no `orientationInterval`. `removeEventListener` in `stopTracking` 275–278. |
| 4 | Inverted wake-lock handler | PASS | `index.html` 93–97: `visibilityState === 'visible'` → `await acquire()`. No `release()` on visible. |
| 5 | keepScreenActive synthetic click | PASS | `grep keepScreenActive` in repo: only in `plans/*.md` and input plan — not in `index.html` or TS. |
| 6 | gpsInterval vs UI interval | PASS | `gpsInterval` removed; `watchPosition` options line 248–249 `maximumAge: telemetryInterval`. |
| 7 | GPS watcher leak on re-Start | PASS | `startTracking` 182–183 `if (trackingActive) return; trackingActive = true`. Start click 114 `if (trackingActive) return`. |
| 8 | Null-deref on version element | PASS | Lines 29–31: `versionEl` + conditional `textContent`. |
| 9 | meterProvider.shutdown race | PASS | `stopTelemetry` 109–111 `await meterProvider.shutdown()`. `stopTracking` async, `await stopTelemetry()` 298. Interval handler 159–165 `await stopTracking()`. Pause 167–176 `await stopTracking()`. |
| 10 | Orientation cleanup in stopTracking | PASS | Same as row 3: `orientationHandler` removed and nulled in `stopTracking`. |

## Failures

None.

## Unverified

- **Field / UX (optional):** Resting ~1 g on a physical iOS/Android device, wake lock after app switch, DevTools Event Listener count over time, Network duplicate export batches — not executed in this verification environment. Implementation matches the specified fixes; recommend a short manual smoke test on device.

## Edge cases probed

- **Static:** Confirmed `stopTracking` clears `gpsWatchId`, intervals, motion + orientation listeners before awaiting shutdown (order avoids new events during teardown initiation).
- **Static:** Rapid Start blocked by `trackingActive` guard on button and idempotent `startTracking`.
- **Static:** Resume path calls `startTracking()` when `trackingActive` is false after pause — second `startTracking` entry proceeds correctly.
- **Device / browser:** Not exercised here.

## Overall recommendation

**ACCEPT** — Code and docs match the detailed plan; build and `tsc` succeed. Manual device checks remain optional follow-up.

---

```
STATUS: PASS
VERIFY_REPORT: plans/bug-fixes.verify.md
ITEMS_PASSED: 10/10
EDGE_CASES_PROBED: 4
```
