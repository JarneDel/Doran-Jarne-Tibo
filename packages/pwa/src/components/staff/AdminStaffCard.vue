<script lang="ts" setup>
import { PropType } from 'vue'
import { StaffBasics } from '@/interface/staff.interface.ts'

defineProps({
  data: {
    type: Object as PropType<StaffBasics>,
    required: true,
  },
})
</script>

<template>
  <router-link
    :to="'/admin/staff/' + data.id"
    class="py.5 p1 rounded bg-gray-100 shadow-md transition-all duration-300 ease-in-out hover:bg-gray-200 hover:shadow-xl"
  >
    <div class="min-w-xs p1">
      <div class="flex flex-col justify-between">
        <div class="gap4 flex flex-row justify-between">
          <div>
            <div>{{ data.firstName }} {{ data.lastName }}</div>
            <div class="font-300 text-sm">{{ data.email }}</div>
          </div>
          <div class="py2 pr2 flex h-full flex-row justify-center gap-2">
            {{ data.role }}
          </div>
        </div>
      </div>
    </div>
  </router-link>
</template>

<style scoped></style>
