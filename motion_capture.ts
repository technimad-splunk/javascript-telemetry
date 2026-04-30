import {
	MeterProvider,
	PeriodicExportingMetricReader,
} from "@opentelemetry/sdk-metrics";
import { ObservableGauge } from "@opentelemetry/api";
import { Resource } from "@opentelemetry/resources";
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-http";
// @ts-ignore
import KalmanFilter from "kalmanjs";

type SensorData = {
	x?: ObservableGauge;
	y?: ObservableGauge;
	z?: ObservableGauge;
	g?: ObservableGauge;
	alpha?: ObservableGauge;
	beta?: ObservableGauge;
	gamma?: ObservableGauge;
	latitude?: ObservableGauge;
	longitude?: ObservableGauge;
	speed?: ObservableGauge;
};

const version = "1.0.15";

const nameInput = document.getElementById("name") as HTMLInputElement;
const accelDisplay = document.getElementById("accel");
const gyroDisplay = document.getElementById("gyro");
const gpsDisplay = document.getElementById("gps");
const versionEl = document.getElementById("version");
if (versionEl) versionEl.textContent = version;

// Kalman filters for latitude and longitude
const latFilter = new KalmanFilter({ R: 0.1, Q: 2 });
const lonFilter = new KalmanFilter({ R: 0.1, Q: 2 });

let telemetryInterval = 1000;
let trackingActive = false;
let motionHandler: (event: DeviceMotionEvent) => void;
let orientationHandler: ((e: DeviceOrientationEvent) => void) | null = null;
let gpsWatchId: number | null = null;
let gForceSamples: number[] = [];
let gForceProcessingInterval: number | null = null;
let latestPositions: GeolocationPosition[] = [];
let gpsMaxSpeed = 0;
let gpsProcessingInterval: number | null = null;
let lastGpsFix: { lat: number; lon: number; timestamp: number } | null = null;

function haversineMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
	const earthRadiusM = 6371000;
	const toRad = (deg: number) => (deg * Math.PI) / 180;
	const dLat = toRad(lat2 - lat1);
	const dLon = toRad(lon2 - lon1);
	const sinDLat = Math.sin(dLat / 2);
	const sinDLon = Math.sin(dLon / 2);
	const a =
		sinDLat * sinDLat +
		Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * sinDLon * sinDLon;
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	return earthRadiusM * c;
}

/** Latest values read by ObservableGauge callbacks (registered once in startTelemetry). */
let latestG = 0;
let latestAlpha = 0;
let latestBeta = 0;
let latestGamma = 0;
let latestLat = 0;
let latestLon = 0;
let latestSpeed = 0;
let latestAccelX = 0;
let latestAccelY = 0;
let latestAccelZ = 0;

let meterProvider = new MeterProvider(); //placeholder for instrumentation after initialisation
let meter = null; //placeholder for instrumentation after initialisation
let metrics: SensorData = {};

function getEndpoint(): string {
	return "https://aior8w88kh.execute-api.eu-west-1.amazonaws.com/otlp/";
}

function createExporter(): PeriodicExportingMetricReader {
	const exporter = new OTLPMetricExporter({
		url: getEndpoint(),
		headers: {
			"Content-Type": "application/json",
		},
	});
	return new PeriodicExportingMetricReader({
		exporter,
		exportIntervalMillis: 1000,
	});
}

function startTelemetry() {
	let resource = new Resource({
		"player.name": nameInput.value,
		"frontend.version": version, // Custom dimension
	});
	meterProvider = new MeterProvider({
		resource: resource,
		readers: [createExporter()],
	});
	meter = meterProvider.getMeter("motion-sensor");

	metrics.x = meter.createObservableGauge("accelerometer_x");
	metrics.y = meter.createObservableGauge("accelerometer_y");
	metrics.z = meter.createObservableGauge("accelerometer_z");
	metrics.g = meter.createObservableGauge("g_force");
	metrics.alpha = meter.createObservableGauge("gyroscope_alpha");
	metrics.beta = meter.createObservableGauge("gyroscope_beta");
	metrics.gamma = meter.createObservableGauge("gyroscope_gamma");
	metrics.latitude = meter.createObservableGauge("gps_latitude");
	metrics.longitude = meter.createObservableGauge("gps_longitude");
	metrics.speed = meter.createObservableGauge("gps_speed");

	metrics.x!.addCallback((o) => o.observe(latestAccelX));
	metrics.y!.addCallback((o) => o.observe(latestAccelY));
	metrics.z!.addCallback((o) => o.observe(latestAccelZ));
	metrics.g!.addCallback((o) => o.observe(latestG));
	metrics.alpha!.addCallback((o) => o.observe(latestAlpha));
	metrics.beta!.addCallback((o) => o.observe(latestBeta));
	metrics.gamma!.addCallback((o) => o.observe(latestGamma));
	metrics.latitude!.addCallback((o) => o.observe(latestLat));
	metrics.longitude!.addCallback((o) => o.observe(latestLon));
	metrics.speed!.addCallback((o) => o.observe(latestSpeed));
}

async function stopTelemetry(): Promise<void> {
	await meterProvider.shutdown();
}

document.getElementById("requestPermission")?.addEventListener("click", () => {
	if (trackingActive) return;

	// Request motion sensor permission
	if (typeof (DeviceMotionEvent as any).requestPermission === "function") {
		(DeviceMotionEvent as any)
			.requestPermission()
			.then((permissionState: string) => {
				if (permissionState === "granted") {
					// Request GPS permission
					if (navigator.geolocation) {
						navigator.geolocation.getCurrentPosition(
							() => {
								// Permission granted, start tracking
								startTracking();
							},
							(error) => {
								alert("Location permission denied: " + error.message);
							},
						);
					} else {
						alert("Geolocation not supported by your browser");
					}
				} else {
					alert("Motion permission denied");
				}
			})
			.catch(console.error);
	} else {
		// If not iOS or if no explicit permission API, just try both
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				() => {
					startTracking();
				},
				(error) => {
					alert("Location permission denied: " + error.message);
				},
			);
		} else {
			startTracking();
		}
	}
});

document.getElementById("interval")?.addEventListener("change", async (event) => {
	telemetryInterval =
		parseInt((event.target as HTMLInputElement).value) || 1000;
	if (trackingActive) {
		await stopTracking();
		startTracking();
	}
});

document.getElementById("pauseTracking")?.addEventListener("click", async () => {
	if (trackingActive) {
		await stopTracking();
		document.getElementById("pauseTracking")!.textContent = "Resume Sensors";
	} else {
		startTracking();
		document.getElementById("pauseTracking")!.textContent = "Pause Sensors";
	}
});

function startTracking(): void {
	if (trackingActive) return;
	trackingActive = true;

	motionHandler = (event: DeviceMotionEvent) => {
		const a = event.accelerationIncludingGravity ?? event.acceleration;
		if (!a) return;

		latestAccelX = a.x ?? 0;
		latestAccelY = a.y ?? 0;
		latestAccelZ = a.z ?? 0;

		const gForce = Math.hypot(latestAccelX, latestAccelY, latestAccelZ) / 9.81;

		gForceSamples.push(gForce);
	};

	window.addEventListener("devicemotion", motionHandler);

	gForceProcessingInterval = window.setInterval(() => {
		if (gForceSamples.length === 0) return;
		let max_gForce = Math.max(...gForceSamples.map((v) => v));
		let min_gForce = Math.min(...gForceSamples.map((v) => v));
		let gForce = min_gForce * -1 > max_gForce ? min_gForce : max_gForce;

		if (accelDisplay) {
			accelDisplay.textContent = `x: ${latestAccelX.toFixed(2)}, y: ${latestAccelY.toFixed(
				2,
			)}, z: ${latestAccelZ.toFixed(2)} | g: ${gForce.toFixed(2)}`;
		}

		latestG = gForce;
		gForceSamples = [];
	}, telemetryInterval);

	if (window.DeviceOrientationEvent) {
		orientationHandler = (e: DeviceOrientationEvent) => {
			latestAlpha = e.alpha ?? 0;
			latestBeta = e.beta ?? 0;
			latestGamma = e.gamma ?? 0;

			if (gyroDisplay) {
				gyroDisplay.textContent = `Alpha: ${latestAlpha.toFixed(2)}, Beta: ${latestBeta.toFixed(2)}, Gamma: ${latestGamma.toFixed(2)}`;
			}
		};
		window.addEventListener("deviceorientation", orientationHandler);
	}

	if (navigator.geolocation) {
		gpsWatchId = navigator.geolocation.watchPosition(
			(position) => {
				latestPositions.push(position);

				const lat = position.coords.latitude;
				const lon = position.coords.longitude;
				const timestamp = position.timestamp;

				let nativeSpeed = position.coords.speed;
				if (
					nativeSpeed == null ||
					typeof nativeSpeed !== "number" ||
					isNaN(nativeSpeed) ||
					nativeSpeed <= 0
				) {
					nativeSpeed = null;
				}

				let computedMs: number | null = null;
				if (lastGpsFix !== null) {
					const dtSec = (timestamp - lastGpsFix.timestamp) / 1000;
					if (dtSec > 0) {
						const distM = haversineMeters(lastGpsFix.lat, lastGpsFix.lon, lat, lon);
						computedMs = distM / dtSec;
					}
				}
				lastGpsFix = { lat, lon, timestamp };

				const effectiveMs =
					nativeSpeed != null ? nativeSpeed : computedMs != null && !isNaN(computedMs)
						? Math.max(0, computedMs)
						: 0;

				if (effectiveMs > 0) {
					gpsMaxSpeed = Math.max(gpsMaxSpeed, effectiveMs);
				}
			},
			(error) => {
				if (gpsDisplay) {
					gpsDisplay.textContent = `GPS Error: ${error.message}`;
				}
			},
			{
				enableHighAccuracy: true,
				maximumAge: telemetryInterval,
				timeout: 10000,
			},
		);

		gpsProcessingInterval = window.setInterval(() => {
			if (latestPositions.length === 0) return;

			let filteredLat = null;
			let filteredLon = null;

			for (const pos of latestPositions) {
				filteredLat = latFilter.filter(pos.coords.latitude);
				filteredLon = lonFilter.filter(pos.coords.longitude);
			}
			let gpsText = ` Speed: ${gpsMaxSpeed.toFixed(1)} - Lat: ${filteredLat!.toFixed(6)}, Lon: ${filteredLon!.toFixed(6)}`;
			if (gpsDisplay) {
				gpsDisplay.textContent = gpsText;
			}

			latestLat = filteredLat!;
			latestLon = filteredLon!;
			latestSpeed = gpsMaxSpeed || 0;

			latestPositions = [];
			gpsMaxSpeed = 0;
		}, telemetryInterval);
	}
	startTelemetry();
}

async function stopTracking(): Promise<void> {
	trackingActive = false;
	if (motionHandler) {
		window.removeEventListener("devicemotion", motionHandler);
	}
	if (orientationHandler) {
		window.removeEventListener("deviceorientation", orientationHandler);
		orientationHandler = null;
	}
	if (gpsWatchId !== null) {
		navigator.geolocation.clearWatch(gpsWatchId);
		gpsWatchId = null;
	}
	if (gpsProcessingInterval !== null) {
		clearInterval(gpsProcessingInterval);
		gpsProcessingInterval = null;
	}
	latestPositions = [];
	gpsMaxSpeed = 0;
	lastGpsFix = null;
	if (gForceProcessingInterval !== null) {
		clearInterval(gForceProcessingInterval);
		gForceProcessingInterval = null;
	}
	gForceSamples = [];
	await stopTelemetry();
}
