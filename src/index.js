import editor from "./components/editor.vue";

export { editor };

export default {
  install: (app) => {
    app.component("editor", editor);
  },
};
