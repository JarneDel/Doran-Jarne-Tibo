<script lang="ts">
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  name: 'DoubleClickSelect',
  data() {
    return {
      isEditing: false,
      isSubmitted: false,
    }
  },
  props: {
    options: {
      type: Object as PropType<Record<string, string>>,
      required: true,
    },
    selected: {
      type: Object as PropType<{ key: string; value: string }>,
      required: true,
    },
  },
  emits: ['submit'],
  methods: {
    submit(event: Event) {
      const target = event.target as HTMLSelectElement
      this.$emit('submit', target.value)
      this.isEditing = false
      this.isSubmitted = true
    },
    edit() {
      this.isEditing = true
      this.$nextTick(() => {
        const selectElement = this.$refs.input as HTMLSelectElement | undefined
        if (selectElement) {
          selectElement.focus()
        }
      })
    },
  },
  watch: {
    selected(val, oldVal) {
      if (val !== oldVal) {
        this.isSubmitted = false
      }
    },
  },
})
</script>

<template>
  <span v-if="isSubmitted">loading</span>
  <span v-else-if="!isEditing" @click="edit">{{ selected.value }}</span>
  <span v-else>
    <select
      ref="input"
      :value="selected.key"
      class="hover:border-primary-light ring-offset-primary-lighter appearance-none rounded bg-inherit outline-none ring-black ring-offset-4 hover:ring focus-visible:ring active:ring"
      @blur="isEditing = false"
      @change="submit"
    >
      <option v-for="(option, key) in options" :key="key" :value="key">
        {{ option }}
      </option>
    </select>
  </span>
</template>

<style scoped></style>
