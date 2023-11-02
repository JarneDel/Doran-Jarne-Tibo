<script lang="ts">
import { defineComponent } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import {
  STAFF_AND_SERVICES_BY_UID,
  StaffMemberQuery,
} from '@/graphql/staff.query.ts'
import StaffDataCard from '@/components/staff/StaffDataCard.vue'
import StaffVacationCard from '@/components/staff/StaffVacationCard.vue'
import ServiceCard from '@/components/staff/ServiceCard.vue'

export default defineComponent({
  name: 'StaffOverview',
  components: { ServiceCard, StaffVacationCard, StaffDataCard },
  setup: () => {
    const {
      result: staffAndServices,
      loading,
      error,
    } = useQuery<StaffMemberQuery>(STAFF_AND_SERVICES_BY_UID)
    return {
      staffAndServices,
      loading,
      error,
    }
  },
})
</script>

<template>
  <div v-if="!staffAndServices || loading">...</div>
  <div v-else class="mxa max-w-5xl">
    <h2>Welcome, {{ staffAndServices.staffByUid.firstName }}</h2>
    <div class="mt-lg custom-grid grid items-center justify-center">
      <staff-data-card :data="staffAndServices.staffByUid"></staff-data-card>
      <staff-vacation-card
        :data="staffAndServices.staffByUid"
      ></staff-vacation-card>
      <div
        v-for="service of staffAndServices.servicesByStaff"
        :key="service.id"
      >
        <service-card :data="service"></service-card>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
