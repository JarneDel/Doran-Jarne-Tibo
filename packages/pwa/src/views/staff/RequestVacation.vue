<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue'
import { useMutation, useQuery } from '@vue/apollo-composable'
import {
  CREATE_VACATION_REQUEST,
  CreateVacationRequest,
  CreateVacationRequestInput,
} from '@/graphql/vacation.request.query.ts'
import StyledButton from '@/components/generic/StyledButton.vue'
import { STAFF, Staff } from '@/graphql/staff.query.ts'
import useVacation from '@/composables/useVacation.ts'

export default defineComponent({
  name: 'RequestVacation',
  components: { StyledButton },

  setup() {
    const connectedVacations = ref<Date[][]>([])
    const startDate = ref<string>('')
    const endDate = ref<string>('')
    const errorMessages = ref<string[]>([])
    const vacationDaysLeft = ref<number>(0)
    const originalVacationDaysLeft = ref<number>(0)

    const disabled = computed(() => {
      return !startDate.value || !endDate.value
    })

    const { mutate, error } = useMutation<
      CreateVacationRequest,
      CreateVacationRequestInput
    >(CREATE_VACATION_REQUEST)
    const {
      result: staff,
      loading: loadingStaff,
      refetch: reFetchStaff,
      onResult,
    } = useQuery<Staff>(STAFF)

    const { getConnectedVacationDays } = useVacation()

    function createRequest(startDate: string, endDate: string) {
      const startDateAsDate = new Date(startDate)
      const endDateAsDate = new Date(endDate)
      mutate({
        input: {
          startDate: startDateAsDate,
          endDate: endDateAsDate,
        },
      })
    }

    function calculateVacationDays() {
      const startDateAsDate = new Date(startDate.value)
      const endDateAsDate = new Date(endDate.value)
      const days =
        (endDateAsDate.getTime() - startDateAsDate.getTime()) /
        (1000 * 3600 * 24)
      vacationDaysLeft.value = originalVacationDaysLeft.value - days
    }

    function submit() {
      console.log('submitting')
      createRequest(startDate.value, endDate.value)
    }

    onResult(result => {
      if (result.data) {
        vacationDaysLeft.value = result.data.staffByUid.holidaysLeft
        originalVacationDaysLeft.value = result.data.staffByUid.holidaysLeft
        getConnectedVacationDays(result.data.staffByUid.holidayDates)
      }
    })

    watch(error, () => {
      if (!error) return ''
      const err = error.value as any
      errorMessages.value = []
      if (err.message === 'Bad Request Exception') {
        try {
          const original = err.graphQLErrors[0].extensions.originalError as any
          if (!original || !original.message) return console.log('no message')
          const originalError = original.message as string[]
          originalError.forEach((message: string) => {
            errorMessages.value.push(message)
          })
        } catch (e) {
          errorMessages.value.push('Unknown error')
        }
      } else {
        errorMessages.value.push(err.message || 'Unknown error')
      }
    })

    watch(startDate, () => {
      if (!startDate.value || !endDate.value) return
      calculateVacationDays()
    })
    watch(endDate, () => {
      if (!startDate.value || !endDate.value) return
      calculateVacationDays()
    })

    return {
      connectedVacations,
      vacationDaysLeft,
      originalVacationDaysLeft,
      error,
      mutate,
      staff,
      loadingStaff,
      disabled,
      errorMessages,
      startDate,
      endDate,
      reFetchStaff,
      submit,
    }
  },
})
</script>

<template>
  <div>
    <h2>Request Vacation</h2>
    <div v-for="error of errorMessages" class="test-danger">
      {{ error }}
    </div>

    <div>
      <p v-if="vacationDaysLeft === originalVacationDaysLeft">
        You have {{ vacationDaysLeft }} vacation days left
      </p>
      <p v-else>
        You can plan {{ vacationDaysLeft }} more vacation days. You had
        {{ originalVacationDaysLeft }} before.
      </p>
    </div>

    <div>
      <div v-for="dates of connectedVacations">
        <div v-if="dates.length > 1">
          {{ dates[0] }} - {{ dates[dates.length - 1] }}
        </div>
        <div v-else>
          {{ dates[0] }}
        </div>
      </div>
    </div>

    <form @submit.prevent="submit">
      <label for="startDate">Start Date</label>
      <input
        id="startDate"
        v-model="startDate"
        class="form-control"
        type="date"
      />

      <label for="endDate">End Date</label>
      <input id="endDate" v-model="endDate" class="form-control" type="date" />

      <styled-button :disabled="disabled" type="submit"
        >Request Vacation
      </styled-button>
    </form>
  </div>
</template>

<style scoped></style>
