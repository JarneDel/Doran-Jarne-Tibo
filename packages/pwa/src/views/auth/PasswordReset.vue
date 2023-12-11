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
    {{ $t('auth.passwordReset.title') }}
  </h2>
  <form v-if="!form.success" class="max-w-md" @submit.prevent="reset">
    <p>
      {{ $t('auth.passwordReset.description') }}
    </p>
    <styled-input-text
      v-model="form.email"
      :label="$t('auth.email')"
      autocomplete="email"
      class="my-3 w-full"
      required
      type="email"
    />
    <StyledButton class="my-2 w-full" type="submit">{{
      $t('auth.passwordReset.submit')
    }}</StyledButton>

    <p v-if="form.error" class="text-red">
      {{ form.error }}
    </p>
  </form>
  <div v-if="form.success" class="max-w-md">
    <p class="text-green-500">
      {{ $t('auth.passwordReset.success') }}
    </p>
    <p class="text-green-500">{{ $t('auth.passwordReset.support') }}</p>
  </div>
</template>

<style scoped></style>
