import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      ignored: [
        "**/vite.config.ts",
        "**/.env",
        "**/node_modules/**",
        "**/dist/**",
      ],
    },
    host: true,
    port: 3002,
    strictPort: true,
  },
});
