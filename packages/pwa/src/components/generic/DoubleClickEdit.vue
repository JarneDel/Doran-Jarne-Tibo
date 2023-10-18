<script lang="ts">
import { defineComponent } from 'vue'
import Modal from '@/components/Modal.vue'

export default defineComponent({
  name: 'DoubleClickEdit',
  components: { Modal },
  props: {
    value: {
      type: String,
      required: true,
    },
  },
  emits: ['update:modelValue'],
  data() {
    return {
      isEditing: false,
      updateValue: this.$props.value,
      isPopupShown: false,
    }
  },
})
</script>

<template>
  <modal />
  <span v-if="!isEditing" @blur="" @dblclick="isEditing = true">
    {{ value }}
  </span>
  <input v-else v-model="updateValue" class="w-full" />
</template>

<style scoped></style>
