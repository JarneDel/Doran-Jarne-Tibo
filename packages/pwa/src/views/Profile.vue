<script lang="ts">
import { defineComponent } from 'vue'
import useUser from '@/composables/useUser'
import StyledButton from '@/components/generic/StyledButton.vue'
import StyledInputText from '@/components/generic/StyledInputText.vue'
import { useMutation } from '@vue/apollo-composable'
import { UPDATE_GROUP, UPDATE_STAFF } from '@/graphql/user.query.ts'
import useLanguage from '@/composables/useLanguage'
import { SUPPORTED_LOCALES } from '@/bootstrap/i18n'
import ProfilePicture from '@/components/staff/ProfilePicture.vue'

export default defineComponent({
  setup() {
    const { customUser } = useUser()
    const { mutate: mutadeGroup } = useMutation(UPDATE_GROUP)
    const { mutate: mutadeStaff } = useMutation(UPDATE_STAFF)
    const { setLocale } = useLanguage()
    const saveGroup = () => {
      if (customUser.value?.locale)
        mutadeGroup({
          _id: customUser.value?.id,
          name: customUser.value?.name,
          locale: customUser.value?.locale,
          btwNumber: customUser.value?.btwNumber,
        })
    }
    const SaveStaff = () => {
      mutadeStaff({
        id: customUser.value?.id,
        firstName: customUser.value?.firstName,
        lastName: customUser.value?.lastName,
        email: customUser.value?.email,
        locale: customUser.value?.locale,
        phone: customUser.value?.phone,
      })
    }
    return { customUser, saveGroup, SaveStaff, setLocale, SUPPORTED_LOCALES }
  },
  components: { ProfilePicture, StyledButton, StyledInputText },
})
</script>
<template>
  <div class="h-full">
    <div class="mx-auto flex h-full w-1/2 items-center justify-center">
      <div
        v-if="customUser?.__typename == 'Group'"
        class="w-full max-w-sm rounded-lg bg-white p-4 shadow-sm"
      >
        <h1 class="font-600 text-xl">{{ $t('nav.profile') }}</h1>
        <div class="flex justify-center">
          <ProfilePicture editable />
        </div>
        <styled-input-text
          v-model="customUser.name"
          :label="$t('profile.name')"
          class="my-1"
        />
        <styled-input-text
          v-model="customUser.btwNumber"
          :label="$t('profile.btw')"
          class="my-1"
        />

        <label class="my-1 mb-3 block">
          <span class="c-primary-text font-medium">{{
            $t('profile.taal')
          }}</span>
          <br />
          <select
            v-model="customUser.locale"
            class="b-2 b-primary-light hover:border-primary focus:border-primary-dark focus-visible:border-primary-dark w-full rounded bg-white px-4 py-1.5 outline-none transition-colors"
            @change="setLocale(customUser.locale)"
          >
            <option v-for="(locale, key) in SUPPORTED_LOCALES" :value="key">
              {{ locale }}
            </option>
          </select>
        </label>
        <StyledButton @click="saveGroup">
          {{ $t('button.safe') }}
        </StyledButton>
      </div>
      <div
        v-if="customUser?.__typename == 'Staff'"
        class="w-full max-w-sm rounded-lg bg-white p-4 shadow-sm"
      >
        <h1 class="font-600 text-xl">{{ $t('nav.profile') }}</h1>
        <div class="flex justify-center">
          <ProfilePicture editable />
        </div>
        <styled-input-text
          v-model="customUser.firstName"
          :label="$t('staff.firstname')"
          class="my-1"
        />
        <styled-input-text
          v-model="customUser.lastName"
          :label="$t('staff.lastname')"
          class="my-1"
        />
        <styled-input-text
          v-model="customUser.email"
          :label="$t('staff.email')"
          class="my-1"
        />
        <styled-input-text
          v-model="customUser.phone"
          :label="$t('staff.phone')"
          class="my-1"
        />

        <label class="my-1 mb-3 block">
          <span class="c-primary-text font-medium">{{
            $t('profile.taal')
          }}</span>
          <br />
          <select
            v-model="customUser.locale"
            class="b-2 b-primary-light hover:border-primary focus:border-primary-dark focus-visible:border-primary-dark w-full rounded bg-white px-4 py-1.5 outline-none transition-colors"
            @change="setLocale(customUser.locale)"
          >
            <option v-for="(locale, key) in SUPPORTED_LOCALES" :value="key">
              {{ locale }}
            </option>
          </select>
        </label>
        <StyledButton @click="SaveStaff">
          {{ $t('button.safe') }}
        </StyledButton>
      </div>
    </div>
  </div>
</template>
<style scoped></style>
