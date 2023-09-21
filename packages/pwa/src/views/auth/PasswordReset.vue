<script lang='ts'>
import { LucideArrowLeft } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { defineComponent, reactive } from 'vue'
import useFirebase from '@/composables/useFirebase.ts'

export default defineComponent({
  components: {
    LucideArrowLeft,
  },
  setup() {
    const { go } = useRouter()
    const { passwordReset } = useFirebase()

    const form = reactive({
      email: '',
      error: '',
      success: false,
    })

    const reset = () => {
      console.log('reset')
      if (!form.email) {
        // todo: show error
        return
      }
      passwordReset(form.email).then(() => {
        console.log('success')
        form.success = true
      }).catch((error) => {
        form.error = error
      })
    }
    return {
      form,
      reset,
      go,
    }
  },
})

</script>

<template>
  <h2 class='font-title mb-4 text-lg'>
    <a @click='go(-1)'>
      <lucide-arrow-left class='hover:text-primary-500 inline' />
    </a>
    Reset your password
  </h2>
  <form @submit.prevent='reset' v-if='!form.success'>
    <label for='email'></label>
    <input type='email' placeholder='Email' required id='email' name='email' v-model='form.email' />
    <button type='submit' class='btn btn-primary'>Reset</button>
    <p class='text-red' v-if='form.error'>
      {{ form.error }}
    </p>
  </form>
    <div v-if='form.success'>
      <p class='text-green-500'>
        Check your email for a link to reset your password. If it doesn’t appear within a few
        minutes, check your spam folder.</p>
      <p class='text-green-500'>If you don’t receive an email, contact support</p>
    </div>
</template>

<style scoped>

</style>
