<script lang="ts" setup>
import { computed, PropType, ref } from 'vue'
import {
  CANCEL_VACATION_REQUEST,
  CancelVacationRequestInput,
  VacationRequest,
} from '@/graphql/vacation.request.query.ts'
import { BadgeAlert, BadgeCheck, CircleDashed, Trash2 } from 'lucide-vue-next'
import { useDates } from '@/composables/useDates.ts'
import { useMutation } from '@vue/apollo-composable'
import OptionsModal from '@/components/modal/OptionsModal.vue'

const props = defineProps({
  data: {
    type: Object as PropType<VacationRequest>,
    required: true,
  },
})

const vacationLength = computed(() => {
  return getDates(props.data.startDate, props.data.endDate)
})

const { getDates } = useDates()
const isCancelling = ref<boolean>(false)
const { mutate } = useMutation<VacationRequest, CancelVacationRequestInput>(
  CANCEL_VACATION_REQUEST,
)

const cancelRequest = () => {
  mutate({
    id: props.data.id,
  }).then(() => {
    isCancelling.value = false
  })
}
</script>

<template>
  <OptionsModal
    :button1="{
      text: $t('vacationRequest.cancel.keep'),
      type: 'secondary',
    }"
    :button2="{
      text: $t('vacationRequest.cancel.cancel'),
      type: 'danger',
    }"
    :show-modal="isCancelling"
    :title="$t('vacationRequest.cancel.title')"
    @button1-click="isCancelling = false"
    @button2-click="cancelRequest"
    @update:show-modal="isCancelling = false"
  />

  <div class="min-w-xs p1">
    <div class="flex flex-col justify-between">
      <div class="gap4 flex flex-row justify-between">
        <div>
          <div>
            {{ data.startDate.toLocaleDateString() }} -
            {{ data.endDate.toLocaleDateString() }}
          </div>
          <div class="font-300 text-sm">{{ vacationLength }} days</div>
        </div>
        <div class="py2 pr2 flex h-full flex-row justify-center gap-2">
          <BadgeAlert
            v-if="data.isRejected"
            :size="24"
            class="rounded-full bg-red-500 text-white"
          />
          <BadgeCheck
            v-else-if="data.isApproved"
            :size="24"
            class="rounded-full bg-green-500 text-white"
          />
          <CircleDashed
            v-else
            :size="24"
            class="bg-primary-light rounded-full"
          ></CircleDashed>

          <button v-if="!data.isRejected" @click="isCancelling = true">
            <Trash2 :size="24"></Trash2>
          </button>
        </div>
      </div>

      <div v-if="data.isRejected && data.rejectReason" class="text-sm">
        {{ data.rejectReason }}
      </div>
    </div>
  </div>
</template>

<style scoped></style>
