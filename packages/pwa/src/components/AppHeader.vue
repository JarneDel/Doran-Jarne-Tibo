<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import StyledButton from '@/components/generic/StyledButton.vue'
import { ChevronDown } from 'lucide-vue-next'
import useUser from '@/composables/useUser'
import firebase from '@/composables/useFirebase'
import logo from '@/components/generic/Logo.vue'
import { OnClickOutside } from '@vueuse/components'
import useLanguage from '@/composables/useLanguage'
import { SUPPORTED_LOCALES } from '@/bootstrap/i18n.ts'
import { useI18n } from 'vue-i18n'
import ProfilePicture from '@/components/staff/ProfilePicture.vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  computed: {
    SUPPORTED_LOCALES() {
      return SUPPORTED_LOCALES
    },
  },
  setup() {
    const { firebaseUser } = firebase()
    const { setLocale, locale } = useLanguage()
    let options = ref(false)
    const { customUser } = useUser()
    const { push } = useRouter()
    const { t } = useI18n()
    const logoutButton = () => {
      push('/logout')
    }
    const toggleOptions = () => {
      options.value = !options.value
    }

    const topNavItems = computed(() => {
      return [
        {
          name: t('navigation.admin'),
          url: '/admin',
          roles: ['ADMIN', 'SUPER_ADMIN', 'STAFF'],
        },
        {
          name: t('navigation.reservation'),
          url: '/reservation',
          roles: ['GROUP'],
        },
        {
          name: t('navigation.repair'),
          url: '/repair',
          roles: ['GROUP', 'ADMIN', 'SUPER_ADMIN', 'STAFF'],
        },
        {
          name: t('navigation.staff'),
          url: '/staff',
          roles: ['STAFF'],
        },
      ].filter(item =>
        item.roles.includes(customUser.value?.userByUid.role ?? ''),
      )
    })

    return {
      options,
      toggleOptions,
      customUser,
      logoutButton,
      firebaseUser,
      setLocale,
      locale,
      topNavItems,
      username: computed(() =>
        customUser.value?.userByUid.__typename == 'Staff'
          ? customUser.value?.userByUid.firstName
          : customUser.value?.userByUid.name,
      ),
    }
  },

  components: {
    ProfilePicture,
    StyledButton,
    ChevronDown,
    logo,
    OnClickOutside,
  },
})
</script>

<template>
  <div
    class="relative flex h-20 min-h-min items-center justify-between bg-white fill-slate-700 p-2 shadow-md"
  >
    <router-link class="flex items-center justify-center gap-2" to="/">
      <logo class="h-10" />

      <h1 class="text-primary-text sr-only text-xl font-bold sm:not-sr-only">
        {{ $t('navigation.title') }}
      </h1>
    </router-link>
    <div class="flex items-center justify-center md:gap-8">
      <ul v-if="customUser" class="flex justify-center gap-4">
        <li v-for="item of topNavItems" :key="item.url">
          <router-link :to="item.url" class="styled-link"
            >{{ item.name }}
          </router-link>
        </li>
      </ul>
      <div v-if="!customUser">
        <label class="my-3 block">
          <select
            v-model="locale"
            class="b-2 b-primary-light hover:border-primary focus:border-primary-dark focus-visible:border-primary-dark w-full rounded bg-white px-4 py-1.5 outline-none transition-colors"
            @change="setLocale(locale)"
          >
            <option v-for="(locale, key) in SUPPORTED_LOCALES" :value="key">
              {{ locale }}
            </option>
          </select>
        </label>
      </div>
      <div>
        <button v-if="customUser" class="mx-2" @click="toggleOptions()">
          <ProfilePicture
            v-if="firebaseUser?.photoURL"
            :size="48"
            class="cursor-pointer"
          />
          <span v-else class="gap2 flex flex-row items-center justify-center">
            <span
              :title="username"
              class="inline-block max-w-[8rem] overflow-hidden text-ellipsis whitespace-nowrap"
            >
              {{ username }}
            </span>
            <ChevronDown />
          </span>
        </button>
        <router-link
          v-if="!customUser"
          class="px4 bg-secondary hover:border-secondary-lighter active:border-secondary-lighter active:bg-secondary-400 focus-visible-outline-none transition-color rounded border-2 border-transparent py-2 focus:border-black focus:outline-none focus-visible:border-black"
          to="/login"
        >
          {{ $t('auth.login') }}
        </router-link>
        <OnClickOutside @trigger="options = false">
          <div
            v-if="options"
            class="top-21 z-100 absolute right-0 flex flex-col items-center rounded-md bg-white p-4 shadow-md"
          >
            <router-link class="styled-link" to="/profile">{{
              $t('nav.profile')
            }}</router-link>
            <StyledButton class="mt-2" @click="logoutButton()">
              {{ $t('account.log.out') }}
            </StyledButton>
          </div>
        </OnClickOutside>
      </div>
    </div>
  </div>
</template>

<style scoped>
.styled-link::after {
  content: '';
  display: block;
  width: 0;
  height: 2px;
  background: #000;
  transition: width 0.3s ease-in-out;
}

.styled-link:hover::after {
  width: 100%;
}
</style>
