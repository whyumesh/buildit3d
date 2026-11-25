import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Paths are relative to the repo root (where npm runs). outDir is relative to `root`.
export default defineConfig({
  plugins: [react()],
  root: "client",
  build: {
    outDir: "../dist/public",
    emptyOutDir: true,
    // SINGLE=1 bundles everything into one script (used only to make a one-file phone preview)
    rollupOptions: process.env.SINGLE ? { output: { inlineDynamicImports: true } } : {},
    chunkSizeWarningLimit: 700,
  },
  server: { port: 5000 },
  preview: { port: 5000 },
});
