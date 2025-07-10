import { MeterProvider, PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { ObservableGauge } from '@opentelemetry/api';
import { Resource } from '@opentelemetry/resources';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';


type SensorData = {
	x?: ObservableGauge;
	y?: ObservableGauge;
	z?: ObservableGauge;
	alpha?: ObservableGauge;
	beta?: ObservableGauge;
	gamma?: ObservableGauge;
	latitude?: ObservableGauge;
	longitude?: ObservableGauge;
	speed?: ObservableGauge;
};

const version = "1.0.6"

const nameInput = document.getElementById('name') as HTMLInputElement;
const intervalInput = document.getElementById('interval') as HTMLInputElement;
const accelDisplay = document.getElementById('accel');
const gyroDisplay = document.getElementById('gyro');
const gpsDisplay = document.getElementById('gps');
document.getElementById('version').textContent = version;

let telemetryInterval = 500;
let trackingActive = false;
let motionInterval: number;
let orientationInterval: number;
let gpsInterval: number;
let motionHandler: null;

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
		}
	});
	return new PeriodicExportingMetricReader({ exporter, exportIntervalMillis: 1000 });
}

function startTelemetry() {
	let resource = new Resource({
		'player.name': nameInput.value,
		'frontend.version': version // Custom dimension
	});
	meterProvider = new MeterProvider({ resource: resource, readers: [createExporter()] });
	meter = meterProvider.getMeter('motion-sensor');

	metrics.x = meter.createObservableGauge('accelerometer_x');
	metrics.y = meter.createObservableGauge('accelerometer_y');
	metrics.z = meter.createObservableGauge('accelerometer_z');
	metrics.alpha = meter.createObservableGauge('gyroscope_alpha');
	metrics.beta = meter.createObservableGauge('gyroscope_beta');
	metrics.gamma = meter.createObservableGauge('gyroscope_gamma');
	metrics.latitude = meter.createObservableGauge('gps_latitude');
	metrics.longitude = meter.createObservableGauge('gps_longitude');
	metrics.speed = meter.createObservableGauge('gps_speed');
}

function stopTelemetry() {
	meterProvider.shutdown();
}




document.getElementById('requestPermission')?.addEventListener('click', () => {
	// Request motion sensor permission
	if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
		(DeviceMotionEvent as any).requestPermission().then((permissionState: string) => {
			if (permissionState === 'granted') {
				// Request GPS permission
				if (navigator.geolocation) {
					navigator.geolocation.getCurrentPosition(
						() => {
							// Permission granted, start tracking
							startTracking();
						},
						(error) => {
							alert('Location permission denied: ' + error.message);
						}
					);
				} else {
					alert('Geolocation not supported by your browser');
				}
			} else {
				alert('Motion permission denied');
			}
		}).catch(console.error);
	} else {
		// If not iOS or if no explicit permission API, just try both
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				() => {
					startTracking();
				},
				(error) => {
					alert('Location permission denied: ' + error.message);
				}
			);
		} else {
			startTracking();
		}
	}
});


document.getElementById('interval')?.addEventListener('change', (event) => {
	telemetryInterval = parseInt((event.target as HTMLInputElement).value) || 1000;
	if (trackingActive) {
		stopTracking();
		startTracking();
	}
});

document.getElementById('pauseTracking')?.addEventListener('click', () => {
	if (trackingActive) {
		stopTracking();
		document.getElementById('pauseTracking')!.textContent = 'Resume Sensors';
	} else {
		startTracking();
		document.getElementById('pauseTracking')!.textContent = 'Pause Sensors';
	}
});

function startTracking(): void {
	trackingActive = true;
	motionHandler = (event: DeviceMotionEvent) => {
		const accel = event.accelerationIncludingGravity;
		if (!accel) return;

		if (accelDisplay) {
			accelDisplay.textContent = `X: ${accel.x?.toFixed(2)}, Y: ${accel.y?.toFixed(2)}, Z: ${accel.z?.toFixed(2)}`;
		}

		metrics.x.addCallback(observer => observer.observe(accel.x || 0));
		metrics.y.addCallback(observer => observer.observe(accel.y || 0));
		metrics.z.addCallback(observer => observer.observe(accel.z || 0));
	};

	window.addEventListener('devicemotion', motionHandler);

	if (window.DeviceOrientationEvent) {
		orientationInterval = window.setInterval(() => {
			window.addEventListener('deviceorientation', (event) => {
				if (gyroDisplay) {
					gyroDisplay.textContent = `Alpha: ${event.alpha?.toFixed(2)}, Beta: ${event.beta?.toFixed(2)}, Gamma: ${event.gamma?.toFixed(2)}`;
				}
				metrics.alpha.addCallback(observer => observer.observe(event.alpha || 0));
				metrics.beta.addCallback(observer => observer.observe(event.beta || 0));
				metrics.gamma.addCallback(observer => observer.observe(event.gamma || 0));
			}, { once: true });
		}, telemetryInterval);
	}

	if (navigator.geolocation) {
		gpsInterval = window.setInterval(() => {
			navigator.geolocation.getCurrentPosition((position) => {
				if (gpsDisplay) {
					let gpsText = `Lat: ${position.coords.latitude.toFixed(6)}, Lon: ${position.coords.longitude.toFixed(6)}`;
					if (position.coords.speed !== null) {
						gpsText += `, Speed: ${position.coords.speed.toFixed(1)}`;
					}
					gpsDisplay.textContent = gpsText;
				}

				metrics.latitude.addCallback(observer => observer.observe(position.coords.latitude));
				metrics.longitude.addCallback(observer => observer.observe(position.coords.longitude));
				if (position.coords.speed !== null) {
					metrics.speed.addCallback(observer => observer.observe(position.coords.speed));
				}
			}, (error) => {
				if (gpsDisplay) {
					gpsDisplay.textContent = `GPS Error: ${error.message}`;
				}
			});
		}, telemetryInterval);
	}
	startTelemetry();
}

function stopTracking(): void {
	trackingActive = false;
	if (motionHandler) {
		window.removeEventListener('devicemotion', motionHandler);
	}
	clearInterval(orientationInterval);
	clearInterval(gpsInterval);
	stopTelemetry();
}
