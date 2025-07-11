brew install node
npm init -y
npm install typescript @opentelemetry/sdk-metrics @opentelemetry/exporter-metrics-otlp-http @opentelemetry/resources kalmanjs
npm install --save-dev esbuild

npx tsc --init

npx esbuild motion_capture.ts --bundle --outfile=motion_capture.js --format=iife


npm install
npm run build
