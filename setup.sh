brew install node
npm init -y
npm install typescript @opentelemetry/sdk-metrics @opentelemetry/exporter-metrics-otlp-http
npx tsc --init

npx tsc motion_capture.ts
