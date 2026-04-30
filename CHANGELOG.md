# Changelog

All notable changes are recorded here, grouped by the plan that produced them.
Categories: Bugfix, Enhancement, Improvement, Other.
Entries are appended only on a successful or partial verifier PASS.

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
