# Detailed implementation plan: bug-fixes

## Goal

Fix incorrect motion/GPS telemetry, ObservableGauge listener leaks, wake-lock behaviour, and lifecycle races in the motion-capture web app so metrics and browser resources stay correct over long sessions.

## Inputs consumed

- `plans/bug-fixes.md` — full input specification (10 items)
- `motion_capture.ts` — lines 1–298 (entire module: telemetry, tracking, UI wiring)
- `index.html` — lines 1–115 (wake lock inline script, footer version element)
- `package.json` — scripts: `build` (esbuild), no `test`/`lint`
- `README.md` — Further actions / project context

## Sequenced steps

### Step 1 — G-force and acceleration source

- **File:** `motion_capture.ts`
- **Change:** In `motionHandler`, use `event.accelerationIncludingGravity ?? event.acceleration`, null-coalesce components, compute `gForce` with `Math.hypot(a.x ?? 0, a.y ?? 0, a.z ?? 0) / 9.81` (remove broken `^` expression).
- **Diff sketch:**
  ```ts
  const a = event.accelerationIncludingGravity ?? event.acceleration;
  if (!a) return;
  const gForce = Math.hypot(a.x ?? 0, a.y ?? 0, a.z ?? 0) / 9.81;
  gForceSamples.push(gForce);
  ```
- **Dependencies:** none
- **Category:** `bugfix`
- **Why:** Restores numerically correct g-force and ~1 g at rest on iOS so Splunk receives meaningful motion data.

### Step 2 — Module-scoped latest metric values

- **File:** `motion_capture.ts`
- **Change:** Add module-scope `latestG`, `latestAlpha`, `latestBeta`, `latestGamma`, `latestLat`, `latestLon`, `latestSpeed` (numbers, initialised to 0). Remove any use of `gpsInterval` member (handled in step 6).
- **Diff sketch:**
  ```ts
  let latestG = 0;
  let latestAlpha = 0, latestBeta = 0, latestGamma = 0;
  let latestLat = 0, latestLon = 0, latestSpeed = 0;
  ```
- **Dependencies:** none (used by steps 3–5)
- **Category:** `improvement`
- **Why:** Gives ObservableGauge callbacks a single stable read path instead of registering new closures every tick.

### Step 3 — Register ObservableGauge callbacks once in `startTelemetry`

- **File:** `motion_capture.ts`
- **Change:** After creating each observable gauge, call `addCallback` exactly once per metric to observe the corresponding `latest*` variable. Remove all `addCallback` calls from interval handlers and orientation path.
- **Diff sketch:**
  ```ts
  metrics.g!.addCallback((o) => o.observe(latestG));
  metrics.alpha!.addCallback((o) => o.observe(latestAlpha));
  // ... beta, gamma, latitude, longitude, speed
  ```
- **Dependencies:** Step 2
- **Category:** `bugfix`
- **Why:** Prevents unbounded callback accumulation and undefined “last stale closure wins” gauge values.

### Step 4 — Single `deviceorientation` listener; drop orientation interval

- **File:** `motion_capture.ts`
- **Change:** Define `orientationHandler` at module scope (`| null`). In `startTracking`, assign handler that updates `latestAlpha/Beta/Gamma` and `gyroDisplay`, then `addEventListener("deviceorientation", orientationHandler)` once. Remove `orientationInterval` and `setInterval` wrapper entirely. In `stopTracking`, remove `clearInterval(orientationInterval)` (replaced in step 9 by `removeEventListener`).
- **Diff sketch:**
  ```ts
  let orientationHandler: ((e: DeviceOrientationEvent) => void) | null = null;
  // startTracking: orientationHandler = (e) => { ... }; window.addEventListener(...);
  ```
- **Dependencies:** Steps 2–3
- **Category:** `bugfix`
- **Why:** Stops listener pile-up and duplicate orientation handling when intervals tick faster than events.

### Step 5 — Interval handlers only update latest values

- **File:** `motion_capture.ts`
- **Change:** In g-force processing interval, set `latestG = gForce` after computing `gForce` (no `addCallback`). In GPS processing interval, set `latestLat`, `latestLon`, `latestSpeed` from filtered/max values (no `addCallback`).
- **Dependencies:** Steps 2–3
- **Category:** `bugfix`
- **Why:** Aligns export path with one-callback-per-metric design.

### Step 6 — Tie GPS `maximumAge` to `telemetryInterval`

- **File:** `motion_capture.ts`
- **Change:** Delete `gpsInterval` variable; pass `maximumAge: telemetryInterval` in `watchPosition` options.
- **Dependencies:** none
- **Category:** `improvement`
- **Why:** Keeps GPS cache age aligned with user-selected telemetry interval to avoid stale data or wasted battery.

### Step 7 — Idempotent `startTracking` and Start button guard

- **File:** `motion_capture.ts`
- **Change:** At start of `startTracking`, `if (trackingActive) return;` then set `trackingActive = true`. Wrap body of `#requestPermission` click handler so permission/start flow runs only when `!trackingActive`.
- **Dependencies:** none
- **Category:** `bugfix`
- **Why:** Prevents orphan `watchPosition` instances when Start is pressed repeatedly.

### Step 8 — Safe version DOM update

- **File:** `motion_capture.ts`
- **Change:** Replace direct `.textContent` on `getElementById("version")` with optional element check.
- **Dependencies:** none
- **Category:** `improvement`
- **Why:** Avoids runtime throw and satisfies strict null checking when the element is absent.

### Step 9 — Async shutdown and orientation cleanup

- **File:** `motion_capture.ts`
- **Change:** `async function stopTelemetry(): Promise<void> { await meterProvider.shutdown(); }`. Make `stopTracking` async: remove `deviceorientation` via `orientationHandler` if set, await `stopTelemetry()`, fix other cleanup order as in input plan. Update `#interval` change handler to `async` and `await stopTracking()` before `startTracking()`. Update `#pauseTracking` to `await stopTracking()` / call `startTracking()` appropriately (pause branch async).
- **Dependencies:** Steps 3–4, 7
- **Category:** `bugfix`
- **Why:** Avoids MeterProvider export races on interval change and removes orientation listener when paused.

### Step 10 — Wake lock and remove synthetic click loop

- **File:** `index.html`
- **Change:** Replace inverted `visibilitychange` logic with plan’s pattern: `acquire()` helper, initial `await acquire()`, on `visibilityState === 'visible'` call `acquire()` again. Remove `keepScreenActive` and its invocation entirely.
- **Dependencies:** none
- **Category:** `bugfix`
- **Why:** Screen stays awake correctly when visible; removes misleading synthetic clicks.

### Step 11 — README alignment

- **File:** `README.md`
- **Change:** In “Further actions”, tick or reword items that are now accurate: configurable collection interval (already in UI), device sleep / wake lock (addressed by fix). One or two lines under “Learnings” or checklist — keep minimal.
- **Dependencies:** Step 10 (user-visible wake/interval behaviour)
- **Category:** `other`
- **Why:** Keeps repo docs consistent with actual behaviour for readers and agents.

## Assumptions accepted

- **Medium:** `accelerationIncludingGravity` is appropriate for “total” g on both Android and iOS for this PoC; user accepts semantic match to Android-like ~1 g at rest.
- **Low:** No tests exist; verification relies on `tsc`, `npm run build`, and static review.
- **Low:** `DeviceOrientationEvent` still gated with `window.DeviceOrientationEvent` before adding listener (same as today).

## Risks & mitigations

- **Async `stopTracking`:** Callers must not assume synchronous teardown; all internal call sites updated in step 9.
- **First export before any orientation event:** `latest*` stay 0 until first event — acceptable; matches prior “no data yet” behaviour.

## Out of scope

- TypeScript `strict` mode project-wide (item 8 verification mentions it; we only fix the null dereference).
- Changing OTLP endpoint, metric names, or API gateway.
- iOS `DeviceOrientationEvent.requestPermission` flow (unchanged).

## Documentation impact

| File | Section | Change |
|------|---------|--------|
| `README.md` | Further actions | Mark “Make data collection interval configurable” done; update “Prevent device sleep” to reflect Wake Lock fix in app |

## Success criteria

1. **G-force:** `motion_capture.ts` uses `Math.hypot` and `accelerationIncludingGravity ?? acceleration` for the motion handler.
2. **Callbacks:** `grep -n "addCallback"` shows only registrations inside `startTelemetry`, not inside `setInterval` for g/GPS/orientation.
3. **Orientation:** No `orientationInterval` identifier; single `addEventListener("deviceorientation"` in `startTracking`; `removeEventListener` in `stopTracking` when handler non-null.
4. **Wake lock:** `index.html` acquires on visible; no `release` on visible-only path that matches old bug; `grep keepScreenActive` returns no matches.
5. **GPS:** `watchPosition` options use `maximumAge: telemetryInterval`; no `gpsInterval` variable.
6. **Start idempotency:** `startTracking` begins with `if (trackingActive) return` before setting true; Start handler checks `!trackingActive`.
7. **Version:** `getElementById("version")` assigned to variable, conditional `textContent`.
8. **Shutdown:** `stopTelemetry` uses `await meterProvider.shutdown()`; `stopTracking` is async and awaited from interval and pause paths where restart follows.
9. **Build:** `npx tsc --noEmit` and `npm run build` exit 0.
10. **README:** Further actions reflects interval + sleep/wake lock status per Documentation impact.

## Confidence

**93%** — Input plan maps cleanly to current files; async propagation to all `stopTracking` call sites needs careful verification (one cycle).

## Planner output

```
STATUS: READY
PLAN_PATH: plans/bug-fixes.plan.md
CONFIDENCE: 93
SUMMARY: Ten bugs are addressed via sequenced changes in motion_capture.ts (metrics, motion, GPS, lifecycle) and index.html (wake lock), plus a small README checklist update. No open high-impact product ambiguities.
```
