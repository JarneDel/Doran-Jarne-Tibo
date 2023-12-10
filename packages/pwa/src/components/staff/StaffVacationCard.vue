<script lang="ts">
import { defineComponent, PropType, ref, watch } from 'vue'
import StyledButton from '@/components/generic/StyledButton.vue'
import { useQuery } from '@vue/apollo-composable'
import { GET_VACATION_REQUESTS } from '@/graphql/vacation.request.query.ts'
import VacationRow from '@/components/staff/VacationRow.vue'
import { Badge, BadgeCheck } from 'lucide-vue-next'
import FilterOptions from '@/components/generic/FilterOptions.vue'
import { StaffMember } from '@/interface/staff.interface.ts'
import useLastRoute from '@/composables/useLastRoute.ts'

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
    const { result, refetch } = useQuery(GET_VACATION_REQUESTS)
    const filter = ref<string>('open')

    const { lastRoute } = useLastRoute()
    watch(lastRoute, () => {
      if (lastRoute.value == '/staff/request-vacation') {
        refetch()
      }
    })

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
  <div
    class="relative h-min w-full overflow-hidden rounded-xl bg-white p-4 shadow-md dark:bg-gray-800"
  >
    <h2 class="text-2xl font-medium">Vacations</h2>
    <styled-button
      button-type="secondary"
      class="absolute right-2 top-6"
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
          class="py.5 p1 rounded bg-gray-100 shadow-md"
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
