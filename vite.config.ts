import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Paths are relative to the repo root (where npm runs). outDir is relative to `root`.
export default defineConfig({
  plugins: [react()],
  root: "client",
  build: { outDir: "../dist/public", emptyOutDir: true },
  server: { port: 5000 },
  preview: { port: 5000 },
});
