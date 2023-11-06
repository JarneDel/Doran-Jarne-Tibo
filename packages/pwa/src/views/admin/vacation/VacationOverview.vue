<script lang="ts">
import { defineComponent } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import {
  GET_VACATION_REQUESTS_ADMIN_ALL,
  VacationRequestQueryAdminAll,
} from '@/graphql/vacation.request.query.ts'

export default defineComponent({
  name: 'VacationOverview',
  setup() {
    const { result } = useQuery<VacationRequestQueryAdminAll>(
      GET_VACATION_REQUESTS_ADMIN_ALL,
    )

    return { result }
  },
})
</script>

<template>
  <div v-if="result?.vacationRequests">
    <div v-for="vr of result.vacationRequests">
      {{ vr }}
    </div>
  </div>
</template>

<style scoped></style>
