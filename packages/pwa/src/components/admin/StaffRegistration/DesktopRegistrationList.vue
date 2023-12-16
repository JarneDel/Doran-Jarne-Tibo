<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { BadgeAlert, BadgeCheck, CircleDot, Trash } from 'lucide-vue-next'
import { StaffRegister } from '@/interface/staff.register.interface.ts'
import useTime from '@/composables/useTime.ts'
import { useMutation } from '@vue/apollo-composable'
import { DELETE_REGISTRATION } from '@/graphql/staff-register.query.ts'

export default defineComponent({
  name: 'DesktopRegistrationList',
  components: { CircleDot, BadgeCheck, Trash, BadgeAlert },
  props: {
    registrations: {
      type: Array as PropType<StaffRegister[]>,
      required: false,
    },
  },
  emits: {
    refresh: () => true,
    reportError: (error: string) => true,
  },

  setup(_props, ctx) {
    const { timeToExpiry, getIsExpired } = useTime()
    const { mutate: deleteRegistration, onError } =
      useMutation(DELETE_REGISTRATION)

    onError(err => ctx.emit('reportError', err.message))

    const removeRegistration = async (id: string) => {
      const res = await deleteRegistration({ id })
      if (res?.data) ctx.emit('refresh')
      else ctx.emit('reportError', 'Could not delete registration')
    }

    return {
      timeToExpiry,
      getIsExpired,
      removeRegistration,
    }
  },
})
</script>

<template>
  <table
    v-if="registrations && registrations.length > 0"
    class="w-full text-sm"
  >
    <thead>
      <tr class="border-b transition-colors">
        <th>status</th>
        <th>Email</th>
        <th>Full name</th>
        <th>Role</th>
        <th>Expires in</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="registration in registrations"
        :key="registration.id"
        class="border-b transition-colors"
      >
        <td>
          <BadgeCheck v-if="registration.isRegistered" />
          <BadgeAlert v-else-if="getIsExpired(registration.expiresAt)" />
          <CircleDot v-else></CircleDot>
        </td>
        <td>
          {{ registration.email }}
        </td>
        <td class="case-capital">
          {{ registration.firstName }}
          {{ registration.lastName }}
        </td>
        <td class="case-capital">
          {{ registration.role.toLocaleLowerCase() }}
        </td>
        <td>
          {{ timeToExpiry(new Date(registration.expiresAt)) }}
        </td>
        <td>
          <button
            class="text-danger"
            @click="removeRegistration(registration.id)"
          >
            <Trash :size="20" />
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
th {
  @apply h-12 px-4 text-left align-middle font-medium;
}

td {
  @apply align-mid p-4;
}
</style>
