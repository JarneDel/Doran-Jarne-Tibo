<script lang="ts">
import { LucideArrowLeft } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { defineComponent, reactive } from 'vue'
import useFirebase from '@/composables/useFirebase.ts'
import StyledInputText from '@/components/generic/StyledInputText.vue'
import StyledButton from '@/components/generic/StyledButton.vue'

export default defineComponent({
  components: {
    StyledButton,
    StyledInputText,
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
      passwordReset(form.email)
        .then(() => {
          console.log('success')
          form.success = true
        })
        .catch(error => {
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
  <h2 class="font-title mb-4 text-lg">
    <a @click="go(-1)">
      <lucide-arrow-left class="hover:text-primary-500 inline" />
    </a>
    Reset your password
  </h2>
  <form v-if="!form.success" class="max-w-md" @submit.prevent="reset">
    <p>
      We will send you an email with a password-reset link if there is an
      account with that email
    </p>
    <styled-input-text
      v-model="form.email"
      autocomplete="email"
      class="w-full"
      label="Email"
      required
      type="email"
    />
    <StyledButton class="my-2 w-full" type="submit">Send</StyledButton>

    <p v-if="form.error" class="text-red">
      {{ form.error }}
    </p>
  </form>
  <div v-if="form.success" class="max-w-md">
    <p class="text-green-500">
      Check your email for a link to reset your password. If it doesn’t appear
      within a few minutes, check your spam folder.
    </p>
    <p class="text-green-500">If you don’t receive an email, contact support</p>
  </div>
</template>

<style scoped></style>
