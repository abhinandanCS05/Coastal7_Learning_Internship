import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    css: true,

    testTimeout: 15000,
    hookTimeout: 15000,

    pool: "threads",
    isolate: false,
    fileParallelism: false,

    exclude: [
      "node_modules/**",
      "dist/**",
      "e2e/**",
      "**/*.e2e.*",
      "**/*.spec.e2e.*",
    ],
  },
});
