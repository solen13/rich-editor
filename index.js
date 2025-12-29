import editor from "./src/components/editor.vue";
export default {
  install: (app) => {
    app.component("editor", editor);
  },
};

export { editor };
