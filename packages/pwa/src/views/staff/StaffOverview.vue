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
  <RouterView />
  <div v-if="!staffAndServices || loading">...</div>
  <div v-else class="mxa custom-grid mt-8 flex max-w-7xl flex-wrap">
    <staff-data-card :data="staffAndServices.staffByUid" />
    <staff-vacation-card :data="staffAndServices.staffByUid" />
    <!--    <div v-for="service of staffAndServices.servicesByStaff" :key="service.id">-->
    <!--      <service-card :data="service"></service-card>-->
    <!--            </div>-->
    <!--    </div>-->
  </div>
</template>

<style scoped>
/**.custom-grid {
//  grid-template-columns: 3fr 1fr;
}
**/
</style>
