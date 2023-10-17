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
    <div class="w-full">
      <RouterView />
    </div>
  </div>
</template>
