<script lang="ts">
// Interfaces
interface Room {
  id: string
  name: string
  sports: Sport[]
  pricePerHour: number
  type: string
  canBeUsed: boolean
}
interface IRoom {
  GetRoomById: Room
}

interface Sport {
  id: string
  name: string
}

import { computed, defineComponent } from 'vue'
import Modal from '@/components/Modal.vue'
import { useRouter } from 'vue-router'
import { useMutation, useQuery } from '@vue/apollo-composable'
import { DELETE_ROOM, GET_ONE_ROOM } from '@/graphql/room.query.ts'
import { Edit2, Trash2 } from 'lucide-vue-next'
import StyledButton from '@/components/generic/StyledButton.vue'

export default defineComponent({
  components: {
    StyledButton,
    Modal,
    Edit2,
    Trash: Trash2,
  },
  name: 'Item',
  setup: () => {
    const { push, replace, currentRoute } = useRouter()
    const id = computed(() => currentRoute.value.params.id)
    // region graphql
    const { error, loading, result } = useQuery<IRoom>(
      GET_ONE_ROOM,
      {
        roomId: id.value,
      },
      {
        fetchPolicy: 'cache-and-network',
      },
    )
    const { mutate: deleteItem } = useMutation(DELETE_ROOM)

    const deleteItemWithConfirmation = (roomId: string) => {
      if (!confirm('Are you sure you want to delete this item?')) return
      deleteItem({ roomId }).then(() => {
        replace('/admin/rooms')
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
  <Modal max-width="max-w-md" @close="push('/admin/rooms')">
    <template v-slot:title>
      <div class="flex w-full flex-row items-center justify-between">
        <h2 v-if="loading" class="mr-2 w-full text-lg font-bold">Loading...</h2>
        <h2
          v-if="!result?.GetRoomById && !loading"
          class="mr-2 w-full text-lg font-bold"
        >
          No item found with this id
        </h2>
        <h3 class="mr-4 text-2xl font-bold">
          {{ result?.GetRoomById.name }}
        </h3>
        <div>
          <button
            v-if="result?.GetRoomById"
            class="bg-danger-surface hover:bg-danger-light active:bg-danger-light mr-2 self-end rounded-full p-2 transition-colors duration-100 ease-in-out"
            @click="deleteItemWithConfirmation(result?.GetRoomById.id)"
          >
            <Trash :size="20" />
          </button>
          <button
            v-if="result?.GetRoomById"
            class="bg-primary-surface hover:bg-primary-surface/80 active:bg-primary-surface/60 mr-2 self-end rounded-full p-2"
            @click="push('/admin/rooms/id/' + result?.GetRoomById.id + '/edit')"
          >
            <Edit2 :size="20" />
          </button>
        </div>
      </div>
    </template>
    <template v-slot:default>
      <div
        v-if="
          result?.GetRoomById.type == 'Sportzaal' ||
          result?.GetRoomById.type == 'Zwembad' ||
          result?.GetRoomById.type == 'Duikput'
        "
      >
        <p class="text-lg font-semibold">Sports:</p>
        <ul class="flex flex-wrap gap-x-2 gap-y-1">
          <li
            class="bg-secondary mt-1 w-fit rounded-full px-4 text-sm"
            v-for="sport in result?.GetRoomById.sports"
            :key="sport.name"
          >
            <p>{{ sport.name }}</p>
          </li>
        </ul>
        <div class="flex items-center gap-1">
          <p class="text-lg font-semibold">Price per hour:</p>
          <p>€{{ result.GetRoomById.pricePerHour }}</p>
        </div>
      </div>
      <div v-if="result?.GetRoomById.type == 'Werkruimte'"></div>
      <div v-if="result?.GetRoomById.type == 'Kleedruimte'">
        <div class="flex items-center gap-1">
          <p class="text-lg font-semibold">Price per hour:</p>
          <p>€{{ result.GetRoomById.pricePerHour }}</p>
        </div>
      </div>
    </template>
  </Modal>
</template>

<style scoped></style>
