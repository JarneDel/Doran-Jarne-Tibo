<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { StaffMember } from '@/graphql/staff.query.ts'
import ProfilePicture from '@/components/staff/ProfilePicture.vue'
import { LucidePencil } from 'lucide-vue-next'

export default defineComponent({
  name: 'StaffDataCard',
  components: { ProfilePicture, LucidePencil },
  props: {
    data: {
      type: Object as PropType<StaffMember>,
      required: true,
    },
  },
  methods: {
    parseTime(time: string) {
      const date = new Date()
      const [hours, minutes] = time.split(/[:\-]/g)
      date.setHours(parseInt(hours))
      date.setMinutes(parseInt(minutes))
      return date
    },

    isWorkingFromSchedule() {
      const day = new Date().getDay()
      if (this.data.workingHours.length === 0) return false
      const workingHoursToday = this.data.workingHours.find((wh: any) => {
        return wh.day === day
      })
      console.log(workingHoursToday)
      if (!workingHoursToday) return false
      const now = new Date()
      //format: hh:mm
      const start = this.parseTime(workingHoursToday.startTime)
      const end = this.parseTime(workingHoursToday.endTime)
      return now >= start && now <= end
    },
  },
  computed: {
    isWorking() {
      return this.isWorkingFromSchedule() && !this.isOnVacation
    },
    isOnVacation() {
      const vacations = this.data.holidayDates
      if (!vacations) return false
      const now = new Date()
      return vacations.some((vacation: Date) => {
        // if same day, return true
        return (
          now.getFullYear() === vacation.getFullYear() &&
          now.getMonth() === vacation.getMonth() &&
          now.getDate() === vacation.getDate()
        )
      })
    },
  },
})
</script>

<template>
  <!--  <div class="b-1 p2 border-black">-->
  <!--    <h2 class="font-medium">{{ $t('staff.profile') }}</h2>-->
  <!--    <div>{{ data.lastName + ' ' + data.firstName }}</div>-->
  <!--    <div>{{ isWorking }}</div>-->
  <!--    <div>{{ data.email }}</div>-->
  <!--    <div>{{ data.phone }}</div>-->
  <!--    <div v-if="isOnVacation">🎉{{ $t('staff.vacation') }}</div>-->
  <!--    <ProfilePicture editable />-->
  <!--  </div>-->

  <div
    class="h-min w-full overflow-hidden rounded-xl border bg-white shadow-md dark:bg-gray-800"
  >
    <div class="flex items-center justify-between space-x-4 p-6">
      <div class="flex items-center space-x-4">
        <ProfilePicture editable />
        <div>
          <div class="text-lg font-medium">
            {{ data.firstName }} {{ data.lastName }}
          </div>
          <div class="text-sm text-gray-500">{{ data.email }}</div>
          <div class="text-sm text-gray-500">{{ data.phone }}</div>
        </div>
      </div>
      <div class="flex flex-col items-center justify-between gap-4">
        <button>
          <LucidePencil></LucidePencil>
        </button>
        <div
          :class="{
            'bg-green-500': isWorking,
            'bg-red-500': !isWorking,
          }"
          class="focus:ring-ring flex h-5 w-5 items-center justify-center rounded-full border border-transparent px-1.5 py-1.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
        />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
