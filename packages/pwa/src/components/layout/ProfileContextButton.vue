<script lang="ts" setup>
import { ChevronDown, ChevronUp } from 'lucide-vue-next'
import StyledButton from '@/components/generic/StyledButton.vue'
import ProfilePicture from '@/components/staff/ProfilePicture.vue'
import { OnClickOutside } from '@vueuse/components'
import { computed, PropType, ref } from 'vue'
import { User } from '@/composables/useUser.ts'
import useFirebase from '@/composables/useFirebase.ts'
import { useWindowSize } from '@vueuse/core'
import useA11y from '@/composables/useA11y.ts'

const { firebaseUser } = useFirebase()

const props = defineProps({
  user: {
    type: Object as PropType<User | null | undefined>,
    required: true,
  },
  links: {
    type: Array as PropType<{ name: string; url: string; roles: string[] }[]>,
    required: true,
  },
})
const username = computed(() =>
  props.user?.__typename == 'Staff' ? props.user.firstName : props.user?.name,
)

const open = ref(false)

// responsiveness
const { width } = useWindowSize()
const { MOBILE_VIEWPORT_SIZE } = useA11y()
</script>

<template>
  <div>
    <OnClickOutside @trigger="open = false">
      <button
        v-if="user"
        class="gap2 mx-2 flex flex-row items-center justify-center"
        @click="open = !open"
      >
        <span
          :title="username"
          class="hidden max-w-[8rem] overflow-hidden text-ellipsis whitespace-nowrap sm:inline-block"
        >
          {{ username }}
        </span>
        <ChevronDown v-if="!open" />
        <ChevronUp v-else />
        <ProfilePicture v-if="firebaseUser?.photoURL" :size="48" />
      </button>
      <div v-if="open">
        <div
          class="top-19 z-100 absolute right-4 flex flex-col rounded-md bg-white p-4 shadow-md"
        >
          <ul>
            <li>
              <router-link
                class="styled-link w-fit"
                to="/profile"
                @click="open = false"
                >{{ $t('nav.profile') }}
              </router-link>
            </li>
            <li
              v-for="item of links"
              v-if="width < MOBILE_VIEWPORT_SIZE"
              :key="item.url"
            >
              <router-link
                :to="item.url"
                class="styled-link"
                @click="open = false"
                >{{ item.name }}
              </router-link>
            </li>
            <li>
              <StyledButton
                class="mt-2"
                @click="
                  () => {
                    $router.push('/logout')
                    open = false
                  }
                "
              >
                {{ $t('account.log.out') }}
              </StyledButton>
            </li>
          </ul>
        </div>
      </div>
    </OnClickOutside>
    <router-link
      v-if="!user"
      class="px4 bg-secondary hover:border-secondary-lighter active:border-secondary-lighter active:bg-secondary-400 focus-visible-outline-none transition-color rounded border-2 border-transparent py-2 focus:border-black focus:outline-none focus-visible:border-black"
      to="/login"
    >
      {{ $t('auth.login') }}
    </router-link>
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
