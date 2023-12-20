<script lang="ts">
// Interfaces
interface Room {
  id: string
  name: string
  sports: Sport[]
  pricePerHour: number
  type: string
  createdAt?: string
  updatedAt?: string
}

interface Sport {
  id: string
  name: string
}

interface group {
  id: string
  name: string
  UID: string
  locale: string
  role: string
}

interface reservedMaterials {
  id: string
  name: string
  totalAmount: number
  wantedAmount: number
  price: number
  sports: Sport[]
  isComplete: boolean
  description: string
  amountReserved: number
}

interface Reservation {
  id: string
  date: string
  startTime: string
  endTime: string
  group: group
  reservedMaterials: reservedMaterials[]
  rooms: Room[]
  price: number
  isCancelled: boolean
  createdAt: string
  updatedAt: string
}

interface IReservation {
  GetReservatiounById: Reservation
}

import { computed, defineComponent } from 'vue'
import Modal from '@/components/modal/Modal.vue'
import { useRouter } from 'vue-router'
import { useMutation, useQuery } from '@vue/apollo-composable'
import {
  DELETE_RESERVATION,
  GET_ONE_RESERVATION,
} from '@/graphql/reservations.query.ts'
import { Edit2, Trash2 } from 'lucide-vue-next'
import StyledButton from '@/components/generic/StyledButton.vue'
import StyledLable from '@/components/generic/StyledLable.vue'

export default defineComponent({
  components: {
    StyledButton,
    Modal,
    Edit2,
    Trash: Trash2,
    StyledLable
},
  name: 'Item',
  setup: () => {
    const { push, replace, currentRoute } = useRouter()
    const id = computed(() => currentRoute.value.params.id)
    // region graphql
    const { error, loading, result } = useQuery<IReservation>(
      GET_ONE_RESERVATION,
      {
        id: id.value,
      },
    )
    const { mutate: deleteItem } = useMutation(DELETE_RESERVATION)

    const deleteItemWithConfirmation = (id: string) => {
      if (!confirm('Are you sure you want to delete this item?')) return
      deleteItem({ id }).then(() => {
        replace('/admin/reservations')
      })
    }

    return {
      push,
      result,
      error,
      loading,
      deleteItemWithConfirmation,
    }
  },
})
</script>

<template>
  <Modal max-width="max-w-xl" @close="push('/admin/reservations')">
    <template v-slot:title>
      <div class="flex w-full flex-row items-center justify-between">
        <h2 v-if="loading" class="mr-2 w-full text-lg font-bold">Loading...</h2>
        <h2
          v-if="!result?.GetReservatiounById && !loading"
          class="mr-2 w-full text-lg font-bold"
        >
          No item found with this id
        </h2>
        <h3 class="mr4 text-2xl font-bold">
          {{ result?.GetReservatiounById.group.name }}
        </h3>
        <button
          v-if="result?.GetReservatiounById"
          class="bg-danger-surface hover:bg-danger-light active:bg-danger-light mr-2 self-end rounded-full p-2 transition-colors duration-100 ease-in-out"
          @click="deleteItemWithConfirmation(result?.GetReservatiounById.id)"
        >
          <Trash :size="20" />
        </button>
        <!-- <button
          v-if="result?.GetReservatiounById"
          class="bg-primary-surface hover:bg-primary-surface/80 active:bg-primary-surface/60 mr-2 self-end rounded-full p-2"
          @click="
            push(
              '/admin/reservations/id/' +
                result?.GetReservatiounById.id +
                '/edit',
            )
          "
        >
          <Edit2 :size="20" />
        </button> -->
        <!-- <div></div> -->
      </div>
    </template>
    <template v-slot:default>
      <div v-if="result?.GetReservatiounById">
        <div class="flex justify-between">
          <h3 class="font-medium">
            {{ result?.GetReservatiounById.date.slice(0, 10) }}
          </h3>
          <h3 class="font-medium">
            {{ result?.GetReservatiounById.startTime }} -
            {{ result?.GetReservatiounById.endTime }}
          </h3>
        </div>
        <div>
          <h3 class="font-medium">Rooms:</h3>
          <div class=" flex gap-x-4 gap-y-1 flex-wrap">
            <StyledLable
              type="room"
              v-for="room in result?.GetReservatiounById.rooms"
            >
              {{ room.name }}
            </StyledLable>
          </div>
        </div>
        <div>
          <h3 class="font-medium">Materials:</h3>
          <div class=" flex gap-x-4 gap-y-1 flex-wrap">
            <StyledLable
              type="material"
              v-for="material in result?.GetReservatiounById.reservedMaterials"
            >
              {{ material.name }}
            </StyledLable>
          </div>
        </div>
        <div class="flex gap-2">
          <h3 class="font-medium">Price:</h3>
          <p>€ {{ result?.GetReservatiounById.price.toFixed(2) }}</p>
        </div>
      </div>
    </template>
  </Modal>
</template>

<style scoped></style>
