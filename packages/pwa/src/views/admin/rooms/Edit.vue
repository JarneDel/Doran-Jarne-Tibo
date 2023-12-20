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

interface Sports {
  GetAllSports: [
    {
      id: string
      name: string
    },
  ]
}

import { computed, defineComponent, onBeforeMount, ref } from 'vue'
import Modal from '@/components/modal/Modal.vue'
import { useRouter } from 'vue-router'
import { useMutation, useQuery } from '@vue/apollo-composable'
import { GET_ONE_ROOM, UPDATE_ROOM } from '@/graphql/room.query.ts'
import StyledButton from '@/components/generic/StyledButton.vue'
import StyledInputText from '@/components/generic/StyledInputText.vue'
import { ALL_SPORTS } from '@/graphql/sport.query'
import Error from '@/components/Error.vue'

export default defineComponent({
  name: 'Edit',
  components: {
    StyledButton,
    Modal,
    StyledInputText,
    Error,
  },
  setup: () => {
    const { push, currentRoute } = useRouter()
    const id = computed(() => currentRoute.value.params.id)
    const errorMessages = ref<string[]>([])

    const { mutate: mutateUpdateItem } = useMutation(UPDATE_ROOM)

    // GET_ONE_ROOM
    const { error, loading, result } = useQuery<IRoom>(GET_ONE_ROOM, {
      roomId: id.value,
    })
    // All sports
    const {
      loading: loadingSports,
      result: resultSports,
      error: errorSports,
    } = useQuery<Sports>(ALL_SPORTS)

    const sortedSports = computed(() => {
      if (resultSports.value && resultSports.value.GetAllSports) {
        return resultSports.value.GetAllSports.slice().sort((a, b) =>
          a.name.localeCompare(b.name),
        )
      }
      return []
    })

    const currentRoom = ref<Room>({
      id: '',
      name: '',
      sports: [],
      pricePerHour: 0,
      type: '',
      canBeUsed: false,
    })

    // Set currentRoom based on result
    onBeforeMount(() => {
      if (result.value?.GetRoomById) {
        currentRoom.value = { ...result.value?.GetRoomById }
      }
    })

    const handleSubmit = () => {
      // Convert sports to sportIds
      let SportIds: String[] = []
      currentRoom.value.sports.forEach(sport => {
        SportIds.push(sport.id)
      })

      // Save changes
      mutateUpdateItem({
        updateRoomInput: {
          _id: currentRoom.value.id,
          name: currentRoom.value.name,
          SportId: SportIds,
          pricePerHour: Number(currentRoom.value.pricePerHour),
          type: currentRoom.value.type,
        },
      })
        .then(() => {
          push('/admin/rooms')
        })
        .catch(e => {
          const originalError = e.graphQLErrors[0].extensions
            .originalError as any
          if (!originalError || !originalError.message)
            return console.log('no message')

          console.log({ originalError })
          originalError.message.forEach((message: string) => {
            errorMessages.value.push(message)
          })
        })
    }

    return {
      push,
      handleSubmit,
      result,
      error,
      loading,
      resultSports,
      errorSports,
      loadingSports,
      currentRoom,
      sortedSports,
      errorMessages,
    }
  },
})
</script>

<template>
  <Error
    v-for="(error, index) of errorMessages"
    :key="index"
    :is-shown="errorMessages[index] !== ''"
    :msg="error"
    @update:is-shown="errorMessages[index] = ''"
  />
  <Modal max-width="max-w-xl" @close="push('/admin/rooms')">
    <template v-slot:title>
      <div class="flex w-full flex-row items-center justify-between">
        <h2 v-if="loading" class="mr-2 w-full text-lg font-bold">Loading...</h2>
        <h2
          v-if="!result?.GetRoomById && !loading"
          class="mr-2 w-full text-lg font-bold"
        >
          No item found with this id
        </h2>
        <h3 class="mr4 text-2xl font-bold">
          {{ result?.GetRoomById.name }}
        </h3>
        <div></div>
      </div>
    </template>
    <template v-slot:default>
      <form v-if="result?.GetRoomById" @submit.prevent="handleSubmit">
        <StyledInputText
          id="name"
          v-model="currentRoom.name"
          :label="$t('inventory.name')"
        />
        <div
          v-if="
            result?.GetRoomById.type == 'Sportzaal' ||
            result?.GetRoomById.type == 'Zwembad' ||
            result?.GetRoomById.type == 'Duikput'
          "
        >
          <p class="text-lg font-semibold">Sports:</p>
          <ul>
            <li>
              <div
                v-for="sport in sortedSports"
                :key="sport.id"
                class="flex items-center gap-2"
              >
                <input
                  :id="sport.id"
                  :checked="currentRoom.sports.some(s => s.id === sport.id)"
                  :name="sport.id"
                  type="checkbox"
                  @change="
                    (e: any) => {
                      if (e.target?.checked) {
                        currentRoom = {
                          ...currentRoom,
                          sports: [...currentRoom.sports, sport],
                        }
                      } else {
                        currentRoom = {
                          ...currentRoom,
                          sports: currentRoom.sports.filter(
                            s => s.id !== sport.id,
                          ),
                        }
                      }
                    }
                  "
                />
                <label :for="sport.id" class="select-none">{{
                  sport.name
                }}</label>
              </div>
            </li>
          </ul>
        </div>
        <div v-if="currentRoom.type !== 'Werkruimte'">
          <StyledInputText
            id="pricePerHour"
            v-model="currentRoom.pricePerHour"
            :label="$t('inventory.pricePerHour')"
            :min="0"
            type="number"
          >
          </StyledInputText>
        </div>
        <div class="flex justify-end">
          <StyledButton button-type="secondary" class="mt4" type="submit">
            {{ $t('item.edit.modify') }}
          </StyledButton>
        </div>
      </form>
    </template>
  </Modal>
</template>

<style scoped></style>
