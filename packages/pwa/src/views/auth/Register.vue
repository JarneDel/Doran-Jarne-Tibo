<script lang='ts'>
import { defineComponent, reactive } from 'vue'
import useFirebase from '@/composables/useFirebase.ts'
import useRouting from '@/composables/useRouting.ts'
import { useRouter } from 'vue-router'

export default defineComponent({
  setup() {
    // data
    const form = reactive({
      email: '',
      password: '',
      error: '',
    })


    // composables
    const { redirectUrlAfterLogin } = useRouting()
    const { push } = useRouter()
    const { register } = useFirebase()

    // methods
    const submitForm = () => {
      register(form.email, form.password).then(() => {
        push(redirectUrlAfterLogin)
      }).catch((error: unknown) => {
        if (error instanceof Error) {
          form.error = error.message
        } else {
          form.error = 'An unexpected error occurred. Please try again or contact support if the problem persists.'
        }
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
  <div>
    <form @submit.prevent='register'>
      <label for='email'>Email</label>
      <input type='email' id='email' name='email' v-model='form.email' required>
      <label for='password'>Password</label>
      <input type='password' id='password' name='password' v-model='form.password' required>
      <button type='submit'>Register</button>
    </form>
  </div>
</template>

<style scoped>

</style>
