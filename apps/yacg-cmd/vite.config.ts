import { defineConfig } from "vite-plus";

export default defineConfig({
  pack: {
    entry: "src/main.ts",
    platform: "node",
    format: ["cjs"],
    outDir: "../../dist/apps/yacg-cmd",
    sourcemap: true,
    fixedExtension: false,
    deps: {
      alwaysBundle: ["@yacg/core"],
    },
  },
});
