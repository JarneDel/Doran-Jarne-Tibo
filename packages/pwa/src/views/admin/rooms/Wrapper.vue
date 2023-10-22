<script lang="ts">
import AppHeader from '../../../components/AppHeader.vue';
import { defineComponent } from 'vue';

export default defineComponent({ components: { AppHeader } });
</script>

<template>
  <div class="m-8">
    <RouterView />
  </div>
</template>

<style scoped></style>
