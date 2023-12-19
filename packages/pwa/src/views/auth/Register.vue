<script lang="ts">
import { computed, defineComponent, reactive } from 'vue'
import useFirebase from '@/composables/useFirebase.ts'
import { useRouter } from 'vue-router'
import StyledInputText from '@/components/generic/StyledInputText.vue'
import StyledLink from '@/components/generic/StyledLink.vue'
import StyledButton from '@/components/generic/StyledButton.vue'
import { useMutation } from '@vue/apollo-composable'
import { CREATE_GROUP, CreateGroupInput } from '@/graphql/user.query.ts'
import useUser from '@/composables/useUser'
import useLanguage from '@/composables/useLanguage'
import { useI18n } from 'vue-i18n'
import Error from '@/components/Error.vue'

export default defineComponent({
  components: { Error, StyledInputText, StyledButton, StyledLink },
  setup() {
    // data
    const form = reactive({
      btwNummer: '',
      email: '',
      password: '',
      displayName: '',
      error: [] as string[],
    })

    // composables
    const { replace } = useRouter()
    const { register } = useFirebase()
    const { restoreCustomUser } = useUser()
    const { mutate } = useMutation<any, CreateGroupInput>(CREATE_GROUP)
    const { locale } = useLanguage()
    const { currentRoute } = useRouter()
    const { t } = useI18n()

    // methods
    const submitForm = () => {
      register(form.email, form.password)
        .then(async () => {
          await mutate({
            createGroupInput: {
              name: form.displayName,
              locale: locale.value,
              btwNumber: form.btwNummer,
              email: form.email,
            },
          })

          await restoreCustomUser()
          replace('/')
        })
        .catch(error => {
          console.info({ error })
          form.error.push(t(error))
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
    <Error
      v-for="(err, index) in form.error"
      :isShown="!!err"
      :msg="err ?? undefined"
      @update:isShown="form.error[index] = ''"
    />
    <form @submit.prevent="register">
      <h2 class="font-600 text-xl">{{ $t('auth.register') }}</h2>
      <StyledInputText
        v-model="form.displayName"
        :label="$t('auth.displayName')"
        autocomplete="username"
        class="my-3 w-full"
        required
        type="text"
      />
      <StyledInputText
        v-model="form.btwNummer"
        :label="$t('profile.btw')"
        class="my-3 w-full"
        type="text"
      />
      <StyledInputText
        v-model="form.email"
        :label="$t('auth.email')"
        autocomplete="email"
        class="my-3 w-full"
        required
        type="email"
      />

      <StyledInputText
        v-model="form.password"
        :label="$t('auth.password')"
        autocomplete="current-password"
        class="my-3 w-full"
        required
        type="password"
      />

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
