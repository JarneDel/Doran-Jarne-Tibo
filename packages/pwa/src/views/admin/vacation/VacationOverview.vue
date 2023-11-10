<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useMutation, useQuery } from '@vue/apollo-composable'
import {
  APPROVE_VACATION_REQUEST,
  ApproveVacationRequestInput,
  ApproveVacationRequestResult,
  GET_VACATION_REQUESTS_ADMIN_ALL,
  VacationRequestQueryAdminAll,
  VacationRequestWithStaff,
} from '@/graphql/vacation.request.query.ts'
import StyledButton from '@/components/generic/StyledButton.vue'
import { Badge, BadgeAlert, BadgeCheck } from 'lucide-vue-next'
import Modal from '@/components/Modal.vue'
import StyledInputText from '@/components/generic/StyledInputText.vue'

export default defineComponent({
  name: 'VacationOverview',
  components: {
    StyledInputText,
    Modal,
    StyledButton,
    Badge,
    BadgeCheck,
    BadgeAlert,
  },
  setup() {
    const { result } = useQuery<VacationRequestQueryAdminAll>(
      GET_VACATION_REQUESTS_ADMIN_ALL,
    )

    const { mutate } = useMutation<
      ApproveVacationRequestResult,
      ApproveVacationRequestInput
    >(APPROVE_VACATION_REQUEST)

    const rejectVacation = async () => {
      if (reject.value) {
        await mutate({
          approveVacationRequestInput: {
            id: reject.value.id,
            rejectReason: rejectMessage.value,
            isRejected: true,
            isApproved: false,
          },
        })
        reject.value = undefined
        rejectMessage.value = ''
      }
    }

    const reject = ref<VacationRequestWithStaff>()
    const rejectMessage = ref<string>('')
    return { result, reject, rejectMessage, rejectVacation }
  },
})
</script>

<template>
  <Modal v-if="reject" @close="reject = undefined">
    <template v-slot:title>
      <h2 class="font-medium">
        Reject vacation request from {{ reject.staff.firstName }}
        {{ reject.staff.lastName }}
      </h2>
    </template>
    <template v-slot:default>
      <StyledInputText v-model="rejectMessage" label="Reject message" />
    </template>
    <template v-slot:actions>
      <StyledButton button-type="danger" @click="rejectVacation">
        Reject
      </StyledButton>
      <StyledButton button-type="gray" @click="reject = undefined"
        >Cancel</StyledButton
      >
    </template>
  </Modal>
  <div class="container mx-auto px-4 py-6">
    <div class="overflow-x-auto">
      <div class="w-full overflow-auto">
        <table v-if="result?.vacationRequests" class="w-full text-sm">
          <thead>
            <tr class="border-b transition-colors">
              <th class="h-12 px-4 text-left align-middle font-medium">
                Status
              </th>
              <th class="h12 px4 text-left align-middle font-medium">For</th>

              <th class="h-12 px-4 text-left align-middle font-medium">
                Reject Reason
              </th>
              <th class="h-12 px-4 text-left align-middle font-medium">
                Start Date
              </th>
              <th class="h-12 px-4 text-left align-middle font-medium">
                End Date
              </th>
              <th class="h-12 px-4 text-left align-middle font-medium">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(vacationRequest, index) in result?.vacationRequests"
              class="hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors"
            >
              <td class="p-4 align-middle">
                <BadgeCheck v-if="vacationRequest.isApproved" />
                <BadgeAlert v-else-if="vacationRequest.isRejected" />
                <Badge v-else></Badge>
              </td>
              <td class="p4 align-middle">
                {{ vacationRequest.staff.firstName }}
                {{ vacationRequest.staff.lastName }}
              </td>

              <td class="p-4 align-middle">
                {{ vacationRequest.rejectReason }}
              </td>
              <td class="p-4 align-middle">
                {{ vacationRequest.startDate.toLocaleDateString() }}
              </td>
              <td class="p-4 align-middle">
                {{ vacationRequest.endDate.toLocaleDateString() }}
              </td>
              <td class="p-4 align-middle">
                <div
                  v-if="
                    !vacationRequest.isRejected && !vacationRequest.isApproved
                  "
                  class="flex space-x-2"
                >
                  <StyledButton button-type="secondary"> Approve </StyledButton>
                  <StyledButton
                    button-type="danger"
                    @click="reject = vacationRequest"
                  >
                    Reject
                  </StyledButton>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
