import { webdriverio } from "@vitest/browser-webdriverio";
import { defineConfig, configDefaults } from "vitest/config";

export default defineConfig({
  test: {
    browser: {
      provider: webdriverio(),
      instances: [{ browser: "chrome" }],
    },
    exclude: [...configDefaults.exclude, "**/test{Entity,Enum}.ts"],
    include: [...configDefaults.include, "test/**/*.ts"],
    coverage: {
      reporter: ["html", "cobertura"],
    },
  },
});
