<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { VacationRequest } from '@/graphql/vacation.request.query.ts'
import { Trash2, BadgeAlert, BadgeCheck, CircleDashed } from 'lucide-vue-next'
import { useDates } from '@/composables/useDates.ts'

export default defineComponent({
  name: 'VacationRow',
  components: { Delete: Trash2, BadgeAlert, BadgeCheck, CircleDashed },
  props: {
    data: {
      type: Object as PropType<VacationRequest>,
      required: true,
    },
  },
  setup() {
    const { getDates } = useDates()
    return { getDates }
  },
  methods: {
    cancelRequest() {
      alert('not implemented')
    },
  },

  computed: {
    vacationLength() {
      return this.getDates(this.data.startDate, this.data.endDate)
    },
  },
})
</script>

<template>
  <div
    class="flex flex-row justify-between rounded border"
    :class="data.isRejected ? 'border-danger' : 'border-gray-300'"
  >
    <div>
      <div>
        {{ data.startDate.toLocaleDateString() }} -
        {{ data.endDate.toLocaleDateString() }}
      </div>
      <div class="font-300 text-sm">{{ vacationLength }}days</div>
    </div>
    <div v-if="data.isRejected && data.rejectReason">
      {{ data.rejectReason }}
    </div>

    <div class="py2 pr2 flex h-full flex-row justify-center gap-2">
      <BadgeAlert :size="24" v-if="data.isRejected" />
      <BadgeCheck :size="24" v-else-if="data.isApproved" />
      <CircleDashed :size="24" v-else></CircleDashed>

      <button @click="cancelRequest">
        <Delete :size="24"></Delete>
      </button>
    </div>
  </div>
</template>

<style scoped></style>
