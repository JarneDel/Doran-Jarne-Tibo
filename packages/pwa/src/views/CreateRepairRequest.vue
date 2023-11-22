<script lang="ts">
import { defineComponent } from 'vue'
import { ref } from 'vue'
import { RepairRequest } from '@/interface/repairRequestInterface'

export default defineComponent({
  setup() {
    const repair = ref<RepairRequest>({
      firstname: '',
      lastname: '',
      email: '',
    })
    return {
      repair,
    }
  },
})
</script>

<template>
  <div class="flex h-full items-center justify-center">
    <div class="rounded-md bg-white p-4 shadow-md">
      <styled-input-text v-model="" :label="$t('staff.firstname')" />
    </div>
  </div>
</template>

<style scoped></style>
