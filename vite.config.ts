import path from "path";
import { defineConfig } from "vite";

import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@/components": path.resolve(__dirname, "./src/components"),
      "@/config": path.resolve(__dirname, "./src/config"),
      "@/hooks": path.resolve(__dirname, "./src/hooks"),
      "@/stores": path.resolve(__dirname, "./src/stores"),
      "@/utils": path.resolve(__dirname, "./src/utils"),
      "@/ui": path.resolve(__dirname, "./src/ui"),
      "@/env": path.resolve(__dirname, "./src/env"),
    },
  },
});
