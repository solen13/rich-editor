# Vue Flexible text editor

**vue-flexible-text-editor** is built on top of.

😎 **Modern** and 🚀 **flexible** text editor for Vue.js

[Demo]() 👀

# Installation

```
npm install vue-flexible-text-editor
```

```
yarn add  vue-flexible-text-editor
```

# Getting started

## Basic usage `setup`

```vue
<script setup lang="ts">
import editor from "vue-flexible-text-editor";

import { ref } from "vue";

const editHTML = ref("");
</script>

<template>
  <editor v-model="editHTML"> </editor>
</template>
```

## Usage in Nuxt 3

For Nuxt 3, just wrap component in `<ClientOnly>`

```vue
<template>
  <ClientOnly>
    <editor v-model="editHTML"> Your awesome content </editor>
  </ClientOnly>
</template>
```

## Props

### Prop Definitions

| Prop         | Type    | Default | Description |
| ------------ | ------- | ------- | ----------- |
| allowPreview | Boolean | true    | preview     |

## Events

| Event   | Description     | Payload |
| ------- | --------------- | ------- |
| v-model | Emitted v-model | -       |
