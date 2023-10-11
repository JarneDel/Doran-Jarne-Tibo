<script lang="ts">
import { Users } from 'lucide-vue-next'
import Logo from '../generic/Logo.vue'

export default {
  name: 'My Component',
  components: { Users, Logo },
}
</script>

<template>
  <div class="bg-primary-surface flex w-full">
    <div class="h-screen w-1/4 rounded-r-xl bg-white">
      <div class="m-8">
        <div class="flex gap-4">
          <Logo />
          <h1 class="text-4xl">{{ $t('navigation.title') }}</h1>
        </div>
        <div class="mt-4 grid gap-2">
          <RouterLink class="flex items-center gap-4" to="/admin/groups">
            <Users />
            <h2 class="text-2xl">{{ $t('admin.group') }}</h2>
          </RouterLink>
        </div>
      </div>
    </div>
    <div class="w-3/4">
      <RouterView />
    </div>
  </div>
</template>
