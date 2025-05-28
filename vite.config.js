import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        parserOpts: {
          plugins: ["decorators-legacy"],
        },
      },
    }),
  ],
  server: {
    port: 3002, // Set the port to 3002
  },
  build: {
    outDir: "dist", // Set your custom build folder name
  },
});
