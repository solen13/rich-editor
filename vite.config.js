import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.js"), // Giriş dosyan
      name: "FlexibleTextEditor",
      fileName: (format) => `flexible-text-editor.${format}.js`,
    },
    rollupOptions: {
      // Vue'yu pakete dahil etme (kullanıcının projesindeki Vue kullanılır)
      external: ["vue"],
      output: {
        globals: {
          vue: "Vue",
        },
      },
    },
  },
});
