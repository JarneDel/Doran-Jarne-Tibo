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
  Loader2,
  Trash,
  Trash2,
  UserPlus2,
} from 'lucide-vue-next'
import FilterOptions from '@/components/generic/FilterOptions.vue'
import useTime from '@/composables/useTime'
import { ALL_STAFF } from '@/graphql/staff.query.ts'
import AdminStaffCard from '@/components/staff/AdminStaffCard.vue'
import StaffDetail from '@/components/admin/StaffDetail.vue'
import CardContainer from '@/components/layout/CardContainer.vue'
import Error from '@/components/Error.vue'
import ErrorList from '@/components/ErrorList.vue'
import DesktopRegistrationList from '@/components/admin/StaffRegistration/DesktopRegistrationList.vue'
import MobileRegistrationsList from '@/components/admin/StaffRegistration/MobileRegistrationsList.vue'
import { useWindowSize } from '@vueuse/core'
import useA11y from '@/composables/useA11y.ts'

export default defineComponent({
  name: 'Staff',
  methods: { UserPlus2, Contact },
  components: {
    MobileRegistrationsList,
    DesktopRegistrationList,
    ErrorList,
    Error,
    AdminStaffCard,
    BadgeAlert,
    BadgeCheck,
    CardContainer,
    CircleDashed,
    CircleDot,
    FilterOptions,
    Loader2,
    Modal,
    StaffDetail,
    StyledButton,
    StyledInputText,
    Trash,
    Trash2,
  },
  setup: () => {
    const adding = ref(false)
    const errors = ref<string[]>([])
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
    const { mutate, loading, onError } = useMutation(CREATE_REGISTRATION)
    onError(err => {
      errors.value.push(err.message)
    })

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

    const { width } = useWindowSize()
    const { MOBILE_VIEWPORT_SIZE } = useA11y()

    return {
      addStaff,
      filter,
      loadData,
      adding,
      errors,
      form,
      getIsExpired,
      refetch,
      registrations: computed(
        () => registrationsResult.value?.staffRegisterAll,
      ),
      staff: computed(() => staffResult.value?.staff),
      timeToExpiry,
      loadingAddingStaff: loading,
      isMobile: computed(() => width.value < MOBILE_VIEWPORT_SIZE.value),
    }
  },
})
</script>

<template>
  <ErrorList :error-messages="errors"></ErrorList>

  <StaffDetail v-if="$route.params.id" :id="$route.params.id as string" />
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
        <select
          id="role"
          v-model="form.role"
          class="b-2 b-secondary-400 hover:border-primary focus:border-primary-dark focus-visible:border-primary-dark mb-2 block w-full rounded bg-white px-4 py-1.5 outline-none transition-colors"
          name=""
        >
          <option value="STAFF">Staff</option>
          <option value="ADMIN">Admin</option>
        </select>
        <styled-button :disabled="loadingAddingStaff" type="submit">
          <span v-if="!loadingAddingStaff">Send</span>
          <Loader2 v-else class="animate-spin" />
        </styled-button>
      </form>
    </template>
  </Modal>
  <!--  Filters -->
  <div class="mxa mt8 max-w-7xl">
    <div class="flex flex-row justify-between">
      <FilterOptions
        v-model="filter"
        :icons="[Contact, UserPlus2]"
        :options="['staff', 'staffRegister']"
        name="staff-page-select"
        @update:model-value="loadData"
      />
      <styled-button @click="adding = true"> Add staff member</styled-button>
    </div>

    <div v-if="filter == 'staffRegister'" class="mt4">
      <DesktopRegistrationList
        v-if="!isMobile"
        :registrations="registrations"
        @error="errors.push($event)"
        @refresh="refetch"
      />
      <MobileRegistrationsList
        v-else
        :registrations="registrations"
        @error="errors.push($event)"
        @refresh="refetch"
      />
    </div>
    <div v-else-if="filter == 'staff'" class="mt-8">
      <CardContainer>
        <AdminStaffCard
          v-for="staffMember in staff"
          :key="staffMember.id"
          :data="staffMember"
          @click="$router.push('/admin/staff/' + staffMember.id)"
        />
      </CardContainer>
    </div>
  </div>
</template>

<style scoped></style>
