# Changelog

All notable changes are recorded here, grouped by the plan that produced them.
Categories: Bugfix, Enhancement, Improvement, Other.
Entries are appended only on a successful or partial verifier PASS.

## 2026-04-30 — plans/sprint.md (2/2 items, 2 loop(s))

### Bugfix
- GPS speed falls back to distance-over-time between fixes when native `coords.speed` is missing, invalid, or zero so iOS devices report movement instead of always 0 — `motion_capture.ts` (item: BUG: GPS location speed is not updated)
- Retune GPS Kalman filters to near-passthrough (`R: 1, Q: 1e-5`), re-instantiate them on `startTracking` to clear stale state, and force fresh fixes with `maximumAge: 0` so iOS Safari tracks small movements instead of latching to a smoothed/cached position — `motion_capture.ts` (follow-up to BUG: GPS location speed is not updated)

### Enhancement
- Per-axis accelerometer samples are stored, exported as `accelerometer_x` / `accelerometer_y` / `accelerometer_z`, and shown next to g-force in the UI — `motion_capture.ts` (item: Emit the accelerometer X, Y, Z axes)

### Other
- Document the three accelerometer axis metric names alongside the existing telemetry overview — `README.md` (item: Emit the accelerometer X, Y, Z axes)

## 2026-04-30 — plans/bug-fixes.md (10/10 passed, 1 loop(s))

### Bugfix
- Correct g-force with `Math.hypot` and gravity-inclusive acceleration so Splunk sees meaningful motion data — `motion_capture.ts:185` (item: Broken g-force formula)
- Register each ObservableGauge callback once so export reads stable values and memory does not grow with ticks — `motion_capture.ts:100` (item: ObservableGauge callback leak)
- Use one persistent `deviceorientation` listener and remove it on stop so listeners do not pile up — `motion_capture.ts:200` (item: `deviceorientation` listener pile-up)
- Re-acquire screen wake lock when the page becomes visible again instead of releasing on visible — `index.html:93` (item: Inverted wake-lock visibility handler)
- Remove the ineffective synthetic click “keep awake” interval; Wake Lock is the supported mechanism — `index.html:73` (item: Ineffective `keepScreenActive` synthetic click loop)
- Align GPS `maximumAge` with the UI telemetry interval — `motion_capture.ts:248` (item: `gpsInterval` not driven by UI interval)
- Guard Start and `startTracking()` so a second `watchPosition` cannot be created while already tracking — `motion_capture.ts:182` (item: GPS watcher leak on re-Start)
- Await `meterProvider.shutdown()` and async `stopTracking()` before restarting so OTLP exports do not race — `motion_capture.ts:109` (item: `meterProvider.shutdown()` race on restart)
- Remove `deviceorientation` in `stopTracking()` so paused sessions do not feed stale orientation into new telemetry — `motion_capture.ts:275` (item: Missing cleanup of orientation listener in `stopTracking`)

### Improvement
- Hold latest metric samples in module scope for gauges instead of registering new callbacks every interval — `motion_capture.ts:52` (item: latest values for ObservableGauge pattern)
- Avoid throwing if the version DOM node is missing — `motion_capture.ts:29` (item: Null-deref risk on version element)

### Other
- Refresh README further-actions checklist for configurable interval and Wake Lock — `README.md:40` (item: Documentation impact)
