import { defineConfig } from "vitest/config";
import { loadEnv } from "vite";

export default defineConfig({
  test: {
    testTimeout: 30_000,
    hookTimeout: 10_000,
    fileParallelism: false,
    sequence: { concurrent: false },
    reporters: ["verbose"],
    env: loadEnv("", process.cwd(), ""),
  },
});
