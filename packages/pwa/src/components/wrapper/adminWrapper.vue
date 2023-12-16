<script lang="ts">
import Sidenav from '@/components/layout/Sidenav.vue'
import Notifications from '@/components/Notifications.vue'

export default {
  name: 'My Component',
  components: { Sidenav, Notifications },
}
</script>

<template>
  <div class="flex h-full w-full">
    <Sidenav />
    <div class="relative mx-2 w-full sm:mx-8">
      <RouterView />
      <Notifications />
    </div>
  </div>
</template>
