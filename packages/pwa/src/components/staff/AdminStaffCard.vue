<script lang="ts" setup>
import { PropType } from 'vue'
import { StaffBasics } from '@/interface/staff.interface.ts'
import Card from '@/components/layout/Card.vue'

defineProps({
  data: {
    type: Object as PropType<StaffBasics>,
    required: true,
  },
})
</script>

<template>
  <Card hoverable>
    <router-link :to="'/admin/staff/' + data.id">
      <div class="min-w-xs p1 gap4 flex flex-col justify-between">
        <div class="flex flex-row justify-between">
          <div>
            <div>{{ data.firstName }} {{ data.lastName }}</div>
            <div class="font-300 text-sm">{{ data.email }}</div>
          </div>
          <div class="py2 pr2 flex h-full justify-center gap-2">
            {{ data.role }}
          </div>
        </div>
      </div>
    </router-link>
  </Card>
</template>

<style scoped></style>
