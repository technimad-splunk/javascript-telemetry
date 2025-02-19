"use strict";
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
var sdk_metrics_1 = require("@opentelemetry/sdk-metrics");
var exporter_metrics_otlp_http_1 = require("@opentelemetry/exporter-metrics-otlp-http");
var tokenInput = document.getElementById('token');
var intervalInput = document.getElementById('interval');
var accelDisplay = document.getElementById('accel');
var gyroDisplay = document.getElementById('gyro');
var gpsDisplay = document.getElementById('gps');
var telemetryInterval = 1000;
var trackingActive = false;
var motionInterval;
var orientationInterval;
var gpsInterval;
function getToken() {
    return tokenInput.value;
}
function createExporter() {
    var exporter = new exporter_metrics_otlp_http_1.OTLPMetricExporter({
        url: "https://ingest.eu0.signalfx.com/v2/datapoint/otlp",
        headers: {
            "Content-Type": "application/x-protobuf",
            "X-SF-Token": getToken()
        }
    });
    return new sdk_metrics_1.PeriodicExportingMetricReader({ exporter: exporter });
}
var meterProvider = new sdk_metrics_1.MeterProvider();
meterProvider.addMetricReader(createExporter());
var meter = meterProvider.getMeter('motion-sensor');
var accelXMetric = meter.createObservableGauge('accelerometer_x');
var accelYMetric = meter.createObservableGauge('accelerometer_y');
var accelZMetric = meter.createObservableGauge('accelerometer_z');
var gyroAlphaMetric = meter.createObservableGauge('gyroscope_alpha');
var gyroBetaMetric = meter.createObservableGauge('gyroscope_beta');
var gyroGammaMetric = meter.createObservableGauge('gyroscope_gamma');
var gpsLatMetric = meter.createObservableGauge('gps_latitude');
var gpsLonMetric = meter.createObservableGauge('gps_longitude');
(_a = document.getElementById('requestPermission')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function () {
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
        DeviceMotionEvent.requestPermission().then(function (permissionState) {
            if (permissionState === 'granted') {
                startTracking();
            }
            else {
                alert('Motion permission denied');
            }
        }).catch(console.error);
    }
    else {
        startTracking();
    }
});
(_b = document.getElementById('interval')) === null || _b === void 0 ? void 0 : _b.addEventListener('change', function (event) {
    telemetryInterval = parseInt(event.target.value) || 1000;
    if (trackingActive) {
        stopTracking();
        startTracking();
    }
});
(_c = document.getElementById('pauseTracking')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', function () {
    if (trackingActive) {
        stopTracking();
        document.getElementById('pauseTracking').textContent = 'Resume Sensors';
    }
    else {
        startTracking();
        document.getElementById('pauseTracking').textContent = 'Pause Sensors';
    }
});
function startTracking() {
    trackingActive = true;
    if (window.DeviceMotionEvent) {
        motionInterval = window.setInterval(function () {
            window.addEventListener('devicemotion', function (event) {
                var _a, _b, _c;
                var accel = event.accelerationIncludingGravity;
                if (accelDisplay) {
                    accelDisplay.textContent = "X: ".concat((_a = accel.x) === null || _a === void 0 ? void 0 : _a.toFixed(2), ", Y: ").concat((_b = accel.y) === null || _b === void 0 ? void 0 : _b.toFixed(2), ", Z: ").concat((_c = accel.z) === null || _c === void 0 ? void 0 : _c.toFixed(2));
                }
                accelXMetric.addCallback(function (observer) { return observer.observe(accel.x || 0); });
                accelYMetric.addCallback(function (observer) { return observer.observe(accel.y || 0); });
                accelZMetric.addCallback(function (observer) { return observer.observe(accel.z || 0); });
            }, { once: true });
        }, telemetryInterval);
    }
    if (window.DeviceOrientationEvent) {
        orientationInterval = window.setInterval(function () {
            window.addEventListener('deviceorientation', function (event) {
                var _a, _b, _c;
                if (gyroDisplay) {
                    gyroDisplay.textContent = "Alpha: ".concat((_a = event.alpha) === null || _a === void 0 ? void 0 : _a.toFixed(2), ", Beta: ").concat((_b = event.beta) === null || _b === void 0 ? void 0 : _b.toFixed(2), ", Gamma: ").concat((_c = event.gamma) === null || _c === void 0 ? void 0 : _c.toFixed(2));
                }
                gyroAlphaMetric.addCallback(function (observer) { return observer.observe(event.alpha || 0); });
                gyroBetaMetric.addCallback(function (observer) { return observer.observe(event.beta || 0); });
                gyroGammaMetric.addCallback(function (observer) { return observer.observe(event.gamma || 0); });
            }, { once: true });
        }, telemetryInterval);
    }
    if (navigator.geolocation) {
        gpsInterval = window.setInterval(function () {
            navigator.geolocation.getCurrentPosition(function (position) {
                if (gpsDisplay) {
                    gpsDisplay.textContent = "Lat: ".concat(position.coords.latitude.toFixed(6), ", Lon: ").concat(position.coords.longitude.toFixed(6));
                }
                gpsLatMetric.addCallback(function (observer) { return observer.observe(position.coords.latitude); });
                gpsLonMetric.addCallback(function (observer) { return observer.observe(position.coords.longitude); });
            }, function (error) {
                if (gpsDisplay) {
                    gpsDisplay.textContent = "GPS Error: ".concat(error.message);
                }
            });
        }, telemetryInterval);
    }
}
function stopTracking() {
    trackingActive = false;
    clearInterval(motionInterval);
    clearInterval(orientationInterval);
    clearInterval(gpsInterval);
}
