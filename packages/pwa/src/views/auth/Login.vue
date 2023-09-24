<script lang="ts">
import { defineComponent, ref } from 'vue'
import { type AuthError } from 'firebase/auth'

import useFirebase from '@/composables/useFirebase'
import StyledInputText from '@/components/generic/StyledInputText.vue'
import StyledButton from '@/components/generic/StyledButton.vue'
import StyledLink from '@/components/generic/StyledLink.vue'

export default defineComponent({
  components: { StyledLink, StyledInputText, StyledButton },
  setup() {
    const error = ref<AuthError | null>(null)
    const { login, firebaseUser } = useFirebase()
    const credentials = ref({
      email: '',
      password: '',
    })
    const handleLogin = () => {
      login(credentials.value.email, credentials.value.password)
        .then(() => {
          console.log('logged in')
        })
        .catch((err: AuthError) => {
          error.value = err
        })
    }
    return {
      credentials,
      firebaseUser,
      error,
      handleLogin,
    }
  },
})
</script>

<template>
  <form @submit.prevent="handleLogin">
    <h1 class="font-600 text-xl">Login</h1>
    <p v-if="error">{{ error }}</p>
    <p v-if="firebaseUser">Logged in as {{ firebaseUser.email }}</p>
    <styled-input-text
      v-model="credentials.email"
      autocomplete="email"
      class="w-full"
      label="Email"
      required
      type="email"
    />
    <styled-input-text
      v-model="credentials.password"
      autocomplete="current-password"
      class="w-full"
      label="Password"
      required
      type="password"
    />
    <div class="my-3 text-right">
      <styled-link to="/password-reset">Forgot Password?</styled-link>
    </div>
    <StyledButton class="my-2 w-full" type="submit"> Login</StyledButton>
    <div class="text-center">
      No account yet?
      <StyledLink to="/register">Register</StyledLink>
    </div>
  </form>
</template>

<style scoped></style>
