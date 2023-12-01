<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue'
import { useMutation, useQuery } from '@vue/apollo-composable'
import {
  ALL_REGISTRATIONS,
  CREATE_REGISTRATION,
} from '@/graphql/staff-register.query.ts'
import Modal from '@/components/Modal.vue'
import StyledButton from '@/components/generic/StyledButton.vue'
import StyledInputText from '@/components/generic/StyledInputText.vue'
import { BadgeAlert, BadgeCheck, CircleDot, Trash } from 'lucide-vue-next'

export default defineComponent({
  name: 'Staff',
  components: {
    BadgeCheck,
    CircleDot,
    BadgeAlert,
    Trash,
    StyledInputText,
    StyledButton,
    Modal,
  },
  setup: () => {
    const adding = ref(false)
    const form = ref({
      email: '',
      firstName: '',
      lastName: '',
      role: 'STAFF',
    })

    const { result, refetch } = useQuery(ALL_REGISTRATIONS)
    const { mutate } = useMutation(CREATE_REGISTRATION)

    watch(result, () => {
      console.log(result.value)
    })

    const addStaff = async () => {
      await mutate({
        staffRegisterInput: {
          email: form.value.email,
          firstName: form.value.firstName,
          lastName: form.value.lastName,
          role: form.value.role,
        },
      })
      adding.value = false
      await refetch()
    }

    const getIsExpired = (date: Date) => {
      const now = new Date()
      return date < now
    }
    const timeToExpiry = (date: Date): string => {
      const now = new Date()
      const diff = date.getTime() - now.getTime()
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      )
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)
      if (days) {
        return `${days} d ${hours} h`
      }
      if (hours) {
        return `${hours} h ${minutes} m`
      }
      if (minutes) {
        return `${minutes} m ${seconds} s`
      }
      return `${seconds} s`
    }

    return {
      addStaff,
      adding,
      form,
      getIsExpired,
      registrations: computed(() => result.value?.staffRegisterAll),
      timeToExpiry,
    }
  },
})
</script>

<template>
  <Modal v-if="adding" @close="adding = false">
    <template v-slot:title> Add staff member</template>
    <template v-slot:default>
      <form @submit.prevent="addStaff">
        <styled-input-text
          v-model="form.firstName"
          label="First name"
          required
        />
        <styled-input-text v-model="form.lastName" label="Last name" required />
        <styled-input-text
          v-model="form.email"
          label="Email"
          required
          type="email"
        />
        <label for="role">Role</label>
        <select id="role" v-model="form.role" class="block" name="">
          <option value="STAFF">Staff</option>
          <option value="ADMIN">Admin</option>
        </select>
        <styled-button type="submit">Send</styled-button>
      </form>
    </template>
  </Modal>
  <div class="mx-a mt-8 max-w-7xl">
    <div class="flex w-full justify-end">
      <styled-button @click="adding = true"> Add staff member</styled-button>
    </div>
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
            <button class="text-danger" @click="console.log(registration)">
              <Trash :size="20" />
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
th {
  @apply h-12 px-4 text-left align-middle font-medium;
}

td {
  @apply align-mid p-4;
}
</style>
