<script lang="ts" setup>
import { PropType } from 'vue'
import { StaffBasics } from '@/interface/staff.interface.ts'

const props = defineProps({
  data: {
    type: Object as PropType<StaffBasics>,
    required: true,
  },
})

// const { customUser } = useUser()
// const { push } = useRouter()
//
// const getRoleValue = (role: string) => {
//   switch (role) {
//     case 'SUPER_ADMIN':
//       return 3
//     case 'ADMIN':
//       return 2
//     case 'STAFF':
//       return 1
//     default:
//       return 0
//   }
// }
//
// const yourRoleValue = computed(() => {
//   if (!customUser.value) push('/login')
//   return getRoleValue(customUser.value?.userByUid.role!)
// })
// const staffRoleValue = computed(() => {
//   return getRoleValue(props.data.role)
// })
//
// const canSetRole = computed(() => {
//   if (yourRoleValue.value === 3) return true
//   return yourRoleValue.value > staffRoleValue.value
// })
</script>

<template>
  <div class="py.5 p1 rounded bg-gray-100 shadow-md">
    <div class="min-w-xs p1">
      <div class="flex flex-col justify-between">
        <div class="gap4 flex flex-row justify-between">
          <div>
            <div>{{ data.firstName }} {{ data.lastName }}</div>
            <div class="font-300 text-sm">{{ data.email }}</div>
          </div>
          <div class="py2 pr2 flex h-full flex-row justify-center gap-2">
            {{ data.role }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
