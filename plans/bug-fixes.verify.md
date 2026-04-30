# Verification report: bug-fixes

## Per-item table (input plan `plans/bug-fixes.md`)

| Id | Title | Status | Evidence |
|----|--------|--------|----------|
| 1 | Broken g-force formula | PASS | `motion_capture.ts` lines 189–195: `accelerationIncludingGravity ?? acceleration`, `Math.hypot(...) / 9.81`. No `^` misuse. Field-confirmed: production `g_force` for `player.name=Wakelock` (`frontend.version=1.0.14`) reads ~1.00–1.14 at rest with brief excursions to 2.34 during motion. |
| 2 | ObservableGauge callback leak | PASS | `grep addCallback` only lines 100–106 inside `startTelemetry`. G-force / GPS intervals set `latestG`, `latestLat` etc. only (lines 213, 262–264). Field-confirmed: 117 datapoints / 145 s with 116 distinct values per metric (no stale-closure repetition). |
| 3 | deviceorientation listener pile-up | PASS | Single `addEventListener("deviceorientation", orientationHandler)` at 200–217; no `orientationInterval`. `removeEventListener` in `stopTracking` 275–278. Field-confirmed: exactly one `gyroscope_alpha` series, no doubling. |
| 4 | Inverted wake-lock handler | PASS | `index.html` 93–97: `visibilityState === 'visible'` → `await acquire()`. No `release()` on visible. Field-confirmed: after a 30 s background interval the session resumed automatically and exported continuously for ~85 s without a second sleep-induced gap. |
| 5 | keepScreenActive synthetic click | PASS | `grep keepScreenActive` in repo: only in `plans/*.md` and input plan — not in `index.html` or TS. |
| 6 | gpsInterval vs UI interval | PASS | `gpsInterval` removed; `watchPosition` options line 248–249 `maximumAge: telemetryInterval`. Field-confirmed: `gps_speed` cadence aligned with `g_force` / `gyroscope_alpha`. |
| 7 | GPS watcher leak on re-Start | PASS | `startTracking` 182–183 `if (trackingActive) return; trackingActive = true`. Start click 114 `if (trackingActive) return`. Field-confirmed: only one series per metric in production. |
| 8 | Null-deref on version element | PASS | Lines 29–31: `versionEl` + conditional `textContent`. |
| 9 | meterProvider.shutdown race | PASS | `stopTelemetry` 109–111 `await meterProvider.shutdown()`. `stopTracking` async, `await stopTelemetry()` 298. Interval handler 159–165 `await stopTracking()`. Pause 167–176 `await stopTracking()`. Field-confirmed: clean restart at 11:11:55 UTC with no half-shutdown export overlap. |
| 10 | Orientation cleanup in stopTracking | PASS | Same as row 3: `orientationHandler` removed and nulled in `stopTracking`. |

## Failures

None.

## Unverified

- None. Field validation completed on 2026-04-30 (see "Field validation" below).

## Field validation — 2026-04-30

Manual smoke test executed against the deployed build (`frontend.version=1.0.14`) and metrics queried via the Splunk Observability MCP server (`o11y_execute_signalflow_program`) for `player.name=Wakelock` over the 1 h window ending ~13:13 CEST.

- **Resting g-force:** ~1.00–1.14 with motion peaks to 2.34 — corroborates fix item 1.
- **Background → foreground gap:** exactly one 30 s gap appears synchronously across `g_force`, `gyroscope_alpha`, and `gps_speed` (11:11:25 → 11:11:55 UTC). Resume is automatic; no manual Start press required.
- **Continuity after resume:** ~85 s of continuous exports until the user paused. The pre-fix release-on-visible bug would have caused a *second* gap when the screen slept again — none observed. This is the strongest behavioural proof of fix item 4.
- **Stale-tick pattern (expected, not a bug):** the first post-resume sample equals the last pre-gap sample by design (exporter wakes ~1 s before the sensor `setInterval` ticks again); the 2nd post-resume sample is already fresh:

  | Metric | Last pre-gap | First post-gap | Second post-gap |
  |---|---|---|---|
  | `g_force` | 1.0582 | 1.0582 (persisted) | 1.1913 (fresh) |
  | `gyroscope_alpha` | 4.5581 | 4.5581 (persisted) | 6.2488 (fresh) |

  Confirms fix items 2, 3, 5: gauges read `latest*` once per export rather than accumulating closures or repeating stale values across many exports.
- **Metric cardinality:** 117 datapoints / 145 s, with 116 distinct rounded values for `g_force` and `gyroscope_alpha` — sensors and intervals all resumed cleanly post-foreground.

## Edge cases probed

- **Static:** Confirmed `stopTracking` clears `gpsWatchId`, intervals, motion + orientation listeners before awaiting shutdown (order avoids new events during teardown initiation).
- **Static:** Rapid Start blocked by `trackingActive` guard on button and idempotent `startTracking`.
- **Static:** Resume path calls `startTracking()` when `trackingActive` is false after pause — second `startTracking` entry proceeds correctly.
- **Field:** Single 30 s background interval cleanly bracketed across all three metrics (no orphan series, no double-tracking, no second sleep-gap during the post-resume foreground window).

## Overall recommendation

**ACCEPT** — Code, docs, build, `tsc`, and production telemetry all corroborate the detailed plan. No outstanding items.

---

```
STATUS: PASS
VERIFY_REPORT: plans/bug-fixes.verify.md
ITEMS_PASSED: 10/10
EDGE_CASES_PROBED: 4
FIELD_VALIDATED: 2026-04-30 (player.name=Wakelock, frontend.version=1.0.14)
```
