<script lang="ts">
import { defineComponent, PropType } from 'vue'
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
})
</script>

<template>
  <div class="b-1 p2 border-black">
    <!--    <h2 class="font-medium">{{ $t('staff.profile') }}</h2>-->
    <div>{{ data.lastName + ' ' + data.firstName }}</div>
    <div>{{ data.email }}</div>
    <div>{{ data.phone }}</div>
    <ProfilePicture />
  </div>
</template>

<style scoped></style>
