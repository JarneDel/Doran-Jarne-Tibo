<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'CardContainer',
})
</script>

<template>
  <div>
    <slot></slot>
  </div>
</template>

<style scoped>
div {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr));
  grid-gap: 1.5rem;
}
</style>
