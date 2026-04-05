import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/_tests_/setup.ts",
  },
  server: {
    port: 3000,
    open: true,
    proxy: {
      "/graphql": {
        target: "http://localhost:4000",
        secure: false,
        changeOrigin: true,
      },
      "/health": {
        target: "http://localhost:4000",
        secure: false,
        changeOrigin: true,
      },
    },
  },
});
