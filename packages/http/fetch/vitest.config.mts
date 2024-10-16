import { defineConfig, configDefaults } from "vitest/config";

export default defineConfig({
  test: {
    exclude: [...configDefaults.exclude, "**/*/{testUtils,dummyFetchHandler,testCallBackMiddleware,mockEntity,mockParseNodeFactory,index}.ts"],
    include: [...configDefaults.include, "test/**/*.ts"],
    coverage: {
      reporter: ["html"],
    },
  },
});