<script setup>
import { ref, onMounted, defineEmits } from "vue";
import Editor from "./components/editor.vue";
</script>

<template>
  <ClientOnly> <Editor></Editor></ClientOnly>
</template>

<style scoped></style>
