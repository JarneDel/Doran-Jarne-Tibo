<script lang="ts">
import { defineComponent } from 'vue'
import Modal from '@/components/modal/Modal.vue'
import StyledButton from '@/components/generic/StyledButton.vue'
import OptionsModal from '@/components/modal/OptionsModal.vue'

export default defineComponent({
  name: 'DoubleClickEdit',
  components: { OptionsModal, StyledButton, Modal },
  props: {
    value: {
      required: true,
    },
    type: {
      type: String,
      default: 'text',
    },
  },
  emits: ['submit'],
  data() {
    return {
      isEditing: false,
      updateValue: this.$props.value,
      isPopupShown: false,
      isChanging: false,
    }
  },
  methods: {
    showPopup() {
      if (this.updateValue === this.$props.value) {
        this.isEditing = false
        return
      }
      this.isPopupShown = true
    },
    edit() {
      this.isEditing = true
      this.isPopupShown = false
      this.$nextTick(() => {
        const inputElement = this.$refs.input as HTMLInputElement | undefined
        if (inputElement) {
          inputElement.focus()
        }
      })
    },
    discard() {
      this.updateValue = this.$props.value
      this.isPopupShown = false
      this.isEditing = false
    },
    save() {
      this.$emit('submit', this.updateValue)
      this.isEditing = false
    },
  },
})
</script>

<template>
  <OptionsModal
    v-if="isPopupShown && isEditing"
    :button1="{ text: $t('common.discard'), type: 'danger' }"
    :button2="{ text: $t('common.save'), type: 'primary' }"
    :focus-button="2"
    :show-modal="isPopupShown"
    :title="$t('common.saveChanges')"
    @update:show-modal="edit"
    @button1-click="discard"
    @button2-click="save"
  />

  <span v-if="isChanging">...</span>
  <span v-else-if="!isEditing" class="ring-gray-4 hover:ring" @dblclick="edit">
    {{ value }}
  </span>
  <form
    v-else
    :class="{ inline: type === 'number' }"
    @submit.prevent="
      () => {
        $emit('submit', updateValue)
        isEditing = false
      }
    "
  >
    <input
      ref="input"
      v-model="updateValue"
      :class="{
        'inline w-12': type === 'number',
        'w-full': type === 'text',
      }"
      :type="type"
      class="ring-2 ring-black"
      @blur="showPopup"
    />
  </form>
</template>

<style scoped></style>
