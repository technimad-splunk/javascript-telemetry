import { MeterProvider, PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';

type SensorData = {
	x?: number;
	y?: number;
	z?: number;
	alpha?: number;
	beta?: number;
	gamma?: number;
	latitude?: number;
	longitude?: number;
};

const tokenInput = document.getElementById('token') as HTMLInputElement;
const endpointInput = document.getElementById('endpoint') as HTMLInputElement;
const intervalInput = document.getElementById('interval') as HTMLInputElement;
const accelDisplay = document.getElementById('accel');
const gyroDisplay = document.getElementById('gyro');
const gpsDisplay = document.getElementById('gps');

let telemetryInterval = 1000;
let trackingActive = false;
let motionInterval: number;
let orientationInterval: number;
let gpsInterval: number;

function getToken(): string {
	return tokenInput.value;
}

function getEndpoint(): string {
	//return endpointInput.value || "https://ingest.eu0.signalfx.com/v2/datapoint/otlp";
	return "https://aior8w88kh.execute-api.eu-west-1.amazonaws.com/otlp";
}

function createExporter(): PeriodicExportingMetricReader {
	const exporter = new OTLPMetricExporter({
		url: getEndpoint(),
		headers: {
			"Content-Type": "application/json",
			"X-SF-Token": "XgM_Jx8-OnfDDgKOgDnlAQ",
		}
	});
	return new PeriodicExportingMetricReader({ exporter, exportIntervalMillis: 1000 });
}

const meterProvider = new MeterProvider();
meterProvider.addMetricReader(createExporter());
const meter = meterProvider.getMeter('motion-sensor');

const accelXMetric = meter.createObservableGauge('accelerometer_x');
const accelYMetric = meter.createObservableGauge('accelerometer_y');
const accelZMetric = meter.createObservableGauge('accelerometer_z');
const gyroAlphaMetric = meter.createObservableGauge('gyroscope_alpha');
const gyroBetaMetric = meter.createObservableGauge('gyroscope_beta');
const gyroGammaMetric = meter.createObservableGauge('gyroscope_gamma');
const gpsLatMetric = meter.createObservableGauge('gps_latitude');
const gpsLonMetric = meter.createObservableGauge('gps_longitude');

document.getElementById('requestPermission')?.addEventListener('click', () => {
	if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
		(DeviceMotionEvent as any).requestPermission().then((permissionState: string) => {
			if (permissionState === 'granted') {
				startTracking();
			} else {
				alert('Motion permission denied');
			}
		}).catch(console.error);
	} else {
		startTracking();
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
	if (window.DeviceMotionEvent) {
		motionInterval = window.setInterval(() => {
			window.addEventListener('devicemotion', (event) => {
				let accel = event.accelerationIncludingGravity;
				if (accelDisplay) {
					accelDisplay.textContent = `X: ${accel.x?.toFixed(2)}, Y: ${accel.y?.toFixed(2)}, Z: ${accel.z?.toFixed(2)}`;
				}
				accelXMetric.addCallback(observer => observer.observe(accel.x || 0));
				accelYMetric.addCallback(observer => observer.observe(accel.y || 0));
				accelZMetric.addCallback(observer => observer.observe(accel.z || 0));
			}, { once: true });
		}, telemetryInterval);
	}

	if (window.DeviceOrientationEvent) {
		orientationInterval = window.setInterval(() => {
			window.addEventListener('deviceorientation', (event) => {
				if (gyroDisplay) {
					gyroDisplay.textContent = `Alpha: ${event.alpha?.toFixed(2)}, Beta: ${event.beta?.toFixed(2)}, Gamma: ${event.gamma?.toFixed(2)}`;
				}
				gyroAlphaMetric.addCallback(observer => observer.observe(event.alpha || 0));
				gyroBetaMetric.addCallback(observer => observer.observe(event.beta || 0));
				gyroGammaMetric.addCallback(observer => observer.observe(event.gamma || 0));
			}, { once: true });
		}, telemetryInterval);
	}

	if (navigator.geolocation) {
		gpsInterval = window.setInterval(() => {
			navigator.geolocation.getCurrentPosition((position) => {
				if (gpsDisplay) {
					gpsDisplay.textContent = `Lat: ${position.coords.latitude.toFixed(6)}, Lon: ${position.coords.longitude.toFixed(6)}`;
				}
				gpsLatMetric.addCallback(observer => observer.observe(position.coords.latitude));
				gpsLonMetric.addCallback(observer => observer.observe(position.coords.longitude));
			}, (error) => {
				if (gpsDisplay) {
					gpsDisplay.textContent = `GPS Error: ${error.message}`;
				}
			});
		}, telemetryInterval);
	}
}

function stopTracking(): void {
	trackingActive = false;
	clearInterval(motionInterval);
	clearInterval(orientationInterval);
	clearInterval(gpsInterval);
}
