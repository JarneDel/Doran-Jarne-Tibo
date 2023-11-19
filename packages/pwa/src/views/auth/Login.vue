<script lang="ts">
import { computed, defineComponent, ref } from 'vue'

import useFirebase from '@/composables/useFirebase'
import StyledInputText from '@/components/generic/StyledInputText.vue'
import StyledButton from '@/components/generic/StyledButton.vue'
import StyledLink from '@/components/generic/StyledLink.vue'
import { useRouter } from 'vue-router'
import useUser from '@/composables/useUser'
import { useI18n } from 'vue-i18n'
import useLanguage from '@/composables/useLanguage.ts'
import Error from '@/components/Error.vue'

export default defineComponent({
  components: { Error, StyledLink, StyledInputText, StyledButton },
  setup() {
    const { restoreCustomUser, customUser } = useUser()
    const error = ref<string[]>([])

    const { replace } = useRouter()
    const { login, firebaseUser } = useFirebase()
    const { currentRoute } = useRouter()
    const { t } = useI18n()
    const { setLocale } = useLanguage()

    const credentials = ref({
      email: '',
      password: '',
    })
    const handleLogin = () => {
      login(credentials.value.email, credentials.value.password)
        .then(() => {
          restoreCustomUser().then(() => {
            setLocale(customUser.value?.userByUid.locale ?? 'en')
            console.log(firebaseUser.value?.email)
            console.log(customUser.value?.userByUid)
            console.log('restored user')
            replace('/')
          })
        })
        .catch((err: string) => {
          error.value.push(t(err))
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
    <Error
      v-for="(err, index) in error"
      :isShown="!!err"
      :msg="err ?? undefined"
      @update:isShown="error[index] = ''"
    />
    <styled-input-text
      v-model="credentials.email"
      :label="$t('auth.email')"
      autocomplete="email"
      class="my-3 w-full"
      required
      type="email"
    />
    <styled-input-text
      v-model="credentials.password"
      :label="$t('auth.password')"
      autocomplete="current-password"
      class="my-3 w-full"
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
