<script lang="ts">
import Sidenav from '@/components/wrapper/Sidenav.vue'

export default {
  name: 'My Component',
  components: { Sidenav },
}
</script>

<template>
  <div class="bg-primary-surface flex w-full">
    <Sidenav />
    <div class="w-3/4">
      <RouterView />
    </div>
  </div>
</template>
