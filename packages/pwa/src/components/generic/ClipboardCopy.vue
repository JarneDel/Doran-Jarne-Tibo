<script lang="ts">
import { defineComponent } from 'vue'
import { Copy } from 'lucide-vue-next'

export default defineComponent({
  name: 'ClipboardCopy',
  components: { Copy },
  props: {
    text: {
      type: String,
      required: true,
    },
  },
  methods: {
    copyToClipboard(text: string) {
      navigator.clipboard.writeText(text)
    },
  },
})
</script>

<template>
  <button
    :title="$t('generic.copyToClipboard')"
    @click="copyToClipboard(text)"
    class="border-1 hover:bg-neutral2 w-min rounded-lg border-neutral-800 p-1"
  >
    <Copy :size="20" class="c-neutral-600"></Copy>
  </button>
</template>

<style scoped></style>
