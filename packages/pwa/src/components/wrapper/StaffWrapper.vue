<script lang="ts">
import { defineComponent } from 'vue'
import Sidenav from '@/components/wrapper/Sidenav.vue'

export default defineComponent({
  name: 'StaffWrapper',
  components: { Sidenav },
})
</script>

<template>
  <div class="flex h-full w-full">
    <div class="w-full">
      <RouterView />
    </div>
  </div>
</template>

<style scoped></style>
