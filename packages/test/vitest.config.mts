import { defineConfig, configDefaults } from "vitest/config";

export default defineConfig({
  test: {
    exclude: [...configDefaults.exclude, "tests/{testClient,secrets}.ts"],
    include: [...configDefaults.include, "tests/**/*.ts"],
    coverage: {
      reporter: ["html"],
    },
  },
});