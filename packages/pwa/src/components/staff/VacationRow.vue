<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { VacationRequest } from '@/graphql/vacation.request.query.ts'
import { BadgeAlert, BadgeCheck, CircleDashed, Trash2 } from 'lucide-vue-next'
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
  <div class="b-gray p1 flex flex-row justify-between rounded border">
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

      <button @click="cancelRequest">
        <Delete :size="24"></Delete>
      </button>
    </div>
  </div>
</template>

<style scoped></style>
