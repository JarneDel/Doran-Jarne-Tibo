<script lang="ts" setup>

import { ChevronDown, ChevronUp } from 'lucide-vue-next'
import StyledButton from '@/components/generic/StyledButton.vue'
import ProfilePicture from '@/components/staff/ProfilePicture.vue'
import { OnClickOutside } from '@vueuse/components'
import { PropType, ref } from 'vue'
import { User } from 'firebase/auth'

defineProps({
  user: {
    type: Object as PropType<User>,
    required: true,
  },

})

const open = ref(false)

</script>

<template>
  <OnClickOutside @trigger="open = false">
    <button
      v-if="customUser"
      class="gap2 mx-2 flex flex-row items-center justify-center"
      @click="toggleOptions()"
    >
            <span
              :title="username"
              class="hidden max-w-[8rem] overflow-hidden text-ellipsis whitespace-nowrap sm:inline-block"
            >
              {{ username }}
            </span>
      <ChevronDown v-if="!options" />
      <ChevronUp v-else />
      <ProfilePicture v-if="firebaseUser?.photoURL" :size="48" />
    </button>
    <div v-if="options">
      <div
        class="top-19 z-100 absolute right-4 flex flex-col rounded-md bg-white p-4 shadow-md"
      >
        <router-link class="styled-link w-fit" to="/profile">{{
            $t('nav.profile')
          }}
        </router-link>
        <StyledButton class="mt-2" @click="logoutButton()">
          {{ $t('account.log.out') }}
        </StyledButton>
      </div>
    </div>
  </OnClickOutside>
  <router-link
    v-if="!customUser"
    class="px4 bg-secondary hover:border-secondary-lighter active:border-secondary-lighter active:bg-secondary-400 focus-visible-outline-none transition-color rounded border-2 border-transparent py-2 focus:border-black focus:outline-none focus-visible:border-black"
    to="/login"
  >
    {{ $t('auth.login') }}
  </router-link>
  </div>
</template>

<style scoped>

</style>
