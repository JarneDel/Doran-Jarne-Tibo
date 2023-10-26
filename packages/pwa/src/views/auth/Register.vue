<script lang="ts">
import { computed, defineComponent, reactive } from 'vue'
import useFirebase from '@/composables/useFirebase.ts'
import { useRouter } from 'vue-router'
import StyledInputText from '@/components/generic/StyledInputText.vue'
import StyledLink from '@/components/generic/StyledLink.vue'
import StyledButton from '@/components/generic/StyledButton.vue'
import { useMutation } from '@vue/apollo-composable'
import { CREATE_GROUP } from '@/graphql/usser.query'
import useUser from '@/composables/useUser'
import locale from '@/composables/useLanguage'

export default defineComponent({
  components: { StyledInputText, StyledButton, StyledLink },
  setup() {
    const { setLocale } = locale()
    // data
    const form = reactive({
      btwNummer: '',
      email: '',
      password: '',
      displayName: '',
      error: '',
    })

    // composables
    const { replace } = useRouter()
    const { register } = useFirebase()
    const { restoreCustomUser } = useUser()
    const { mutate } = useMutation(CREATE_GROUP)
    const { currentRoute } = useRouter()

    // methods
    const submitForm = () => {
      register(form.email, form.password)
        .then(async () => {
          if (form.btwNummer == '') {
            await mutate({
              name: form.displayName,
              btwNumber: null,
              locale: 'nl',
            })
          } else {
            await mutate({
              name: form.displayName,
              btwNumber: form.btwNummer,
              locale: 'nl',
            })
          }
          await restoreCustomUser()
          setLocale('nl')
          replace('/')
        })
        .catch(error => {
          console.info({ error })
          form.error = error
        })
    }

    const redirectToQueryParams = computed(() => {
      return '?redirect=' + (currentRoute.value.query.redirect as string) || ''
    })

    return {
      form,
      register: submitForm,
      redirectToQueryParams,
    }
  },
})
</script>

<template>
  <div class="c-primary-text">
    <form @submit.prevent="register">
      <h2 class="font-600 text-xl">{{ $t('auth.register') }}</h2>
      <StyledInputText
        v-model="form.displayName"
        :label="$t('auth.displayName')"
        autocomplete="username"
        class="w-full"
        required
        type="text"
      />
      <StyledInputText
        v-model="form.btwNummer"
        :label="$t('profile.btw')"
        class="w-full"
        type="text"
      />
      <StyledInputText
        v-model="form.email"
        :label="$t('auth.email')"
        autocomplete="email"
        class="w-full"
        required
        type="email"
      />

      <StyledInputText
        v-model="form.password"
        :label="$t('auth.password')"
        autocomplete="current-password"
        class="w-full"
        required
        type="password"
      />

      <div v-if="form.error" class="text-red">{{ form.error }}</div>
      <StyledButton class="w-full" type="submit">
        {{ $t('auth.register') }}</StyledButton
      >
      <p class="my3 text-right">
        <styled-link :to="'/login' + redirectToQueryParams">
          {{ $t('auth.register.login') }}
        </styled-link>
      </p>
    </form>
  </div>
</template>

<style scoped></style>
