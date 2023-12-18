<script lang="ts">
import { computed, defineComponent, reactive } from 'vue'
import useFirebase from '@/composables/useFirebase.ts'
import { useRouter } from 'vue-router'
import { useMutation, useQuery } from '@vue/apollo-composable'
import {
  STAFF_COMPLETE_REGISTRATION,
  STAFF_REGISTER_BY_ID,
} from '@/graphql/staff-register.query.ts'
import Error from '@/components/Error.vue'
import StyledInputText from '@/components/generic/StyledInputText.vue'
import StyledButton from '@/components/generic/StyledButton.vue'
import StyledLink from '@/components/generic/StyledLink.vue'
import useLanguage from '@/composables/useLanguage.ts'
import { i18n } from '@/bootstrap/i18n.ts'

export default defineComponent({
  name: 'StaffRegister',
  components: { StyledLink, StyledButton, StyledInputText, Error },
  setup() {
    const { push, currentRoute } = useRouter()
    const id = currentRoute.value.params.id
    const { firebaseUser, register: firebaseRegister } = useFirebase()
    const { locale } = useLanguage()

    const t = i18n.global.t

    const form = reactive({
      password: '',
      phone: '',
      error: [] as string[],
    })

    if (firebaseUser.value) {
      push('/staff-register/logged-in?id=' + id)
    }

    const { result } = useQuery(STAFF_REGISTER_BY_ID, {
      id: id as string,
    })
    const { mutate } = useMutation(STAFF_COMPLETE_REGISTRATION)

    const staffRegister = computed(() => result.value?.staffRegisterById)

    const isExpired = computed(() => {
      if (!result.value?.staffRegisterById) return null
      return result.value.staffRegisterById.expiresAt < new Date()
    })

    const displayName = computed(
      () =>
        result.value?.staffRegisterById?.firstName +
        ' ' +
        result.value?.staffRegisterById?.lastName,
    )

    const register = () => {
      firebaseRegister(staffRegister.value?.email as string, form.password)
        .then(firebaseUser => {
          mutate({
            staffSignUpInput: {
              id: id as string,
              locale: locale.value,
              uid: firebaseUser.uid,
              phone: form.phone,
            },
          })
            .then(() => push('/staff'))
            .catch(error => {
              console.info({ error })
              form.error.push(error)
              // DELETE FIREBASE USER
              firebaseUser.delete()
            })
        })
        .catch(error => {
          console.info({ error })
          form.error.push(t(error))
        })
    }

    return {
      staffRegister,
      displayName,
      isExpired,
      form,
      register,
    }
  },
})
</script>

<template>
  <div
    v-if="staffRegister"
    class="mx-auto mt-12 flex h-min w-full max-w-lg flex-col gap-4 overflow-hidden rounded-xl border bg-white p-4 shadow-md dark:bg-gray-800"
  >
    <div v-if="isExpired">
      <h1>Expired</h1>
      <p>This link has expired.</p>
    </div>
    <div v-else>
      <Error
        v-for="(err, index) in form.error"
        :isShown="!!err"
        :msg="err ?? undefined"
        @update:isShown="form.error[index] = ''"
      />
      <form @submit.prevent="register">
        <h2 class="font-600 text-xl">{{ $t('auth.staffRegister.title') }}</h2>
        <p>{{ $t('auth.staffRegister.description') }}</p>

        <StyledInputText
          v-model="form.password"
          :label="$t('auth.password')"
          autocomplete="current-password"
          class="w-full"
          required
          type="password"
        />
        <styled-input-text
          v-model="form.phone"
          :label="$t('auth.phone')"
          autocomplete="tel"
          class="w-full"
          required
          type="tel"
        />

        <StyledButton class="mt2 w-full" type="submit">
          {{ $t('auth.staffRegister.button') }}
        </StyledButton>
      </form>
    </div>
  </div>
</template>

<style scoped></style>
