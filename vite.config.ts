import { defineConfig } from "vite-plus";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  resolve: {
    alias: {
      "@yacg/core": fileURLToPath(new URL("./libs/core/src/index.ts", import.meta.url)),
    },
  },
  fmt: {
    ignorePatterns: [
      "dist/**",
      "coverage/**",
      "TestData/*.json",
      ".nx/cache/**",
      ".nx/workspace-data/**",
      ".angular/**",
      ".nx/self-healing/**",
    ],
  },
  lint: {},
  test: {
    environment: "node",
    include: ["apps/yacg-cmd/src/**/*.spec.ts", "libs/core/src/**/*.spec.ts"],
  },
});
