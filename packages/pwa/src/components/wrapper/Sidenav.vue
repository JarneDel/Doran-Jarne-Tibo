<script lang="ts">
import { defineComponent } from 'vue'
import Logo from '@/components/generic/Logo.vue'
import { Box, PanelLeftClose, PanelRightClose, Users } from 'lucide-vue-next'
import { useLocalStorage } from '@vueuse/core'

export default defineComponent({
  name: 'Sidenav',
  components: { Logo, Users, Box, PanelLeftClose, PanelRightClose },
  setup() {
    const isClosed = useLocalStorage('isClosed', false)
    return { isClosed }
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
    <div
      :class="{
        'mx-8': !isClosed,
        'mx-4': isClosed,
      }"
      class="mt-4"
    >
      <router-link class="flex items-center gap-4" to="/">
        <Logo class="h-8 w-8" />
        <h1 v-if="!isClosed" class="text-2xl">{{ $t('navigation.title') }}</h1>
      </router-link>
      <div class="mt-4 grid gap-4">
        <button @click="isClosed = !isClosed">
          <panel-left-close v-if="!isClosed" />
          <panel-right-close v-else />
        </button>

        <RouterLink class="flex items-center gap-4" to="/admin/groups">
          <Users />
          <h2 v-if="!isClosed" class="font-500 text-lg">
            {{ $t('nav.groups') }}
          </h2>
        </RouterLink>
        <RouterLink class="flex items-center gap-4" to="/admin/inventory">
          <Box />
          <h2 v-if="!isClosed" class="font-500 text-lg">
            {{ $t('nav.inventory') }}
          </h2>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
