import { createApp } from "vue";
import App from "./App.vue";
import editor from "./components/editor.vue";

const app = createApp(App);

app.use(editor);

app.mount("#app");
