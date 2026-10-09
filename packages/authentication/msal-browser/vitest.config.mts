import { readFileSync } from "node:fs";
import { defineConfig, configDefaults } from "vitest/config";

const keyPath = process.env.KIOTA_TEST_TLS_KEY;
const certPath = process.env.KIOTA_TEST_TLS_CERT;
if (Boolean(keyPath) !== Boolean(certPath)) {
	throw new Error("Set both KIOTA_TEST_TLS_KEY and KIOTA_TEST_TLS_CERT for HTTPS browser tests");
}

export default defineConfig({
	server: {
		https: keyPath && certPath ? { key: readFileSync(keyPath), cert: readFileSync(certPath) } : undefined,
	},
	test: {
		exclude: [...configDefaults.exclude, "**/test{Entity,Enum}.ts"],
		include: [...configDefaults.include, "test/**/*.ts"],
		coverage: {
			reporter: ["html", "cobertura"],
		},
	},
});
