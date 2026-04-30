const esbuild = require("esbuild");

const raw = process.env.GITHUB_SHA || "";
const ver = raw.length >= 7 ? raw.slice(0, 7) : "dev";

esbuild
	.build({
		entryPoints: ["motion_capture.ts"],
		bundle: true,
		outfile: "motion_capture.js",
		format: "iife",
		define: {
			__BUILD_VERSION__: JSON.stringify(ver),
		},
	})
	.catch((err) => {
		console.error(err);
		process.exit(1);
	});
