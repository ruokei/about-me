import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: "app",
  base: "/about-me/",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { "@": path.resolve(root, "app/src") },
  },
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    rollupOptions: {
      output: {
        entryFileNames: "assets/site.js",
        chunkFileNames: "assets/chunk-[name].js",
        assetFileNames: "assets/site.[ext]",
      },
    },
  },
});
