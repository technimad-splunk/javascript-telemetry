# OpenTelemetry for Phone Sensors

This is a PoC to test the feasibility to get telemetry data off a phone and send it via OpenTelemetry.
To cater to easy distribution, this is implemented in a web app.
The telemetry to collect consist of the accelerometer, gyroscope and gps.
The telemetry is send to an aws api gateway endpoint, which transforms and forwards the payload to splunk observability cloud.

## Learnings
### Telemetry collection
The telemetry collection is pretty straightforward. For the data to become available on iOS, permission must be granted by the user. This is not a blocker for further development.
### Opentelemetry
The easiest way to send data via OpenTelemetry is by using the [OpenTelemetry](https://opentelemetry.io/docs/languages/js/) [JavaScript libraries](https://github.com/open-telemetry/opentelemetry-js). Unfortunately these libraries cannot directly be used in a browser, their main intended usage environment is to be node.
This isn’t a big problem, we shifted from JavaScript to typescript, and by using a bundler, we convert it to ecma script that can be run in a browser.
The documentation was clear on how to add and configure the libraries. I’ve added a configurable to set the telemetry export interval.
### Transport to splunk o11y cloud
Splunk observability cloud is OpenTelemetry native, they adhere to the OpenTelemetry conventions and provide OTLP endpoints for telemetry.
The [otlp endpoint for metrics](https://dev.splunk.com/observability/reference/api/ingest_data/latest#endpoint-send-otlp-metrics), only supports OTLP via protobuf.
<insert background around protocols>
The [OpenTelemetry js library for metrics via protobuf](https://www.npmjs.com/package/@opentelemetry/exporter-metrics-otlp-proto)  isn’t supported in browsers.
Splunk Observability cloud also provides a generic [json endpoint for metrics](https://dev.splunk.com/observability/reference/api/ingest_data/latest#endpoint-send-metrics). The json structure this endpoint expects is not compatible with OTLP.
So we are left with the [http json transport](https://www.npmjs.com/package/@opentelemetry/exporter-metrics-otlp-http).
### CORS
By running in the browser we run into the safeguards this platform provides. One of these safeguards is the single origin policy, this basically dictates the browser can only load resources from the domain the website/app is loaded from.
This is not always practical so there are ways around this limitation. One of these work arounds is CORS.
We have to deal with CORS because the domain for the web app and the Splunk Observability Cloud endpoint are on different domains.
With CORS the resource accessed on a 3rd party domain must provide specific HTTP headers indicating it is allowed to be accessed as a 3rd party resource.
The Splunk Observability cloud API endpoints are not primarily intended to be accessed from a browser context, so they don’t provide the needed headers.
This means we cannot directly call the the Splunk Observability endpoints to send data from within the browser.
### API gateway
To work around the CORS issue we can use an AWS API gateway to proxies requests from the webapp to the Splunk Observability cloud back end. We are in full control of the api gateway, so can send the needed cors headers.
An other function of the API gateway is to transform the OTLP json payload from the webapp to the json format required by the generic json endpoint.
### Transformation template
The transfomation template is written in vtl.
Important is to parse the incoming payload as json, and cast is to a json object, so it can be used for further processing.


## Further actions
- [ ] Change vtl template to support multiple resource attributes. Currently only service.name is supported
- [ ] Make data collection interval configurable
- [ ] Add inputs for extra attributes (name, number)
- [ ] remove token from frontend
- [ ] Add token as variable to the api gateway config
- [ ] Save api gateway config to this repo
- [ ] Prevent device sleep
- [ ] Calibrate gyroscope on telemetry start
