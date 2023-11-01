<script lang="ts">
import { defineComponent } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import { STAFF_BY_UID, StaffMemberQuery } from '@/graphql/staff.query.ts'
import StaffDataCard from '@/components/staff/StaffDataCard.vue'

export default defineComponent({
  name: 'StaffOverview',
  components: { StaffDataCard },
  setup: () => {
    const {
      result: user,
      loading,
      error,
    } = useQuery<StaffMemberQuery>(STAFF_BY_UID)
    return {
      user,
      loading,
      error,
    }
  },
})
</script>

<template>
  <div v-if="!user || loading">...</div>
  <div v-else class="mxa max-w-5xl">
    <h2>Welcome, {{ user.staffByUid.firstName }}</h2>
    <div class="mt-lg custom-grid grid items-center justify-center">
      <staff-data-card :data="user.staffByUid"></staff-data-card>
    </div>
  </div>
</template>

<style scoped></style>
