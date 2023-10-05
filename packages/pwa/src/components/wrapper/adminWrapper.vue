<script lang="ts">
import { RouterView } from 'vue-router'
import { Users } from 'lucide-vue-next'
import Logo from '../generic/Logo.vue'

export default {
  name: 'My Component',
  components: { Users, Logo },
}
</script>

<template>
  <div class="flex w-full">
    <div class="h-screen w-1/4 rounded-r-2xl bg-slate-200">
      <div class="m-8">
        <div class="flex gap-4">
          <Logo />
          <h1 class="text-4xl">Sportcomplex</h1>
        </div>
        <div class="grid gap-2 mt-4">
          <RouterLink to="/admin/groups" class="flex gap-4 items-center">
              <Users />
            <h2 class="text-2xl">Groepen</h2>
          </RouterLink>
        </div>
      </div>
    </div>
    <div class="w-3/4">
      <RouterView />
    </div>
  </div>
</template>
