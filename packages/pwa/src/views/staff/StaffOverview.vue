<script lang="ts">
import { defineComponent } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import { STAFF_BY_UID, StaffMemberQuery } from '@/graphql/staff.query.ts'

export default defineComponent({
  name: 'StaffOverview',
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
  <div v-else>
    <h2>Welcome, {{ user.staffByUid.firstName }}</h2>
  </div>
</template>

<style scoped></style>
