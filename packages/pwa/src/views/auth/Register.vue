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
      }).catch((error) => {
        console.info({error})
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
  <div>
    <form @submit.prevent='register'>
      <label for='email'>Email</label>
      <input type='email' id='email' name='email' v-model='form.email' required>
      <label for='password'>Password</label>
      <input type='password' id='password' name='password' v-model='form.password' required>
      <div class='text-red' v-if='form.error'>{{ form.error }}</div>
      <button type='submit'>Register</button>
      <p>Already have an account?
        <router-link to='/login'>Login</router-link>
      </p>
    </form>
  </div>
</template>

<style scoped>

</style>
