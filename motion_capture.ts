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

const version = "1.0.13";

const nameInput = document.getElementById("name") as HTMLInputElement;
const accelDisplay = document.getElementById("accel");
const gyroDisplay = document.getElementById("gyro");
const gpsDisplay = document.getElementById("gps");
document.getElementById("version").textContent = version;

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

/** Latest values read by ObservableGauge callbacks (registered once in startTelemetry). */
let latestG = 0;
let latestAlpha = 0;
let latestBeta = 0;
let latestGamma = 0;
let latestLat = 0;
let latestLon = 0;
let latestSpeed = 0;

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

	metrics.g!.addCallback((o) => o.observe(latestG));
	metrics.alpha!.addCallback((o) => o.observe(latestAlpha));
	metrics.beta!.addCallback((o) => o.observe(latestBeta));
	metrics.gamma!.addCallback((o) => o.observe(latestGamma));
	metrics.latitude!.addCallback((o) => o.observe(latestLat));
	metrics.longitude!.addCallback((o) => o.observe(latestLon));
	metrics.speed!.addCallback((o) => o.observe(latestSpeed));
}

function stopTelemetry() {
	meterProvider.shutdown();
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

document.getElementById("interval")?.addEventListener("change", (event) => {
	telemetryInterval =
		parseInt((event.target as HTMLInputElement).value) || 1000;
	if (trackingActive) {
		stopTracking();
		startTracking();
	}
});

document.getElementById("pauseTracking")?.addEventListener("click", () => {
	if (trackingActive) {
		stopTracking();
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

		const gForce = Math.hypot(a.x ?? 0, a.y ?? 0, a.z ?? 0) / 9.81;

		gForceSamples.push(gForce);
	};

	window.addEventListener("devicemotion", motionHandler);

	gForceProcessingInterval = window.setInterval(() => {
		if (gForceSamples.length === 0) return;
		let max_gForce = Math.max(...gForceSamples.map((v) => v));
		let min_gForce = Math.min(...gForceSamples.map((v) => v));
		let gForce = min_gForce * -1 > max_gForce ? min_gForce : max_gForce; //choose whichever is further away from 0.

		if (accelDisplay) {
			accelDisplay.textContent = `g-force: ${gForce?.toFixed(2)}`;
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
				// Collect positions during telemetryInterval
				latestPositions.push(position);

				// Update max speed if valid
				const speed = position.coords.speed;
				if (typeof speed === "number" && !isNaN(speed)) {
					gpsMaxSpeed = Math.max(gpsMaxSpeed, speed);
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

		// Every telemetry interval, process and emit
		gpsProcessingInterval = window.setInterval(() => {
			if (latestPositions.length === 0) return;

			// Feed all positions one by one through the filter
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

function stopTracking(): void {
	trackingActive = false;
	if (motionHandler) {
		window.removeEventListener("devicemotion", motionHandler);
	}
	if (gpsWatchId !== null) {
		navigator.geolocation.clearWatch(gpsWatchId);
		gpsWatchId = null;
	}
	if (gpsProcessingInterval !== null) {
		clearInterval(gpsProcessingInterval);
		gpsProcessingInterval = null;
	}
	// Reset the GPS positions and speed buffers
	latestPositions = [];
	gpsMaxSpeed = 0;
	if (gForceProcessingInterval !== null) {
		clearInterval(gForceProcessingInterval);
		gForceProcessingInterval = null;
	}
	gForceSamples = [];
	stopTelemetry();
}
