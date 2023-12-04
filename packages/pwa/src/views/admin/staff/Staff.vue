<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { useLazyQuery, useMutation, useQuery } from '@vue/apollo-composable'
import {
  ALL_REGISTRATIONS,
  CREATE_REGISTRATION,
} from '@/graphql/staff-register.query.ts'
import Modal from '@/components/Modal.vue'
import StyledButton from '@/components/generic/StyledButton.vue'
import StyledInputText from '@/components/generic/StyledInputText.vue'
import {
  BadgeAlert,
  BadgeCheck,
  CircleDashed,
  CircleDot,
  Contact,
  Trash,
  Trash2,
  UserPlus2,
} from 'lucide-vue-next'
import FilterOptions from '@/components/generic/FilterOptions.vue'
import useTime from '@/composables/useTime'
import { ALL_STAFF } from '@/graphql/staff.query.ts'
import AdminStaffCard from '@/components/staff/AdminStaffCard.vue'

export default defineComponent({
  name: 'Staff',
  methods: { UserPlus2, Contact },
  components: {
    AdminStaffCard,
    CircleDashed,
    Trash2,
    FilterOptions,
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
    const filter = ref<'staff' | 'staffRegister'>('staff')

    const {
      result: registrationsResult,
      refetch,
      load,
    } = useLazyQuery(ALL_REGISTRATIONS)
    const { result: staffResult } = useQuery(ALL_STAFF)
    const { mutate } = useMutation(CREATE_REGISTRATION)

    const { getIsExpired, timeToExpiry } = useTime()

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

    const loadData = () => {
      if (filter.value === 'staffRegister') {
        load()
      }
    }

    return {
      addStaff,
      filter,
      loadData,
      adding,
      form,
      getIsExpired,
      registrations: computed(
        () => registrationsResult.value?.staffRegisterAll,
      ),
      staff: computed(() => staffResult.value?.staff),
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
  <!--  Filters -->
  <div class="mxa mt8 max-w-7xl">
    <FilterOptions
      v-model="filter"
      :icons="[Contact, UserPlus2]"
      :options="['staff', 'staffRegister']"
      name="staff-page-select"
      @update:model-value="loadData"
    />

    <div v-if="filter == 'staffRegister'" class="mt4">
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
    <div
      v-else-if="filter == 'staff'"
      class="mt4 relative h-min w-full overflow-hidden rounded-xl bg-white p-4 shadow-md dark:bg-gray-800"
    >
      <div class="gap4 flex flex-row flex-row flex-wrap">
        <AdminStaffCard
          v-for="staffMember in staff"
          :key="staffMember.id"
          :data="staffMember"
          @click="$router.push('/admin/staff/' + staffMember.id)"
        />
      </div>
    </div>
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
