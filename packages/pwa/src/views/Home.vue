<script lang="ts">
import { ref } from 'vue'
import { type AuthError } from 'firebase/auth'

import useFirebase from '@/composables/useFirebase'

export default {
  setup() {
    const { logout } = useFirebase()

    const error = ref<AuthError | null>(null)
    const handleLogout = () => {
      logout()
        .then(() => {
          console.log('logged out')
        })
        .catch((err: AuthError) => {
          error.value = err
        })
    }
    return {
      error,
      handleLogout,
    }
  },
}
</script>

<template>
  <div>
    <div>
      <img
        class="h-64 w-full object-cover md:h-fit"
        src="../assets/sportcomplex.webp"
        alt="Afbeelding van het sportcomplex"
      />
    </div>
    <div
      class="m-8 flex flex-col items-center justify-center gap-2 md:flex-row"
    >
      <div class="w-full bg-green-600">1</div>
      <div class="w-full bg-green-600">2</div>
      <div class="w-full bg-green-600">3</div>
    </div>
    <div>Sluitings dagen</div>
  </div>
  <button @click="handleLogout">logout</button>
</template>
<style scoped></style>
