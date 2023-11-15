<script lang="ts">
import { defineComponent, PropType, ref } from 'vue'
import StyledButton from '@/components/generic/StyledButton.vue'
import { StaffMember } from '@/graphql/staff.query.ts'
import { useQuery } from '@vue/apollo-composable'
import {
  GET_VACATION_REQUESTS,
  VacationRequestQuery,
} from '@/graphql/vacation.request.query.ts'
import VacationRow from '@/components/staff/VacationRow.vue'
import { Badge, BadgeCheck } from 'lucide-vue-next'
import FilterOptions from '@/components/generic/FilterOptions.vue'

export default defineComponent({
  name: 'StaffVacationCard',
  components: { FilterOptions, VacationRow, StyledButton, BadgeCheck, Badge },
  props: {
    data: {
      type: Object as PropType<StaffMember>,
      required: true,
    },
  },
  setup() {
    const { result } = useQuery<VacationRequestQuery>(GET_VACATION_REQUESTS)
    const filter = ref<string>('open')
    return { result, filter }
  },
  computed: {
    resultFiltered() {
      if (!this.result) return
      if (this.filter === 'open') {
        return this.result.vacationRequestLoggedIn.filter(
          request => !request.isApproved && !request.isRejected,
        )
      }
      if (this.filter === 'closed') {
        return this.result.vacationRequestLoggedIn.filter(
          request => request.isApproved || request.isRejected,
        )
      }
      if (this.filter === 'expired') {
        return this.result.vacationRequestLoggedIn.filter(
          request => request.startDate < new Date() && !request.isApproved,
        )
      }
      return []
    },
    openCount() {
      if (!this.result) return 0
      return this.result.vacationRequestLoggedIn.filter(
        request => !request.isApproved && !request.isRejected,
      ).length
    },
    closedCount() {
      if (!this.result) return 0
      return this.result.vacationRequestLoggedIn.filter(
        request => request.isApproved || request.isRejected,
      ).length
    },
    expiredCount() {
      if (!this.result) return 0
      return this.result.vacationRequestLoggedIn.filter(
        request => request.startDate < new Date() && !request.isApproved,
      ).length
    },
  },
})
</script>

<template>
  <div class="m2 relative w-full">
    <h2 class="text-2xl font-medium">Vacations</h2>
    <styled-button
      button-type="secondary"
      class="absolute right-2 top-2"
      type="button"
      @click="$router.push('/staff/request-vacation')"
      >{{ $t('staff.requestVacation') }}
    </styled-button>
    <div>
      {{
        $t('staff.vacationLeft', {
          daysLeft: data.holidaysLeft,
          total: data.holidaysTotal,
        })
      }}
    </div>

    <div v-if="result?.vacationRequestLoggedIn" class="p2 mt-4 rounded">
      <FilterOptions
        v-model="filter"
        :item-count="[openCount, closedCount, expiredCount]"
        :options="['open', 'closed', 'expired']"
        class="mb-4"
      />

      <div class="gap4 flex flex-row flex-row flex-wrap">
        <div
          v-for="request of resultFiltered"
          class="py.5 p1 rounded bg-white shadow-md"
        >
          <VacationRow :data="request"></VacationRow>
        </div>
      </div>
    </div>

    <!--    Todo: add request in review and approved requests-->
    <!-- Todo: show upcoming vacations-->
  </div>
</template>

<style scoped></style>
