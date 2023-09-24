<script lang="ts">
import { defineComponent, reactive } from 'vue'
import useFirebase from '@/composables/useFirebase.ts'
import useRouting from '@/composables/useRouting.ts'
import { useRouter } from 'vue-router'
import StyledInputText from '@/components/generic/StyledInputText.vue'
import StyledLink from '@/components/generic/StyledLink.vue'
import StyledButton from '@/components/generic/StyledButton.vue'

export default defineComponent({
  components: { StyledInputText, StyledButton, StyledLink },
  setup() {
    // data
    const form = reactive({
      email: '',
      password: '',
      displayName: '',
      error: '',
    })

    // composables
    const { redirectUrlAfterLogin } = useRouting()
    const { push } = useRouter()
    const { register } = useFirebase()

    // methods
    const submitForm = () => {
      register(form.email, form.password)
        .then(() => {
          push(redirectUrlAfterLogin)
        })
        .catch(error => {
          console.info({ error })
          form.error = error
        })
    }

    return {
      form,
      register: submitForm,
    }
  },
})
</script>

<template>
  <div class="c-primary-text">
    <form @submit.prevent="register">
      <h2 class="font-600 text-xl">Register</h2>
      <StyledInputText
        v-model="form.email"
        autocomplete="email"
        class="w-full"
        label="Email"
        required
        type="email"
      />
      <StyledInputText
        v-model="form.displayName"
        autocomplete="username"
        class="w-full"
        label="Username"
        required
        type="text"
      />

      <StyledInputText
        v-model="form.password"
        autocomplete="current-password"
        class="w-full"
        label="Password"
        required
        type="password"
      />

      <div v-if="form.error" class="text-red">{{ form.error }}</div>
      <StyledButton class="w-full" type="submit"> Register</StyledButton>
      <p class="my3 text-right">
        <styled-link to="/login"> Already have an account? Login </styled-link>
      </p>
    </form>
  </div>
</template>

<style scoped></style>
