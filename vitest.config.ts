import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "node",
    environmentMatchGlobs: [
      ["src/__tests__/components/**", "jsdom"],
    ],
    setupFiles: ["src/__tests__/components/setup.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
