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
      "@/components/ui": path.resolve(__dirname, "src/components/ui"),
      "@/components/features": path.resolve(__dirname, "src/components/features"),
      "@/components/layouts": path.resolve(__dirname, "src/components/layouts"),
      "@/config": path.resolve(__dirname, "src/config"),
      "@/constants": path.resolve(__dirname, "src/constants"),
      "@/hooks": path.resolve(__dirname, "src/hooks"),
      "@/services": path.resolve(__dirname, "src/services"),
      "@/stores": path.resolve(__dirname, "src/stores"),
      "@/types": path.resolve(__dirname, "src/types"),
      "@/utils": path.resolve(__dirname, "src/utils"),
      "@/ui": path.resolve(__dirname, "src/ui"),
      "@/env": path.resolve(__dirname, "src/env"),
    },
  },
});
