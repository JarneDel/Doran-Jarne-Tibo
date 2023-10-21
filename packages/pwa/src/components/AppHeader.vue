<script lang="ts">
import { defineComponent } from 'vue'
import StyledButton from '@/components/generic/StyledButton.vue'
import { ref } from 'vue'
import { ChevronDown } from 'lucide-vue-next'
import useUser from '@/composables/useUser'
import firebase from '@/composables/useFirebase'
import logo from '@/components/generic/Logo.vue'
import { OnClickOutside } from '@vueuse/components'
export default defineComponent({
  setup() {
    const { logout } = firebase()
    const { firebaseUser } = firebase()
    let options = ref(false)
    const toggleOptions = () => {
      options.value = !options.value
    const { customUser, restoreCustomUser, userLogout } = useUser()

    restoreCustomUser()
    const logoutbutton = () => {
      logout().then(() => {
        userLogout()
        options.value = false
      })
    }
    console.log(firebaseUser.value?.email)
    return { options, toggleOptions, customUser, logoutbutton, firebaseUser }
  },
  components: { StyledButton, ChevronDown, logo, OnClickOutside },
})
</script>

<template>
  <div
    class="flex items-center justify-between bg-white fill-slate-700 p-2 shadow-md"
  >
    <router-link to="/" class="flex items-center justify-center gap-2">
      <logo class="h-10" />

      <h1 class="text-primary-text text-xl font-bold">
        {{ $t('navigation.title') }}
      </h1>
    </router-link>
    <div class="flex items-center justify-center gap-8">
      <div class="flex justify-center gap-4">
        <div class="hover:font-bold">
          <router-link to="/">{{ $t('navigation.home') }}</router-link>
        </div>
        <div class="hover:font-bold">
          <router-link to="/repair">{{ $t('navigation.repair') }}</router-link>
        </div>
        <div
          v-if="(customUser?.userByUid.role == 'STAFF', 'ADMIN', 'SUPER_ADMIN')"
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
      </div>
      <div class="relative">
        <button
          v-if="customUser"
          class="flex items-center justify-center gap-4"
          @click="toggleOptions()"
        >
          <ChevronDown />
          <div class="mx-2">
            <p
              class="w-25 overflow-hidden text-ellipsis whitespace-nowrap"
              :title="customUser?.userByUid.firstName"
              v-if="customUser?.userByUid.__typename == 'Staff'"
            >
              {{ customUser?.userByUid.firstName }}
            </p>

            <p
              class="w-25 overflow-hidden text-ellipsis whitespace-nowrap"
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
        <OnClickOutside
        @trigger="options = false"
        >
          <div
            v-if="options"
            class="absolute right-0 top-9 rounded-md bg-white p-4 shadow-md"
          >
            <router-link to="/profile">profile</router-link>
            <StyledButton @click="logoutbutton()" class="mt-2">
              logout
            </StyledButton>
          </div>
        </OnClickOutside>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
