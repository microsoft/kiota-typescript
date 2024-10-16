import { defineConfig, configDefaults } from "vitest/config";

export default defineConfig({
  test: {
    exclude: [...configDefaults.exclude, "**/*/{testEntity,index}.ts"],
    include: [...configDefaults.include, "test/**/*.ts"],
    coverage: {
      reporter: ["html"],
    },
  },
});