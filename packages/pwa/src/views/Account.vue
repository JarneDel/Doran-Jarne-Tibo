<script lang="ts">
import { defineComponent, ref } from 'vue'
import UseFirebase from '@/composables/useFirebase'

export default defineComponent({
  setup() {
    const { firebaseUser } = UseFirebase()
    const idToken = ref()

    const getIdToken = async () => {
      idToken.value = await firebaseUser.value?.getIdToken()
    }
    getIdToken()
    return {
      idToken,
    }
  },
})
</script>

<template>
  <div>
    {{ idToken }}
  </div>
</template>

<style scoped></style>
