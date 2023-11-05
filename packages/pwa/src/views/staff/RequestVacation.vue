<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue'
import { useMutation, useQuery } from '@vue/apollo-composable'
import {
  CREATE_VACATION_REQUEST,
  CreateVacationRequest,
  CreateVacationRequestInput,
  GET_VACATION_REQUESTS,
  VacationRequestQuery,
} from '@/graphql/vacation.request.query.ts'
import StyledButton from '@/components/generic/StyledButton.vue'
import { STAFF, Staff } from '@/graphql/staff.query.ts'
import useVacation from '@/composables/useVacation.ts'
import Modal from '@/components/Modal.vue'
import StyledInputText from '@/components/generic/StyledInputText.vue'
import OptionsModal from '@/components/modal/OptionsModal.vue'
import { useDates } from '@/composables/useDates.ts'
import ExpandPendingRequests from '@/components/staff/ExpandPendingRequests.vue'

export default defineComponent({
  name: 'RequestVacation',
  components: {
    ExpandPendingRequests,
    OptionsModal,
    StyledInputText,
    Modal,
    StyledButton,
  },

  setup() {
    // composables
    const { getDates } = useDates()
    const {
      getConnectedVacationDays,
      parseVacationDays,
      validateCreateVacationRequestInput,
      getRequestedDates,
      parseOpenRequests,
    } = useVacation()

    // input
    const inputStartDate = ref<string>('')
    const inputEndDate = ref<string>('')

    // errors
    const errorMessages = ref<string[]>([])

    // amount of vacation days left after calculations
    const vacationDaysLeft = ref<number>(0)
    // amount of vacation days left in database
    const originalVacationDaysLeft = ref<number>(0)

    const connectedVacations = ref<string[][]>([])

    /**
     *    set after form is submitted && request is successful
     */
    const isSaved = ref<boolean>(false)

    /**
     * state of submit button
     */
    const submitDisabled = computed(() => {
      if (!inputStartDate.value || !inputEndDate.value) return true
      const validationResult = validate(
        inputStartDate.value,
        inputEndDate.value,
      )
      return !validationResult
    })

    // create vacation request mutation
    const { mutate, error, loading } = useMutation<
      CreateVacationRequest,
      CreateVacationRequestInput
    >(CREATE_VACATION_REQUEST)

    // your user query
    const {
      result: staff,
      loading: loadingStaff,
      refetch: reFetchStaff,
      onResult,
    } = useQuery<Staff>(
      STAFF,
      {},
      {
        fetchPolicy: 'cache-and-network',
      },
    )

    // your vacation requests query
    const { result: requests } = useQuery<VacationRequestQuery>(
      GET_VACATION_REQUESTS,
      {},
      {
        fetchPolicy: 'cache-and-network',
      },
    )

    //
    const openRequests = computed(() => {
      if (!requests.value) return
      return parseOpenRequests(requests.value.vacationRequestLoggedIn)
    })

    // returns ALL vacation dates, not in ranges
    const rawOpenRequests = computed(() => {
      if (!requests.value) return
      return getRequestedDates(requests.value.vacationRequestLoggedIn)
    })

    function validate(startDate: string, endDate: string) {
      errorMessages.value = []

      if (!staff.value || !rawOpenRequests.value) return false
      const validationResult = validateCreateVacationRequestInput(
        new Date(startDate),
        new Date(endDate),
        staff.value.staffByUid.holidayDates,
        rawOpenRequests.value,
        originalVacationDaysLeft.value,
      )

      if (validationResult === true) return true
      errorMessages.value = [validationResult]
      return false
    }

    function submitRequest(startDate: string, endDate: string) {
      const startDateAsDate = new Date(startDate)
      const endDateAsDate = new Date(endDate)
      const res = validate(startDate, endDate)
      if (res) {
        return mutate({
          input: {
            startDate: startDateAsDate,
            endDate: endDateAsDate,
          },
        })
      }

      return Promise.reject('validation failed')
    }

    function calculateVacationDays() {
      const startDateAsDate = new Date(inputStartDate.value)
      const endDateAsDate = new Date(inputEndDate.value)
      const days = getDates(startDateAsDate, endDateAsDate)
      vacationDaysLeft.value = originalVacationDaysLeft.value - days
    }

    function submit() {
      console.log('submitting')
      submitRequest(inputStartDate.value, inputEndDate.value).then(() => {
        isSaved.value = true
      })
    }

    onResult(result => {
      if (result.data) {
        vacationDaysLeft.value = result.data.staffByUid.holidaysLeft
        originalVacationDaysLeft.value = result.data.staffByUid.holidaysLeft
        const connectedVacationsDate = getConnectedVacationDays(
          result.data.staffByUid.holidayDates,
        )
        connectedVacations.value = parseVacationDays(connectedVacationsDate)
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

    watch(inputStartDate, () => {
      if (!inputStartDate.value || !inputEndDate.value) return
      calculateVacationDays()
    })
    watch(inputEndDate, () => {
      if (!inputStartDate.value || !inputEndDate.value) return
      calculateVacationDays()
    })

    return {
      connectedVacations,
      disabled: submitDisabled,
      endDate: inputEndDate,
      error,
      errorMessages,
      isSaved,
      loading,
      loadingStaff,
      mutate,
      openRequests,
      originalVacationDaysLeft,
      reFetchStaff,
      staff,
      startDate: inputStartDate,
      submit,
      vacationDaysLeft,
      rawOpenRequests,
      openRequestDayCount: computed(() => {
        return rawOpenRequests.value?.length
      }),
    }
  },
})
</script>

<template>
  <OptionsModal
    v-if="isSaved"
    :button2="{ text: 'ok', type: 'secondary' }"
    :show-modal="isSaved"
    title="Your vacation has been requested"
    @button2-click="$router.push('/staff')"
  >
  </OptionsModal>

  <Modal v-if="!isSaved" min-width="min-w-md" @close="$router.push('/staff')">
    <template v-slot:title>
      <h2 class="text-xl font-bold">Request Vacation</h2>
    </template>
    <template v-slot:default>
      <div v-for="error of errorMessages" class="test-danger">
        {{ error }}
      </div>

      <h3 class="text-lg font-medium">Your current vacations</h3>

      <div>
        <p v-if="vacationDaysLeft === originalVacationDaysLeft">
          You have {{ vacationDaysLeft }} vacation days left
        </p>
        <p v-else>
          You can plan {{ vacationDaysLeft }} more vacation days. You had
          {{ originalVacationDaysLeft }} before.
        </p>
      </div>

      <ExpandPendingRequests
        :title="openRequests.length + ' pending vacation requests'"
        :data="openRequests"
        v-if="openRequests"
      />
      <div
        v-if="openRequestDayCount && vacationDaysLeft"
        class="mb-2 text-sm text-neutral-800"
      >
        If all your requests are approved, you will have
        {{ originalVacationDaysLeft - openRequestDayCount }} days left
      </div>

      <expand-pending-requests
        :title="connectedVacations.length + ' upcoming vacations'"
        :data="
          connectedVacations.map(dates => {
            if (dates.length > 1) {
              return {
                startDate: dates[0],
                endDate: dates[dates.length - 1],
                dayCount: dates.length,
              }
            }
            return {
              startDate: dates[0],
              endDate: dates[0],
              dayCount: 1,
            }
          })
        "
      ></expand-pending-requests>

      <h3 class="mb-1 mt-4 text-lg font-medium">Plan a new vacation</h3>

      <form @submit.prevent="submit">
        <StyledInputText
          id="startDate"
          v-model="startDate"
          :label="'startDate'"
          class="my-2"
          type="date"
        />

        <StyledInputText
          id="endDate"
          v-model="endDate"
          :label="'End date'"
          class="my-2"
          type="date"
        />

        <div class="mt-4 flex justify-end gap-4">
          <styled-button :disabled="disabled" type="submit"
            >Request Vacation
          </styled-button>
        </div>
      </form>
    </template>
  </Modal>
</template>

<style scoped></style>
