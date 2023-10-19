<script lang="ts">
import { defineComponent } from 'vue'
import Modal from '@/components/Modal.vue'
import StyledButton from '@/components/generic/StyledButton.vue'

export default defineComponent({
  name: 'DoubleClickEdit',
  components: { StyledButton, Modal },
  props: {
    value: {
      type: String,
      required: true,
    },
  },
  emits: ['submit'],
  data() {
    return {
      isEditing: false,
      updateValue: this.$props.value,
      isPopupShown: false,
      popupOpenTime: 0,
    }
  },
  methods: {
    showPopup() {
      console.log('showPopup')
      // wait until mouse click is processed

      if (this.updateValue === this.$props.value) {
        this.isEditing = false
        return
      }
      this.isPopupShown = true
      this.popupOpenTime = Date.now()
    },
    edit() {
      console.log('edit')
      this.isEditing = true
      this.isPopupShown = false
      this.$nextTick(() => {
        const inputElement = this.$refs.input as HTMLInputElement | undefined
        if (inputElement) {
          inputElement.focus()
        }
      })
    },
    modalClosed() {
      if (this.popupOpenTime + 100 > Date.now()) {
        return
      }
      console.log('modalClosed')
      this.isPopupShown = false
      this.isEditing = false
    },
  },
})
</script>

<template>
  <modal
    v-if="isPopupShown"
    title=""
    max-width="max-w-max"
    @close="modalClosed"
  >
    <template v-slot:title>Discard changes?</template>
    <template v-slot:actions>
      <StyledButton
        :px="2"
        :py="1"
        button-type="danger"
        class="btn btn-primary"
        @click="
          () => {
            isPopupShown = false
            isEditing = false
          }
        "
      >
        Discard
      </StyledButton>
      <styled-button
        button-type="gray"
        :px="2"
        :py="1"
        @click="isPopupShown = false"
      >
        Cancel
      </styled-button>
    </template>
  </modal>
  <span v-if="!isEditing" @dblclick="edit" class="ring-gray-4 hover:ring">
    {{ value }}
  </span>
  <form
    v-else
    @submit.prevent="
      () => {
        $emit('submit', updateValue)
        isEditing = false
      }
    "
  >
    <input
      ref="input"
      @blur="showPopup"
      v-model="updateValue"
      class="w-full ring-2 ring-black"
    />
  </form>
</template>

<style scoped></style>
