import { defineConfig } from "vite-plus";

export default defineConfig({
  pack: {
    entry: "src/index.ts",
    format: ["esm", "cjs"],
    dts: { build: true },
    outDir: "../../dist/libs/core",
    copy: ["package.json", "*.md"],
  },
});
