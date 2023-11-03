<script lang="ts">
import { defineComponent, PropType } from 'vue'
import StyledButton from '@/components/generic/StyledButton.vue'
import { StaffMember } from '@/graphql/staff.query.ts'

export default defineComponent({
  name: 'StaffVacationCard',
  components: { StyledButton },
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
    <div>
      {{
        $t('staff.vacationLeft', {
          daysLeft: data.holidaysLeft,
          total: data.holidaysTotal,
        })
      }}
    </div>
    <!--    Todo: add request in review and approved requests-->
    <!-- Todo: show upcoming vacations-->
    <styled-button
      button-type="secondary"
      type="button"
      @click="$router.push('/staff/request-vacation')"
      >{{ $t('staff.requestVacation') }}
    </styled-button>
  </div>
</template>

<style scoped></style>
