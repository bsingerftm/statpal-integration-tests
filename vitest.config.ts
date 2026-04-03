import { defineConfig } from "vitest/config";
import { loadEnv } from "vite";

export default defineConfig({
  test: {
    testTimeout: 30_000,
    hookTimeout: 10_000,
    fileParallelism: false,
    sequence: { concurrent: false },
    reporters: ["verbose", "json"],
    outputFile: { json: "test-results.json" },
    env: loadEnv("", process.cwd(), ""),
  },
});
