<script setup>
import { ref, onMounted, defineEmits } from "vue";
import Editor from "./components/editor.vue";
const editorData = ref("");
</script>

<template>
  <Editor></Editor>
</template>

<style scoped></style>
