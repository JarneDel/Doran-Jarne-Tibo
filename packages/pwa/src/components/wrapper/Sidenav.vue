<script lang="ts">
import { computed, defineComponent } from 'vue'
import Logo from '@/components/generic/Logo.vue'
import { Box, PanelLeftClose, PanelRightClose, Users } from 'lucide-vue-next'
import { useLocalStorage } from '@vueuse/core'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'Sidenav',
  components: { Logo, Users, Box, PanelLeftClose, PanelRightClose },
  setup() {
    const isClosed = useLocalStorage('isClosed', false)
    const { currentRoute } = useRouter()
    const { t } = useI18n()
    const section = computed(() => currentRoute.value.path.split('/')[2])
    const pages = computed(() => {
      return [
        {
          name: 'groups',
          icon: Users,
          content: t('nav.groups'),
          route: '/admin/groups',
        },
        {
          name: 'inventory',
          icon: Box,
          content: t('nav.inventory'),
          route: '/admin/inventory',
        },
      ]
    })

    return { isClosed, section, pages }
  },
})
</script>

<template>
  <div
    :class="{
      'w-1/6': !isClosed,
      'w-16': isClosed,
    }"
    class="h-screen rounded-r-xl bg-white transition-all duration-200"
  >
    <div class="mt-4">
      <router-link
        class="flex items-center gap-4"
        to="/"
        :class="{
          'mx-8': !isClosed,
          'mx-4': isClosed,
        }"
      >
        <Logo class="h-8 w-8" />
        <h1 v-if="!isClosed" class="text-2xl">{{ $t('navigation.title') }}</h1>
      </router-link>
      <div class="mt-4 grid">
        <button
          @click="isClosed = !isClosed"
          :class="{
            'mx-8': !isClosed,
            'mx-4': isClosed,
          }"
          class="flex items-center gap-4 py-2"
        >
          <panel-left-close v-if="!isClosed" />
          <panel-right-close v-else />
        </button>

        <RouterLink
          v-for="page of pages"
          :key="page.name"
          :to="page.route"
          :class="{
            'px-8': !isClosed,
            'px-4': isClosed,
            'bg-primary-light/40': section === page.name,
            'rounded-r-md': section === page.name,
          }"
          class="flex items-center gap-4 py-2"
        >
          <component :is="page.icon" />
          <h2 v-if="!isClosed" class="font-500 text-lg">{{ page.content }}</h2>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
