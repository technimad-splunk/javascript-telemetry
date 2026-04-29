# Bug Fix Plan

Each entry follows the structure: **Problem**, **Where**, **Why it matters**, **Proposed fix** (with code snippet), **Verification**.

---

## 1. Broken g-force formula

**Problem**
The g-force calculation in the `devicemotion` handler uses `^` (bitwise XOR), not `**` or `Math.pow` for exponentiation, and the parentheses are wrong. Additionally, `event.acceleration` on iOS excludes gravity, so the resting reading is ~0 instead of ~1 g.

**Where**
[`motion_capture.ts`](../motion_capture.ts) line 164:
```ts
let gForce = Math.sqrt(accel.x ^ (2 + accel.y) ^ (2 + accel.z) ^ 2) / 9.81;
```

**Why it matters**
The metric being sent to Splunk is numerically wrong. g-force is the primary derived signal of this app; garbage data here undermines the entire PoC.

**Proposed fix**
Use `Math.hypot` (clean, avoids manual squaring) and prefer `accelerationIncludingGravity` so iOS returns ~1 at rest, matching Android behaviour:
```ts
motionHandler = (event: DeviceMotionEvent) => {
    const a = event.accelerationIncludingGravity ?? event.acceleration;
    if (!a) return;

    const gForce = Math.hypot(a.x ?? 0, a.y ?? 0, a.z ?? 0) / 9.81;
    gForceSamples.push(gForce);
};
```

**Verification**
- Hold the phone still: readout should show ~1.0 g.
- Place flat on a table: readout should show ~1.0 g (gravity on Z axis).
- Lift and drop slightly: readout should spike above 1 on catch.

---

## 2. ObservableGauge callback leak

**Problem**
`metrics.g.addCallback(...)`, `metrics.alpha.addCallback(...)`, etc. are called inside interval handlers. Each call registers an *additional* callback; there is no removal or replacement. After N ticks the OTel exporter runs N callbacks on every export cycle, each observing a stale closure value.

**Where**
[`motion_capture.ts`](../motion_capture.ts) lines 189, 201–209, 257–265:
```ts
// called every `telemetryInterval` ms:
metrics.g.addCallback((observer) => observer.observe(gForce));
metrics.alpha.addCallback((observer) => observer.observe(event.alpha || 0));
// ... etc.
```

**Why it matters**
Memory grows unboundedly. The metric value seen by Splunk is undefined (whichever stale callback runs last wins). After a long session the browser tab may crash.

**Proposed fix**
Introduce module-scoped "latest value" variables. Register each callback **once** inside `startTelemetry()`, reading from those variables. The interval handlers only update the variables.

```ts
// Module scope — latest observed values
let latestG = 0;
let latestAlpha = 0, latestBeta = 0, latestGamma = 0;
let latestLat = 0, latestLon = 0, latestSpeed = 0;

// Inside startTelemetry() — register ONCE
metrics.g!.addCallback((o) => o.observe(latestG));
metrics.alpha!.addCallback((o) => o.observe(latestAlpha));
metrics.beta!.addCallback((o) => o.observe(latestBeta));
metrics.gamma!.addCallback((o) => o.observe(latestGamma));
metrics.latitude!.addCallback((o) => o.observe(latestLat));
metrics.longitude!.addCallback((o) => o.observe(latestLon));
metrics.speed!.addCallback((o) => o.observe(latestSpeed));

// Inside the g-force interval handler — only update the variable:
latestG = gForce;

// Inside the GPS interval handler — only update variables:
latestLat = filteredLat!;
latestLon = filteredLon!;
latestSpeed = gpsMaxSpeed;
```

**Verification**
Open DevTools memory profiler; after 5 minutes, callback count per gauge should remain constant at 1.

---

## 3. `deviceorientation` listener pile-up

**Problem**
A `setInterval` repeatedly calls `window.addEventListener("deviceorientation", handler, { once: true })`. `{ once: true }` auto-removes the listener only after the event fires — if the interval ticks before the previous event has fired (or if events arrive slowly), multiple listeners accumulate.

**Where**
[`motion_capture.ts`](../motion_capture.ts) lines 193–214:
```ts
orientationInterval = window.setInterval(() => {
    window.addEventListener(
        "deviceorientation",
        (event) => {
            // ...
            metrics.alpha.addCallback(...);
        },
        { once: true },
    );
}, telemetryInterval);
```

**Why it matters**
Combined with bug 2, this doubles the rate at which stale callbacks accumulate. Even after fixing bug 2, listener pile-up wastes event processing time and produces duplicate updates.

**Proposed fix**
Register the `deviceorientation` listener **once** in `startTracking()`. Store the latest values in module-scoped variables (shared with the fix for bug 2). Remove the interval entirely.

```ts
let lastAlpha = 0, lastBeta = 0, lastGamma = 0;

const orientationHandler = (e: DeviceOrientationEvent) => {
    lastAlpha = e.alpha ?? 0;
    lastBeta  = e.beta  ?? 0;
    lastGamma = e.gamma ?? 0;

    if (gyroDisplay) {
        gyroDisplay.textContent =
            `Alpha: ${lastAlpha.toFixed(2)}, Beta: ${lastBeta.toFixed(2)}, Gamma: ${lastGamma.toFixed(2)}`;
    }
};

window.addEventListener("deviceorientation", orientationHandler);
// Remove orientationInterval entirely — no setInterval needed.
```

The OTel callbacks (registered once per bug-2 fix) will read `lastAlpha/Beta/Gamma` on each export tick automatically.

Also remove `clearInterval(orientationInterval)` from `stopTracking()` and replace with:
```ts
window.removeEventListener("deviceorientation", orientationHandler);
```

**Verification**
Open DevTools → Event Listeners panel on `window`; after 60 s there should be exactly 1 `deviceorientation` entry.

---

## 4. Inverted wake-lock visibility handler

**Problem**
The `visibilitychange` handler releases the wake lock when the page becomes *visible* and tries to re-acquire it when hidden. The Wake Lock API already releases the lock automatically when the page is hidden — the re-acquire should happen when the page returns to visible.

**Where**
[`index.html`](../index.html) lines 81–93:
```js
document.addEventListener('visibilitychange', async () => {
    if (document.visibilityState === 'visible' && !wakeLock.released) {
        wakeLock.release();          // ← wrong: this RELEASES on visible
    } else if (document.visibilityState === 'hidden') {
        // ← wrong: lock is already auto-released here, and re-acquiring
        //   from the hidden state has no effect
        const newWakeLock = await navigator.wakeLock.request('screen');
    }
});
```

**Why it matters**
The wake lock effectively does nothing after the first visibility change. The screen dims normally.

**Proposed fix**
```js
async function requestWakeLock() {
    if (!('wakeLock' in navigator)) {
        console.warn('Wake Lock API not supported in this browser.');
        return;
    }

    let wakeLock = null;

    async function acquire() {
        try {
            wakeLock = await navigator.wakeLock.request('screen');
            console.log('Wake Lock active');
        } catch (err) {
            console.error(`${err.name}: ${err.message}`);
        }
    }

    await acquire();

    document.addEventListener('visibilitychange', async () => {
        if (document.visibilityState === 'visible') {
            await acquire(); // re-acquire after returning to foreground
        }
    });
}

requestWakeLock();
```

**Verification**
Open the app and leave it foregrounded: screen should stay on indefinitely. Switch to another app and back: screen should stay on again.

---

## 5. Ineffective `keepScreenActive` synthetic click loop

**Problem**
`keepScreenActive()` dispatches a synthetic `MouseEvent` every 60 seconds in the hope of resetting the OS idle timer. Synthetic programmatic input does not reset the system idle timer on iOS or Android.

**Where**
[`index.html`](../index.html) lines 104–112:
```js
function keepScreenActive() {
    if ('wakeLock' in navigator) {
        setInterval(() => {
            document.dispatchEvent(new MouseEvent('click', { view: window, bubbles: true, cancelable: true }));
        }, 60000);
    }
}
keepScreenActive();
```

**Why it matters**
The function provides false confidence that the screen will stay awake. It also adds noise to click event handlers. Wake Lock (bug 4) is the only correct mechanism.

**Proposed fix**
Delete `keepScreenActive()` and its invocation. The corrected `requestWakeLock()` from bug 4 is sufficient.

**Verification**
Remove the function; verify with `grep` that no remaining code references it.

---

## 6. `gpsInterval` not driven by UI interval

**Problem**
`gpsInterval` is hard-coded to 500 ms and is used as `maximumAge` for `watchPosition`. It is never updated when the user changes the telemetry interval input, meaning GPS cache age and telemetry export frequency are permanently decoupled.

**Where**
[`motion_capture.ts`](../motion_capture.ts) lines 39 and 234–237:
```ts
let gpsInterval: number = 500; // never changes

// ...
{
    enableHighAccuracy: true,
    maximumAge: gpsInterval,  // always 500, ignores telemetryInterval
    timeout: 10000,
}
```

**Why it matters**
At a 5 s telemetry interval the GPS would still churn at 500 ms, wasting battery. At a 100 ms interval the GPS would be capped at 500 ms, giving stale positions.

**Proposed fix**
Remove `gpsInterval` and derive `maximumAge` from `telemetryInterval` directly:
```ts
{
    enableHighAccuracy: true,
    maximumAge: telemetryInterval,
    timeout: 10000,
}
```
The existing `interval` change handler in [`motion_capture.ts`](../motion_capture.ts) lines 139–146 already calls `stopTracking()` + `startTracking()` when the user changes the value, which will restart `watchPosition` with the new `maximumAge`. No additional change is needed there.

**Verification**
Set interval to 2000 ms; confirm in browser network tab that the GPS position used per export batch is no older than ~2 s.

---

## 7. GPS watcher leak on re-Start

**Problem**
If the user clicks "Start Sensors" again without first pausing, `startTracking()` is called while `trackingActive` is already `true`. A second `watchPosition` is registered; the original `gpsWatchId` is overwritten, so the first watcher is never cleared.

**Where**
[`motion_capture.ts`](../motion_capture.ts) lines 96–137 (Start button handler) and line 217 (`watchPosition` call):
```ts
// Start handler calls startTracking() unconditionally
document.getElementById("requestPermission")?.addEventListener("click", () => {
    // ... no guard on trackingActive
    startTracking();
});

// Inside startTracking:
gpsWatchId = navigator.geolocation.watchPosition(...); // overwrites previous id
```

**Why it matters**
Each orphaned watcher continues to fire position events and push to `latestPositions`, creating duplicate data and background processing.

**Proposed fix**
Guard `startTracking()` and the Start handler:
```ts
function startTracking(): void {
    if (trackingActive) return; // idempotency guard
    // ... rest of function
}
```
Also update the Start button handler to check:
```ts
if (!trackingActive) {
    // proceed with permission request and startTracking()
}
```

**Verification**
Click "Start Sensors" three times rapidly; confirm in DevTools Network tab that only one stream of telemetry exports is running.

---

## 8. Null-deref risk on version element

**Problem**
`document.getElementById("version")` may return `null` if the element is missing from the DOM, but `.textContent` is accessed without a null check.

**Where**
[`motion_capture.ts`](../motion_capture.ts) line 30:
```ts
document.getElementById("version").textContent = version;
```

**Why it matters**
With `"strict": true` in TypeScript (a separate improvement item), this would be a type error. At runtime it throws if the element is absent, preventing the rest of the module from initialising.

**Proposed fix**
```ts
const versionEl = document.getElementById("version");
if (versionEl) versionEl.textContent = version;
```

**Verification**
Enable TypeScript strict mode; `tsc --noEmit` should pass with no error on this line.

---

## 9. `meterProvider.shutdown()` race on restart

**Problem**
`stopTelemetry()` calls `meterProvider.shutdown()` but does not await the returned Promise. When the user changes the interval (triggering `stopTracking()` then `startTracking()`), the new `MeterProvider` is constructed before the previous provider has finished flushing its final export batch.

**Where**
[`motion_capture.ts`](../motion_capture.ts) lines 92–94:
```ts
function stopTelemetry() {
    meterProvider.shutdown(); // Promise not awaited
}
```
And the interval change handler at lines 139–146:
```ts
if (trackingActive) {
    stopTracking();   // calls stopTelemetry() synchronously
    startTracking();  // immediately creates new MeterProvider
}
```

**Why it matters**
The previous provider's in-flight HTTP export may race against the new provider's first export, causing duplicate or out-of-order metric points at the Splunk ingest endpoint.

**Proposed fix**
Make the lifecycle async:
```ts
async function stopTelemetry(): Promise<void> {
    await meterProvider.shutdown();
}

async function stopTracking(): Promise<void> {
    trackingActive = false;
    if (motionHandler) {
        window.removeEventListener("devicemotion", motionHandler);
    }
    window.removeEventListener("deviceorientation", orientationHandler);
    if (gpsWatchId !== null) {
        navigator.geolocation.clearWatch(gpsWatchId);
        gpsWatchId = null;
    }
    clearInterval(gpsProcessingInterval!);
    gpsProcessingInterval = null;
    clearInterval(gForceProcessingInterval!);
    gForceProcessingInterval = null;
    latestPositions = [];
    gpsMaxSpeed = 0;
    gForceSamples = [];
    await stopTelemetry();
}
```
Update the interval change handler to await:
```ts
document.getElementById("interval")?.addEventListener("change", async (event) => {
    telemetryInterval = parseInt((event.target as HTMLInputElement).value) || 1000;
    if (trackingActive) {
        await stopTracking();
        startTracking();
    }
});
```

**Verification**
Change the interval rapidly several times; confirm in Network tab that no duplicate metric names appear in the same export batch.

---

## 10. Missing cleanup of orientation listener in `stopTracking`

**Problem**
After applying the fix for bug 3 (registering `orientationHandler` once as a real persistent listener), `stopTracking()` must also remove it. Currently only `clearInterval(orientationInterval)` is present, which will become a no-op once the interval is removed.

**Where**
[`motion_capture.ts`](../motion_capture.ts) lines 275–298:
```ts
function stopTracking(): void {
    // ...
    clearInterval(orientationInterval); // ← becomes irrelevant after bug-3 fix
    // orientationHandler listener is never removed
}
```

**Why it matters**
A dangling `deviceorientation` listener continues to update `lastAlpha/Beta/Gamma` after tracking has been stopped. If the user pauses and resumes, the OTel callbacks (re-registered by bug-2 fix in the new `startTelemetry()`) will immediately begin reading stale orientation data from the previous session.

**Proposed fix**
Store `orientationHandler` at module scope (already required by the bug-3 fix) and remove it in `stopTracking()`:
```ts
// module scope
let orientationHandler: ((e: DeviceOrientationEvent) => void) | null = null;

// in startTracking():
orientationHandler = (e: DeviceOrientationEvent) => { ... };
window.addEventListener("deviceorientation", orientationHandler);

// in stopTracking():
if (orientationHandler) {
    window.removeEventListener("deviceorientation", orientationHandler);
    orientationHandler = null;
}
```

**Verification**
Start tracking, then pause. Confirm in DevTools → Event Listeners on `window` that no `deviceorientation` listener is present after pausing.
