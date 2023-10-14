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
    <div class="h-screen  rounded-r-xl bg-white">
      <div class="m-8">
        <div class="flex xl:gap-4 gap-2 items-center">
          <Logo class="2xl:h-16 xl:h-8 h-6"/>
          <h1 class="2xl:text-4xl xl:text-2xl text-xl">{{ $t('navigation.title') }}</h1>
        </div>
        <div class="mt-4 grid gap-2">
          <RouterLink class="flex items-center gap-4" to="/admin/groups">
            <Users />
            <h2 class="xl:text-2xl text-lg">{{ $t('admin.group') }}</h2>
          </RouterLink>
        </div>
      </div>
    </div>
    <div class="w-full">
      <RouterView />
    </div>
  </div>
</template>
