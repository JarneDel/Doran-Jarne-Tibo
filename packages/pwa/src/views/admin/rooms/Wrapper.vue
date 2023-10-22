<script lang="ts">
import AppHeader from '../../../components/AppHeader.vue';
import { defineComponent } from 'vue';

export default defineComponent({ components: { AppHeader } });
</script>

<template>
  <div>
    <RouterView />
  </div>
</template>

<style scoped></style>
