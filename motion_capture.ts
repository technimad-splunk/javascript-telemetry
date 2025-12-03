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
let orientationInterval: number;
let gpsInterval: number = 500; //how often we request a gps update.
let motionHandler: (event: DeviceMotionEvent) => void;
let gpsWatchId: number | null = null;
let gForceSamples: number[] = [];
let gForceProcessingInterval: number | null = null;
let latestPositions: GeolocationPosition[] = [];
let gpsMaxSpeed = 0;
let gpsProcessingInterval: number | null = null;

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
}

function stopTelemetry() {
	meterProvider.shutdown();
}

document.getElementById("requestPermission")?.addEventListener("click", () => {
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
	trackingActive = true;
	motionHandler = (event: DeviceMotionEvent) => {
		const accel = event.acceleration;
		if (!accel) return;

		let gForce = Math.sqrt(accel.x ^ (2 + accel.y) ^ (2 + accel.z) ^ 2) / 9.81;

		// if (accelDisplay) {
		// 	accelDisplay.textContent = `X: ${accel.x?.toFixed(2)}, Y: ${accel.y?.toFixed(2)}, Z: ${accel.z?.toFixed(2)}`;
		// }

		gForceSamples.push(gForce);

		//metrics.x.addCallback(observer => observer.observe(accel.x || 0));
		//metrics.y.addCallback(observer => observer.observe(accel.y || 0));
		//metrics.z.addCallback(observer => observer.observe(accel.z || 0));
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

		metrics.g.addCallback((observer) => observer.observe(gForce));
		gForceSamples = [];
	}, telemetryInterval);

	if (window.DeviceOrientationEvent) {
		orientationInterval = window.setInterval(() => {
			window.addEventListener(
				"deviceorientation",
				(event) => {
					if (gyroDisplay) {
						gyroDisplay.textContent = `Alpha: ${event.alpha?.toFixed(2)}, Beta: ${event.beta?.toFixed(2)}, Gamma: ${event.gamma?.toFixed(2)}`;
					}
					metrics.alpha.addCallback((observer) =>
						observer.observe(event.alpha || 0),
					);
					metrics.beta.addCallback((observer) =>
						observer.observe(event.beta || 0),
					);
					metrics.gamma.addCallback((observer) =>
						observer.observe(event.gamma || 0),
					);
				},
				{ once: true },
			);
		}, telemetryInterval);
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
				maximumAge: gpsInterval,
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

			metrics.latitude.addCallback((observer) =>
				observer.observe(filteredLat!),
			);
			metrics.longitude.addCallback((observer) =>
				observer.observe(filteredLon!),
			);
			metrics.speed.addCallback((observer) =>
				observer.observe(gpsMaxSpeed || 0),
			);

			// Reset buffers for next interval
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
	clearInterval(orientationInterval);
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
