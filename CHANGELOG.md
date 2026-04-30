# Changelog

All notable changes are recorded here, grouped by the plan that produced them.
Categories: Bugfix, Enhancement, Improvement, Other.
Entries are appended only on a successful or partial verifier PASS.

## 2026-04-30 — plans/sprint.md (2/2 items, 2 loop(s))

### Improvement
- Keeps generated output out of version control so diffs stay source-focused and the bundle cannot drift silently from `motion_capture.ts` — `.gitignore:3` (item: Stop committing the compiled bundle)
- Shrinks the repository and ensures future commits only reflect TypeScript and config changes until CI builds the bundle — `motion_capture.js` (removed from git index) (item: Stop committing the compiled bundle)
- Clones no longer contain the bundle file, so contributors need an explicit reminder to build once — `README.md` (item: Stop committing the compiled bundle)
- CI can run `npm run lint` as specified in the sprint plan while reusing the existing TypeScript toolchain — `package.json` (item: Add a GitHub Actions CI/CD workflow)
- Deployed builds expose the git short SHA as `frontend.version` and UI version without manual bumps — `motion_capture.ts`, `scripts/build-bundle.cjs` (item: Add a GitHub Actions CI/CD workflow)
- iOS Safari benefits from a versioned script URL; CI ties it to the same SHA as the bundle — `index.html:79` (item: Add a GitHub Actions CI/CD workflow)

### Other
- Automated validation and Pages publish replace manual version-bump pushes — `.github/workflows/deploy.yml` (item: Add a GitHub Actions CI/CD workflow)
- Maintainers know how deploy and versioning work without reading the YAML — `README.md` (item: Add a GitHub Actions CI/CD workflow)

## 2026-04-30 — plans/sprint.md (2/2 items, 2 loop(s))

### Bugfix
- GPS speed falls back to distance-over-time between fixes when native `coords.speed` is missing, invalid, or zero so iOS devices report movement instead of always 0 — `motion_capture.ts` (item: BUG: GPS location speed is not updated)
- Retune GPS Kalman filters to near-passthrough (`R: 1, Q: 1e-5`), re-instantiate them on `startTracking` to clear stale state, and force fresh fixes with `maximumAge: 0` so iOS Safari tracks small movements instead of latching to a smoothed/cached position — `motion_capture.ts` (follow-up to BUG: GPS location speed is not updated)
- Replace `watchPosition` (which fires once and stops on iOS Safari) with `getCurrentPosition` polled at the telemetry interval, guarded against overlapping in-flight requests, so GPS keeps updating on Safari/iOS — `motion_capture.ts` (follow-up to BUG: GPS location speed is not updated)
- Discourage HTML/asset caching with cache-control meta tags, a versioned script URL, and a `pageshow`/bfcache reload so freshly deployed versions actually load on iOS Safari — `index.html`

### Enhancement
- Show "(last fix Xs ago)" in the GPS readout so it's obvious when iOS isn't delivering fresh fixes — `motion_capture.ts`

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
