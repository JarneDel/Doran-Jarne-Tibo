<script lang="ts">
import Sidenav from '@/components/wrapper/Sidenav.vue'

export default {
  name: 'My Component',
  components: { Sidenav },
}
</script>

<template>
  <div class="flex w-full h-full ">
    <Sidenav />
    <div class="w-full">
      <RouterView />
    </div>
  </div>
</template>
