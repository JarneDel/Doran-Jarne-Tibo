<script lang="ts">
import { defineComponent } from 'vue'
import StyledButton from '@/components/generic/StyledButton.vue'
import { ref } from 'vue'
import { ChevronDown } from 'lucide-vue-next'
import useUser from '@/composables/useUser'
import firebase from '@/composables/useFirebase'
import logo from '@/components/generic/Logo.vue'
import { OnClickOutside } from '@vueuse/components'
import useLanguage from '@/composables/useLanguage'
export default defineComponent({
  setup() {
    const { logout } = firebase()
    const { firebaseUser } = firebase()
    const { setLocale, locale } = useLanguage()
    let options = ref(false)
    const toggleOptions = () => {
      options.value = !options.value
    }
    const { customUser, userLogout } = useUser()
    const logoutbutton = () => {
      logout().then(() => {
        userLogout()
        options.value = false
      })
    }
    return { options, toggleOptions, customUser, logoutbutton, firebaseUser,setLocale, locale }
  },
  components: { StyledButton, ChevronDown, logo, OnClickOutside },
})
</script>

<template>
  <div
    class="flex h-20 min-h-min items-center justify-between bg-white fill-slate-700 p-2 shadow-md"
  >
    <router-link to="/" class="flex items-center justify-center gap-2">
      <logo class="h-10" />

      <h1 class="text-primary-text text-xl font-bold">
        {{ $t('navigation.title') }}
      </h1>
    </router-link>
    <div class="flex items-center justify-center gap-8">
      <div class="flex justify-center gap-4" v-if="customUser">
        <div
          v-if="
            ['SUPER_ADMIN', 'ADMIN', 'STAFF'].includes(
              customUser?.userByUid.role,
            )
          "
          class="hover:font-bold"
        >
          <router-link to="/admin">{{ $t('navigation.admin') }}</router-link>
        </div>
        <div
          v-if="customUser?.userByUid.role == 'GROUP'"
          class="hover:font-bold"
        >
          <router-link to="/reservation">{{
            $t('navigation.reservation')
          }}</router-link>
        </div>
        <div class="hover:font-bold">
          <router-link to="/repair">{{ $t('navigation.repair') }}</router-link>
        </div>
      </div>
      <div v-if="!customUser">
        <label class="my-3 block">
          <select
            @change="setLocale(locale)"
            v-model="locale"
            class="b-2 b-primary-light hover:border-primary focus:border-primary-dark focus-visible:border-primary-dark w-full rounded bg-white px-4 py-1.5 outline-none transition-colors"
          >
            <option value="nl">Nederland</option>
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="zh">中文</option>
          </select>
        </label>
      </div>
      <div class="relative">
        <button
          v-if="customUser"
          class="mx-2 flex items-center justify-center gap-4"
          @click="toggleOptions()"
        >
          <ChevronDown />
          <div class="">
            <p
              class="max-w-[6rem] overflow-hidden text-ellipsis whitespace-nowrap"
              :title="customUser?.userByUid.firstName"
              v-if="customUser?.userByUid.__typename == 'Staff'"
            >
              {{ customUser?.userByUid.firstName }}
            </p>

            <p
              class="max-w-[6rem] overflow-hidden text-ellipsis whitespace-nowrap"
              :title="customUser?.userByUid.name"
              v-if="customUser?.userByUid.__typename == 'Group'"
            >
              {{ customUser?.userByUid.name }}
            </p>
          </div>
        </button>
        <router-link
          v-if="!customUser"
          to="/login"
          class="px4 bg-secondary hover:border-secondary-lighter active:border-secondary-lighter active:bg-secondary-400 focus-visible-outline-none transition-color rounded border-2 border-transparent py-2 focus:border-black focus:outline-none focus-visible:border-black"
        >
          {{ $t('auth.login') }}
        </router-link>
        <OnClickOutside @trigger="options = false">
          <div
            v-if="options"
            class="absolute right-0 top-9 rounded-md bg-white p-4 shadow-md"
          >
            <router-link to="/profile">{{ $t('nav.profile') }}</router-link>
            <StyledButton @click="logoutbutton()" class="mt-2">
              {{ $t('account.log.out') }}
            </StyledButton>
          </div>
        </OnClickOutside>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
