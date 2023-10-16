<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { type AuthError } from 'firebase/auth'

import useFirebase from '@/composables/useFirebase'
import StyledInputText from '@/components/generic/StyledInputText.vue'
import StyledButton from '@/components/generic/StyledButton.vue'
import StyledLink from '@/components/generic/StyledLink.vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  components: { StyledLink, StyledInputText, StyledButton },
  setup() {
    const error = ref<AuthError | null>(null)

    const { push } = useRouter()
    const { login, firebaseUser } = useFirebase()
    const { currentRoute } = useRouter()

    const credentials = ref({
      email: '',
      password: '',
    })
    const handleLogin = () => {
      login(credentials.value.email, credentials.value.password)
        .then(() => {
          console.log('logged in')
          push((currentRoute.value.query.redirect as string) || '/')
        })
        .catch((err: AuthError) => {
          error.value = err
        })
    }

    const redirectToQueryParams = computed(() => {
      return '?redirect=' + (currentRoute.value.query.redirect as string) || ''
    })

    return {
      credentials,
      firebaseUser,
      error,
      redirectToQueryParams,
      handleLogin,
    }
  },
})
</script>

<template>
  <form class="c-primary-text" @submit.prevent="handleLogin">
    <h1 class="font-600 text-xl">{{ $t('auth.login') }}</h1>
    <p v-if="error">{{ error }}</p>
    <p v-if="firebaseUser">
      {{ $t('auth.loggedInAs') }} {{ firebaseUser.email }}
    </p>
    <styled-input-text
      v-model="credentials.email"
      :label="$t('auth.email')"
      autocomplete="email"
      class="w-full"
      required
      type="email"
    />
    <styled-input-text
      v-model="credentials.password"
      :label="$t('auth.password')"
      autocomplete="current-password"
      class="w-full"
      required
      type="password"
    />
    <div class="my-3 text-right">
      <styled-link to="/password-reset"
        >{{ $t('auth.forgotPassword') }}
      </styled-link>
    </div>
    <StyledButton class="my-2 w-full" type="submit"> Login</StyledButton>
    <div class="text-center">
      {{ $t('auth.noAccount') }}
      <StyledLink :to="'/register' + redirectToQueryParams"
        >{{ $t('auth.register') }}
      </StyledLink>
    </div>
  </form>
</template>

<style scoped></style>
