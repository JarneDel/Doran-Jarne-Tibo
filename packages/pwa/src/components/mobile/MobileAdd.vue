<script lang="ts">
import { defineComponent } from 'vue'
import { LucidePlus } from 'lucide-vue-next'

export default defineComponent({
  name: 'MobileAdd',
  components: { LucidePlus },
  emits: ['click'],
})
</script>

<template>
  <button
    class="bg-secondary z-100 focus:ring-primary hover:bg-secondary-dark fixed bottom-4 right-4 grid h-16 w-16 place-items-center rounded-full shadow focus:outline-none focus:ring-2 focus:ring-opacity-50"
    @click="$emit('click')"
  >
    <LucidePlus :size="32" name="plus" />
  </button>
</template>
