<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { StaffRegister } from '@/interface/staff.register.interface.ts'
import useTime from '@/composables/useTime.ts'
import { useMutation } from '@vue/apollo-composable'
import { DELETE_REGISTRATION } from '@/graphql/staff-register.query.ts'
import { BadgeAlert, BadgeCheck, CircleDot, Trash } from 'lucide-vue-next'
import CardContainer from '@/components/layout/CardContainer.vue'
import Card from '@/components/layout/Card.vue'
import StyledButton from '@/components/generic/StyledButton.vue'

export default defineComponent({
  name: 'MobileRegistrationsList',
  components: {
    StyledButton,
    Card,
    CardContainer,
    CircleDot,
    BadgeCheck,
    Trash,
    BadgeAlert,
  },
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
  <CardContainer v-if="registrations && registrations?.length > 0">
    <Card
      v-for="registration of registrations"
      :key="registration.id"
      class="relative"
    >
      <div class="absolute right-4">
        <BadgeCheck v-if="registration.isRegistered" />
        <BadgeAlert v-else-if="getIsExpired(registration.expiresAt)" />
        <CircleDot v-else></CircleDot>
      </div>
      <h2 class="text-lg font-medium">
        {{ registration.firstName }}
        {{ registration.lastName }}
      </h2>
      <p class="text-sm text-gray-600">
        {{ registration.email }}
      </p>
      <div class="flex flex-row items-start justify-between">
        <p class="text-gray-600">
          {{ timeToExpiry(new Date(registration.expiresAt)) }}
        </p>

        <StyledButton
          button-type="danger"
          @click="removeRegistration(registration.id)"
        >
          Delete
        </StyledButton>
      </div>
    </Card>
  </CardContainer>
</template>

<style scoped></style>
