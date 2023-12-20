<script lang="ts">
import { useRouter } from 'vue-router'
import { useMutation, useQuery } from '@vue/apollo-composable'
import { STAFF_BY_ID, UPDATE_STAFF_ROLE } from '@/graphql/staff.query.ts'
import { computed, defineComponent, ref, watch } from 'vue'
import Modal from '@/components/modal/Modal.vue'
import useUser from '@/composables/useUser.ts'
import Error from '@/components/Error.vue'
import StyledButton from '@/components/generic/StyledButton.vue'
import { Check, Mail, Phone } from 'lucide-vue-next'

export default defineComponent({
  name: 'StaffDetail',
  components: { StyledButton, Error, Modal, Check, Mail, Phone },
  props: {
    id: {
      type: String,
      required: false,
    },
  },

  setup(props, ctx) {
    const { currentRoute } = useRouter()
    const errorMessages = ref<string[]>([])

    let id: string = ''
    if (props.id) {
      id = props.id
    } else if (currentRoute.value.params.id) {
      id = currentRoute.value.params.id as string
    }

    const { result } = useQuery(STAFF_BY_ID, { id: id })
    const staff = computed(() => {
      return result.value?.staffItem
    })
    watch(staff, () => {})

    const { customUser } = useUser()
    const getRoleValue = (role: string) => {
      if (role == 'ADMIN') {
        return 2
      } else if (role == 'SUPER_ADMIN') {
        return 3
      } else if (role == 'STAFF') {
        return 1
      } else {
        return 0
      }
    }

    const isAllowedToSetRole = computed(() => {
      if (customUser.value?.role == 'SUPER_ADMIN') {
        return true
      }
      if (!staff.value) {
        return false
      }
      if (customUser.value?.role) {
        return (
          getRoleValue(customUser.value.role) > getRoleValue(staff.value.role)
        )
      } else {
        return false
      }
    })
    const settableRoles = computed(() => {
      if (!staff.value) {
        return []
      }
      if (customUser.value?.role) {
        if (getRoleValue(customUser.value.role) == 3) {
          return ['ADMIN', 'STAFF', 'SUPER_ADMIN']
        } else if (getRoleValue(customUser.value.role) == 2) {
          return ['STAFF']
        } else {
          return []
        }
      } else {
        return []
      }
    })

    const newRole = ref<string | null>(null)
    const canSaveRole = ref<boolean>(false)
    const setRoleChanged = (event: Event) => {
      const eventTarget = event.target as HTMLInputElement
      newRole.value = eventTarget.value
      if (newRole.value == staff.value?.role) {
        canSaveRole.value = false
        return
      }
      canSaveRole.value = true
    }

    watch(settableRoles, () => {}, { immediate: true })

    const { mutate, onError } = useMutation(UPDATE_STAFF_ROLE)
    onError(err => {
      errorMessages.value = {
        ...errorMessages.value,
        ...err.graphQLErrors.map(error => error.message),
      }
    })

    const updateRole = () => {
      if (!newRole.value) {
        return
      }
      mutate({
        id: id,
        role: newRole.value,
      })
    }

    return {
      staff,
      result,
      isAllowedToSetRole,
      settableRoles,
      newRole,
      canSaveRole,
      errorMessages,
      updateRole,
      setRoleChanged,
    }
  },
})
</script>

<template>
  <Error
    v-for="(err, index) of errorMessages"
    :is-shown="!!err"
    :msg="err"
    @update:is-shown="errorMessages[index] = ''"
  />
  <Modal v-if="staff" @close="$router.push('/admin/staff')">
    <template v-slot:title>
      <div class="text-lg font-medium">
        {{ staff.firstName }} {{ staff.lastName }}
      </div>
    </template>

    <template v-slot:default>
      <div class="flex flex-row items-center justify-center gap-4">
        <img
          :alt="staff.firstName + ' ' + staff.lastName"
          :src="staff.profilePictureUrl"
          class="max-w-24 max-h-24 rounded-full"
        />
        <div>
          <div class="flex flex-row items-center gap-2">
            <Mail></Mail>
            <span>
              {{ staff.email }}
            </span>
          </div>
          <div class="mb-2 flex flex-row items-center gap-2">
            <Phone></Phone>
            <span>
              {{ staff.phone }}
            </span>
          </div>
          <div class="flex flex-row items-center justify-center gap-2">
            <select
              :value="newRole ?? staff.role"
              class="b-2 b-primary-light hover:border-primary focus:border-primary-dark focus-visible:border-primary-dark rounded bg-white px-4 py-1.5 outline-none motion-safe:transition-colors"
              @change="setRoleChanged"
            >
              <option
                :disabled="!settableRoles.includes('SUPER_ADMIN')"
                value="SUPER_ADMIN"
              >
                {{ $t('role.superAdmin') }}
              </option>
              <option
                :disabled="!settableRoles.includes('ADMIN')"
                value="ADMIN"
              >
                {{ $t('role.admin') }}
              </option>
              <option
                :disabled="!settableRoles.includes('STAFF')"
                value="STAFF"
              >
                {{ $t('role.staff') }}
              </option>
            </select>
            <StyledButton
              v-if="canSaveRole"
              :px="1"
              :py="1"
              @click="updateRole"
            >
              <Check />
            </StyledButton>
          </div>
        </div>
      </div>
    </template>
  </Modal>
</template>

<style scoped></style>
