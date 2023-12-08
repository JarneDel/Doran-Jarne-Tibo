<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import StyledButton from '@/components/generic/StyledButton.vue'
import { ChevronDown, ChevronUp, Menu } from 'lucide-vue-next'
import useUser from '@/composables/useUser'
import firebase from '@/composables/useFirebase'
import logo from '@/components/generic/Logo.vue'
import { OnClickOutside } from '@vueuse/components'
import useLanguage from '@/composables/useLanguage'
import { SUPPORTED_LOCALES } from '@/bootstrap/i18n.ts'
import { useI18n } from 'vue-i18n'
import ProfilePicture from '@/components/staff/ProfilePicture.vue'
import { useRouter } from 'vue-router'
import { useWindowSize } from '@vueuse/core'
import useA11y from '@/composables/useA11y.ts'
import ProfileContextButton from '@/components/layout/ProfileContextButton.vue'

export default defineComponent({
  computed: {
    SUPPORTED_LOCALES() {
      return SUPPORTED_LOCALES
    },
  },
  setup() {
    const { width } = useWindowSize()
    const { MOBILE_VIEWPORT_SIZE } = useA11y()
    const { firebaseUser } = firebase()
    const { setLocale, locale } = useLanguage()
    const options = ref<Boolean>(false)
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
      ].filter(item => item.roles.includes(customUser.value?.role ?? ''))
    })

    const { sidebarIsOpen } = useA11y()
    const toggleSideNav = () => {
      sidebarIsOpen.value = !sidebarIsOpen.value
    }

    return {
      windowWidth: width,
      MOBILE_VIEWPORT_SIZE,
      options,
      toggleOptions,
      toggleSideNav,
      customUser,
      logoutButton,
      firebaseUser,
      setLocale,
      locale,
      topNavItems,
      username: computed(() =>
        customUser.value?.__typename == 'Staff'
          ? customUser.value?.firstName
          : customUser.value?.name,
      ),
    }
  },

  components: {
    ProfileContextButton,
    ProfilePicture,
    StyledButton,
    ChevronDown,
    logo,
    OnClickOutside,
    ChevronUp,
    Menu,
  },
})
</script>

<template>
  <div
    class="relative flex h-20 min-h-min items-center justify-between bg-white fill-slate-700 p-2 shadow-md"
  >
    <div class="flex flex-row items-center justify-center">
      <button
        v-if="windowWidth < MOBILE_VIEWPORT_SIZE"
        class="menu-button"
        @click="toggleSideNav"
      >
        <Menu :size="32" class="ml-[0.375rem] mr-[0.875rem]"></Menu>
      </button>
      <router-link class="flex items-center justify-center gap-2" to="/">
        <logo class="h-10" />

        <h1
          v-if="windowWidth > 350"
          class="xs text-primary-text font-bold sm:text-xl"
        >
          {{ $t('navigation.title') }}
        </h1>
      </router-link>
    </div>
    <div class="flex items-center justify-center md:gap-8">
      <ul
        v-if="customUser && windowWidth > MOBILE_VIEWPORT_SIZE"
        class="flex justify-center gap-4"
      >
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
      <ProfileContextButton :links="topNavItems" :user="customUser" />
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
