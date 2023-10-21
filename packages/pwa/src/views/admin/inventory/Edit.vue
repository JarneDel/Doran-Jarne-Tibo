<script lang="ts">
import { defineComponent } from 'vue'
import Modal from '@/components/Modal.vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'Edit',
  components: { Modal },
  setup() {
    const { push } = useRouter()
    return {
      push,
    }
  },
})
</script>

<template>
  <!--  Todo: popup to discard changes-->
  <Modal @close="push('/admin/inventory')"> </Modal>
</template>

<style scoped></style>
