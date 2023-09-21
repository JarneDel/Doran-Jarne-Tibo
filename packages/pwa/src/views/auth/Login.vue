<script lang="ts">
import { defineComponent } from 'vue'
import { ref } from 'vue'
import { type AuthError } from 'firebase/auth'

import useFirebase from '@/composables/useFirebase'
export default defineComponent({
  setup() {
    const error = ref<AuthError | null>(null)
  const { login, firebaseUser } = useFirebase()
  const credetials = ref({
    email: '',
    password: ''
  })
  const handleLogin = () => {
      login(credetials.value.email, credetials.value.password)
        .then(() => {
          console.log('logged in')
        })
        .catch((err: AuthError) => {
          error.value = err
        })
    }
  return {
    credetials,
    firebaseUser,
    error,
    handleLogin
  }
 }
})
</script>

<template>
<form @submit.prevent="handleLogin">
  <h1>Login</h1>
  <p v-if="error">{{ error.message }}</p>
  <p v-if="firebaseUser">Logged in as {{ firebaseUser.email }}</p>
  <label for="email">Email</label>
  <input type="email" id="email" name="email" v-model="credetials.email">
  <label for="password">Password</label>
  <input type="password" id="password" name="password" v-model="credetials.password">
  <button type="submit">Login</button>
</form>
</template>

<style scoped>

</style>
