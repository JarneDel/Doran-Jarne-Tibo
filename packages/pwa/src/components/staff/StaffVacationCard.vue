<script lang="ts">
import { defineComponent, PropType } from 'vue'
import StyledButton from '@/components/generic/StyledButton.vue'
import { StaffMember } from '@/graphql/staff.query.ts'
import { useQuery } from '@vue/apollo-composable'
import {
  GET_VACATION_REQUESTS,
  VacationRequestQuery,
} from '@/graphql/vacation.request.query.ts'
import VacationRow from '@/components/staff/VacationRow.vue'
import { Badge, BadgeCheck } from 'lucide-vue-next'

export default defineComponent({
  name: 'StaffVacationCard',
  components: { VacationRow, StyledButton, BadgeCheck, Badge },
  props: {
    data: {
      type: Object as PropType<StaffMember>,
      required: true,
    },
  },
  data() {
    return {
      filter: 'notApproved',
    }
  },
  setup() {
    const { result } = useQuery<VacationRequestQuery>(GET_VACATION_REQUESTS)

    return { result }
  },
  computed: {
    resultFiltered() {
      if (!this.result) return
      if (this.filter === 'notApproved') {
        return this.result.vacationRequestLoggedIn.filter(
          request => !request.isApproved,
        )
      }
      if (this.filter === 'approved') {
        return this.result.vacationRequestLoggedIn.filter(
          request => request.isApproved,
        )
      }
      return []
    },
    approvedCount() {
      const list = this.result?.vacationRequestLoggedIn.filter(
        request => request.isApproved,
      )
      return list?.length
    },
  },
})
</script>

<template>
  <div class="m2 relative">
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
      <div class="my-2 flex flex-row gap-4">
        <button
          :class="{
            'text-gray': filter !== 'notApproved',
          }"
          class="flex flex-row items-center"
          @click="filter = 'notApproved'"
        >
          <Badge class="mr-2"></Badge>
          <span>
            {{ result.vacationRequestLoggedIn.length - (approvedCount ?? 0) }}
            pending / denied
          </span>
        </button>
        <button
          :class="{
            'text-gray': filter !== 'approved',
          }"
          class="flex flex-row items-center"
          @click="filter = 'approved'"
        >
          <BadgeCheck class="mr2" />
          <span> {{ approvedCount }} approved </span>
        </button>
      </div>
      <div v-for="request of resultFiltered" class="py.5">
        <VacationRow :data="request"></VacationRow>
      </div>
    </div>

    <!--    Todo: add request in review and approved requests-->
    <!-- Todo: show upcoming vacations-->
  </div>
</template>

<style scoped></style>
