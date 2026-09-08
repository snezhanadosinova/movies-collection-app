import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/test/security/**/*.test.js"],
    fileParallelism: false,
    testTimeout: 10000,
    hookTimeout: 20000,
  },
});
