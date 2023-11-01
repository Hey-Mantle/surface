//vite.config.js
import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig ({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.js"),
      name: "@mantle/surface",
      fileName: "index",
    },
    rollupOptions: {
      external: ["react"],
    },
  },
});