/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client"),
      "@shared": path.resolve(__dirname, "shared"),
    },
  },
  server: {
    host: true, // bind 0.0.0.0 → truy cập được từ ngoài container Docker
    port: 8081,
    proxy: {
      // /api → Express mock server (:8000). Server chưa chạy (`pnpm dev:server`)
      // → trả 502 + message rõ ràng thay vì 500 khó hiểu.
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
        configure: (proxy) => {
          proxy.on("error", (_err, _req, res) => {
            if ("writeHead" in res && !res.headersSent) {
              res.writeHead(502, { "Content-Type": "application/json" });
            }
            res.end(
              JSON.stringify({
                message:
                  "Mock API server (:8000) chưa chạy — mở terminal khác: pnpm dev:server (hoặc pnpm dev:all)",
                message_id: "MSE_PROXY_DOWN",
              }),
            );
          });
        },
      },
    },
  },
  build: {
    outDir: "dist/spa",
  },
  test: {
    environment: "jsdom",
    setupFiles: ["client/test/setup.ts"],
    globals: true,
    css: false,
  },
});
