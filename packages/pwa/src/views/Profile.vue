<script lang="ts">
import { defineComponent } from 'vue'
import useUser from '@/composables/useUser'
import StyledButton from '@/components/generic/StyledButton.vue'
import StyledInputText from '@/components/generic/StyledInputText.vue'
import { useMutation } from '@vue/apollo-composable'
import { UPDATE_GROUP, UPDATE_STAFF } from '@/graphql/user.query.ts'
import useLanguage from '@/composables/useLanguage'

export default defineComponent({
  setup() {
    const { customUser } = useUser()
    const { mutate: mutadeGroup } = useMutation(UPDATE_GROUP)
    const { mutate: mutadeStaff } = useMutation(UPDATE_STAFF)
    const { setLocale } = useLanguage()
    const saveGroup = () => {
      if (customUser.value?.userByUid.locale)
        mutadeGroup({
          _id: customUser.value?.userByUid.id,
          name: customUser.value?.userByUid.name,
          locale: customUser.value?.userByUid.locale,
          btwNumber: customUser.value?.userByUid.btwNumber,
        })
    }
    const SaveStaff = () => {
      mutadeStaff({
        id: customUser.value?.userByUid.id,
        firstName: customUser.value?.userByUid.firstName,
        lastName: customUser.value?.userByUid.lastName,
        email: customUser.value?.userByUid.email,
        locale: customUser.value?.userByUid.locale,
        phone: customUser.value?.userByUid.phone,
      })
    }
    return { customUser, saveGroup, SaveStaff, setLocale }
  },
  components: { StyledButton, StyledInputText },
})
</script>
<template>
  <div class="h-full">
    <div class="mx-auto flex h-full w-1/2 items-center justify-center">
      <div
        v-if="customUser?.userByUid.__typename == 'Group'"
        class="w-full max-w-sm rounded-lg bg-white p-4 shadow-sm"
      >
        <h1 class="font-600 text-xl">{{ $t('nav.profile') }}</h1>
        <styled-input-text
          v-model="customUser.userByUid.name"
          :label="$t('profile.name')"
        />
        <styled-input-text
          v-model="customUser.userByUid.btwNumber"
          :label="$t('profile.btw')"
        />

        <label class="my-3 block">
          <span class="c-primary-text font-medium">{{
            $t('profile.taal')
          }}</span>
          <br />
          <select
            v-model="customUser.userByUid.locale"
            class="b-2 b-primary-light hover:border-primary focus:border-primary-dark focus-visible:border-primary-dark w-full rounded bg-white px-4 py-1.5 outline-none transition-colors"
            @change="setLocale(customUser.userByUid.locale)"
          >
            <option value="nl">Nederland</option>
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="zh">中文</option>
          </select>
        </label>
        <StyledButton @click="saveGroup">
          {{ $t('button.safe') }}
        </StyledButton>
      </div>
      <div
        v-if="customUser?.userByUid.__typename == 'Staff'"
        class="w-full max-w-sm rounded-lg bg-white p-4 shadow-sm"
      >
        <h1 class="font-600 text-xl">{{ $t('nav.profile') }}</h1>
        <styled-input-text
          v-model="customUser.userByUid.firstName"
          :label="$t('staff.firstname')"
        />
        <styled-input-text
          v-model="customUser.userByUid.lastName"
          :label="$t('staff.lastname')"
        />
        <styled-input-text
          v-model="customUser.userByUid.email"
          :label="$t('staff.email')"
        />
        <styled-input-text
          v-model="customUser.userByUid.lastName"
          :label="$t('staff.phone')"
        />

        <label class="my-3 block">
          <span class="c-primary-text font-medium">{{
            $t('profile.taal')
          }}</span>
          <br />
          <select
            v-model="customUser.userByUid.locale"
            class="b-2 b-primary-light hover:border-primary focus:border-primary-dark focus-visible:border-primary-dark w-full rounded bg-white px-4 py-1.5 outline-none transition-colors"
            @change="setLocale(customUser.userByUid.locale)"
          >
            <option value="nl">Nederland</option>
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="zh">中文</option>
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
