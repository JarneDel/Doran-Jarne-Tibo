<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import { StaffMember } from '@/graphql/staff.query.ts'
import ProfilePicture from '@/components/staff/ProfilePicture.vue'

export default defineComponent({
  name: 'StaffDataCard',
  components: { ProfilePicture },
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
    isOnVacation(): boolean {
      const vacations = this.data.holidayDates
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
  <div class="b-1 p2 border-black">
    <!--    <h2 class="font-medium">{{ $t('staff.profile') }}</h2>-->
    <div>{{ data.lastName + ' ' + data.firstName }}</div>
    <div>{{ isWorking }}</div>
    <div>{{ data.email }}</div>
    <div>{{ data.phone }}</div>
    <div v-if='isOnVacation'>🎉{{ $t('staff.vacation') }}</div>
    <ProfilePicture editable />
  </div>
</template>

<style scoped></style>
