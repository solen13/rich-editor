import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: resolve(__dirname, "index.js"),
      name: "vue-flex-editor",
      fileName: "vue-flex-editor",
    },
    rollupOptions: {
      external: ["vue"], // Vue'yu paketin içine gömme, dışarıdan kullansın
      output: {
        globals: { vue: "Vue" },
      },
    },
  },
});
