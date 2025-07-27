/// <reference types="node" />
import path from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: './postcss.config.cjs',
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@/components": path.resolve(__dirname, "src/components"),
      "@/config": path.resolve(__dirname, "src/config"),
      "@/hooks": path.resolve(__dirname, "src/hooks"),
      "@/stores": path.resolve(__dirname, "src/stores"),
      "@/utils": path.resolve(__dirname, "src/utils"),
      "@/ui": path.resolve(__dirname, "src/ui"),
      "@/env": path.resolve(__dirname, "src/env"),
    },
  },
});
