# Build log: bug-fixes

## Files changed

### code
- `motion_capture.ts` — full module rewrite (~180–310): g-force `Math.hypot` + `accelerationIncludingGravity`, module `latest*` gauges, single `startTelemetry` `addCallback` registrations, single `deviceorientation` listener + cleanup, `maximumAge: telemetryInterval`, idempotent `startTracking` + Start guard, safe version element, async `stopTelemetry`/`stopTracking`, awaited interval/pause handlers
- `index.html` — lines 73–101: wake lock `acquire` on visible, removed `keepScreenActive` synthetic click loop

### docs
- `README.md` — Further actions checklist (interval + device sleep items)

## Per-step status (vs `plans/bug-fixes.plan.md`)

1. G-force formula + acceleration source — **PASS**
2. Module-scoped latest values — **PASS**
3. ObservableGauge callbacks once in `startTelemetry` — **PASS**
4. Single `deviceorientation` listener — **PASS**
5. Intervals only update `latest*` — **PASS**
6. GPS `maximumAge` from `telemetryInterval` — **PASS**
7. Idempotent `startTracking` + Start guard — **PASS**
8. Version element null-safe — **PASS**
9. Async shutdown + orientation `removeEventListener` — **PASS**
10. Wake lock + remove synthetic clicks — **PASS**
11. README Further actions — **PASS**

## Documentation updates

- **README.md / Further actions:** DONE — marked configurable interval and device sleep (Wake Lock) as complete per `Documentation impact`.

## Deviations

- None. `index.html` uses `err.name + ': ' + err.message` in `catch` (plan used template literals); equivalent behaviour.

## Build & test output

```text
$ npx tsc --noEmit
(exit 0)

$ npm run build
> esbuild motion_capture.ts --bundle --outfile=motion_capture.js --format=iife
  motion_capture.js  307.7kb
⚡ Done in 55ms
(exit 0)
```

No `npm test` or lint script in `package.json`.

---

```
STATUS: GREEN
BUILD_LOG: plans/bug-fixes.build.md
TESTS: tsc clean, esbuild ok, no test command configured
```
