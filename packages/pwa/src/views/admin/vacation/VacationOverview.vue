<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue'
import { useMutation, useQuery, useSubscription } from '@vue/apollo-composable'
import {
  APPROVE_VACATION_REQUEST,
  GET_VACATION_REQUESTS_ADMIN_ALL,
  VACATION_REQUESTED_SUBSCRIPTION,
} from '@/graphql/vacation.request.query.ts'
import StyledButton from '@/components/generic/StyledButton.vue'
import {
  AlarmCheck,
  AlarmCheckIcon,
  Badge,
  BadgeAlert,
  BadgeCheck,
  Check,
  CheckIcon,
  CircleDot,
  Grid2x2,
  Grid2x2Icon,
} from 'lucide-vue-next'
import Modal from '@/components/modal/Modal.vue'
import StyledInputText from '@/components/generic/StyledInputText.vue'
import OptionsModal from '@/components/modal/OptionsModal.vue'
import FilterOptions from '@/components/generic/FilterOptions.vue'
import { useRouter } from 'vue-router'
import Error from '@/components/Error.vue'
import { VacationRequestWithStaff } from '@/interface/vacation-request.interface.ts'
import ServicesSelect from '@/components/input/ServicesSelect.vue'
import useA11y from '@/composables/useA11y.ts'
import { useWindowSize } from '@vueuse/core'
import CardContainer from '@/components/layout/CardContainer.vue'
import Card from '@/components/layout/Card.vue'

export default defineComponent({
  name: 'VacationOverview',
  methods: { Grid2x2Icon, CheckIcon, AlarmCheckIcon, CircleDot },
  components: {
    Card,
    CardContainer,
    ServicesSelect,
    Error,
    OptionsModal,
    FilterOptions,
    StyledInputText,
    Modal,
    StyledButton,
    Badge,
    BadgeCheck,
    BadgeAlert,
    CircleDot,
    Check,
    AlarmCheck,
    Grid2x2,
  },
  setup() {
    const errors = ref<string[]>([])
    const push = useRouter().push

    const filter = ref<string>('open')
    const { currentRoute } = useRouter()
    const staffUId = ref<null | string>(null)
    if (currentRoute.value.params.uid) {
      console.log('ALWAYS' + currentRoute.value.params.uid)
      staffUId.value = currentRoute.value.params.uid as string
    }
    watch(currentRoute, () => {
      if (currentRoute.value.params.uid) {
        console.log('ALWAYS' + currentRoute.value.params.uid)
        staffUId.value = currentRoute.value.params.uid as string
      } else {
        staffUId.value = null
      }
    })

    watch(staffUId, () => {
      filterVacationRequests(filter.value)
    })

    const { result, refetch, loading } = useQuery(
      GET_VACATION_REQUESTS_ADMIN_ALL,
      {
        isExpired: filter.value === 'expired',
        isOpen:
          filter.value === 'open'
            ? true
            : filter.value === 'closed'
              ? false
              : null,
        staffUId: staffUId.value,
      },
    )

    const { onResult: onVacationRequestSubscription } = useSubscription(
      VACATION_REQUESTED_SUBSCRIPTION,
    )

    onVacationRequestSubscription(() => {
      filterVacationRequests(filter.value)
    })

    const { mutate, onError } = useMutation(APPROVE_VACATION_REQUEST)

    onError(err => {
      errors.value.push(err.message)
    })
    const rejectVacation = async () => {
      if (!reject.value) return
      const res = await mutate({
        approveVacationRequestInput: {
          id: reject.value.id,

          rejectReason: rejectMessage.value,
          isRejected: true,
          isApproved: false,
        },
      })
      if (!res) return
      reject.value = undefined
      rejectMessage.value = ''
    }

    const approveVacation = async () => {
      if (!approve.value) return
      const res = await mutate({
        approveVacationRequestInput: {
          id: approve.value.id,
          rejectReason: '',
          isRejected: false,
          isApproved: true,
        },
      })
      if (!res) return
      approve.value = undefined
    }

    const filterVacationRequests = (filter: string) => {
      refetch({
        isExpired: filter === 'expired',
        isOpen: filter === 'open' ? true : filter === 'closed' ? false : null,
        staffUId: staffUId.value,
      })
    }

    const reject = ref<VacationRequestWithStaff>()
    const approve = ref<VacationRequestWithStaff>()
    const rejectMessage = ref<string>('')

    const filterStaff = (selectedStaffId: string) => {
      if (selectedStaffId === staffUId.value) return
      push(`/admin/vacation/${selectedStaffId}`)
      staffUId.value = selectedStaffId
    }

    const isExpired = (vacationRequest: VacationRequestWithStaff) => {
      return vacationRequest.endDate.getTime() < new Date().getTime()
    }

    return {
      approve,
      approveVacation,
      errors,
      filter,
      filterStaff,
      filterVacationRequests,
      isExpired,
      loading,
      reject,
      rejectMessage,
      rejectVacation,
      result,
      staffUId,
      MOBILE_VIEWPORT_WIDTH: useA11y().MOBILE_VIEWPORT_SIZE,
      windowWidth: useWindowSize().width,
      vacationRequests: computed(() => result.value?.vacationRequestsBy ?? []),
      staff: computed(() => result.value?.staff ?? []),
    }
  },
})
</script>

<template>
  <Error
    v-for="(err, index) in errors"
    :isShown="!!err"
    :msg="err ?? undefined"
    @update:isShown="errors[index] = ''"
  ></Error>

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
      <StyledButton button-type="gray" @click="reject = undefined"
        >Cancel
      </StyledButton>
      <StyledButton button-type="danger" @click="rejectVacation">
        Reject
      </StyledButton>
    </template>
  </Modal>
  <OptionsModal
    v-if="approve"
    :button1="{
      text: 'Cancel',
      type: 'gray',
    }"
    :button2="{
      text: 'Approve',
      type: 'secondary',
    }"
    :description="
      $t('request.vacation.approve.description', {
        name: approve.staff.firstName + ' ' + approve.staff.lastName,
      })
    "
    :show-modal="!!approve"
    :title="$t('request.vacation.approve.title')"
    @update:show-modal="approve = undefined"
    @button1-click="approve = undefined"
    @button2-click="approveVacation"
  />

  <div class="container mx-auto px-4 py-6">
    <div class="overflow-x-auto">
      <div class="w-full overflow-auto">
        <!-- Filters-->
        <div class="my-4 flex flex-col gap-4 sm:flex-row">
          <FilterOptions
            v-model="filter"
            :icons="[CircleDot, CheckIcon, AlarmCheckIcon, Grid2x2Icon]"
            :options="['open', 'closed', 'expired', 'all']"
            name="vacation-request-filter"
            @update:model-value="filterVacationRequests"
          />
          <services-select
            v-if="result"
            :content="
              result.staff.map(staff => ({
                id: staff.UID,
                name: staff.firstName + ' ' + staff.lastName,
              }))
            "
            :empty-option="{
              value: '',
              text: 'All',
            }"
            @change="filterStaff"
          />
        </div>

        <!--         select staff member-->

        <table
          v-if="
            result?.vacationRequestsBy &&
            result.vacationRequestsBy.length > 0 &&
            MOBILE_VIEWPORT_WIDTH < windowWidth
          "
          class="w-full text-sm"
        >
          <thead>
            <tr class="border-b transition-colors">
              <th class="h-12 px-4 text-left align-middle font-medium">
                {{ $t('common.status') }}
              </th>
              <th class="h12 px4 text-left align-middle font-medium">
                {{ $t('common.for') }}
              </th>

              <th class="h-12 px-4 text-left align-middle font-medium">
                {{ $t('request.reject.reason') }}
              </th>
              <th class="h-12 px-4 text-left align-middle font-medium">
                {{ $t('request.date.start') }}
              </th>
              <th class="h-12 px-4 text-left align-middle font-medium">
                {{ $t('request.date.end') }}
              </th>
              <th class="h-12 px-4 text-left align-middle font-medium">
                {{ $t('common.action') }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="vacationRequest in result?.vacationRequestsBy"
              class="border-b transition-colors"
            >
              <td class="p-4 align-middle">
                <BadgeCheck v-if="vacationRequest.isApproved" />
                <BadgeAlert v-else-if="vacationRequest.isRejected" />
                <CircleDot v-else></CircleDot>
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
                    !vacationRequest.isRejected &&
                    !vacationRequest.isApproved &&
                    !isExpired(vacationRequest)
                  "
                  class="flex space-x-2"
                >
                  <StyledButton
                    button-type="secondary"
                    @click="approve = vacationRequest"
                  >
                    {{ $t('common.approve') }}
                  </StyledButton>
                  <StyledButton
                    button-type="danger"
                    @click="reject = vacationRequest"
                  >
                    {{ $t('common.reject') }}
                  </StyledButton>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-else-if="loading">{{ $t('common.loading') }}</div>
        <!-- Mobile view-->
        <CardContainer
          v-else-if="
            MOBILE_VIEWPORT_WIDTH > windowWidth && vacationRequests.length > 0
          "
        >
          <Card
            v-for="vacationRequest of vacationRequests"
            :key="vacationRequest.id"
            class="relative"
          >
            <div class="absolute right-4">
              <BadgeCheck v-if="vacationRequest.isApproved" />
              <BadgeAlert v-else-if="vacationRequest.isRejected" />
              <CircleDot v-else></CircleDot>
            </div>
            <h2 class="text-lg font-medium">
              {{ vacationRequest.staff.firstName }}
              {{ vacationRequest.staff.lastName }}
            </h2>
            <p class="text-sm text-gray-600">
              {{ vacationRequest.startDate.toLocaleDateString() }} -
              {{ vacationRequest.endDate.toLocaleDateString() }}
            </p>
            <p class="mt-2">{{ vacationRequest.rejectReason }}</p>
            <div class="mt-4 flex items-center justify-between">
              <div
                v-if="
                  !vacationRequest.isRejected &&
                  !vacationRequest.isApproved &&
                  !isExpired(vacationRequest)
                "
                class="flex space-x-2"
              >
                <StyledButton
                  button-type="secondary"
                  @click="approve = vacationRequest"
                  >{{ $t('common.approve') }}
                </StyledButton>
                <StyledButton
                  button-type="danger"
                  @click="reject = vacationRequest"
                  >{{ $t('common.reject') }}
                </StyledButton>
              </div>
            </div>
          </Card>
        </CardContainer>
        <div v-else>
          {{ $t('request.vacation.none') }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
