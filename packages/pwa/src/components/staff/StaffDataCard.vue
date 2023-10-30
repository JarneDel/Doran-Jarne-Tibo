<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { StaffMember } from '@/graphql/staff.query.ts'

export default defineComponent({
  name: 'StaffDataCard',
  props: {
    data: {
      type: Object as PropType<StaffMember>,
      required: true,
    },
  },
})
</script>

<template>
  <div class="b-1 p2 border-black">
    <h2 class="font-medium">{{ $t('staff.profile') }}</h2>
    <div>{{data.}}</div>
  </div>
</template>

<style scoped></style>
