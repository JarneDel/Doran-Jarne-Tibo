<script lang="ts">
// Interfaces
interface IRepairRequest {
  GetRepairRequestById: RepairRequest
}

interface ICurrentRepairRequestCanBeEmpty {
  id?: string
  title?: string
  description?: string
  isRepaired?: boolean
  requestUser?: RequestUser
  room?: Room[]
  loanableMaterial?: material[]
  urgency?: number
}

interface IconvertedRooms {
  id?: string
  name?: string
  pricePerHour?: number
  type?: string
}

interface IRooms {
  GetAllRooms: [Room]
}

interface IconvertedLoanableMaterials {
  id?: string
  name?: string
  totalAmount?: number
  wantedAmount?: number
  price?: number
  sports?: Sport[]
  isComplete?: boolean
  description?: string
}

interface ILoanableMaterials {
  GetAllLoanableMaterials: material[]
}

import { Sport } from '@/interface/sportInterface'
import { computed, defineComponent, onBeforeMount, ref } from 'vue'
import { BadgeCheck, ShieldAlert } from 'lucide-vue-next'
import Modal from '@/components/modal/Modal.vue'
import { useRouter } from 'vue-router'
import { useMutation, useQuery } from '@vue/apollo-composable'
import {
  GET_ONE_REPAIR_REQUEST,
  UPDATE_REPAIR_REQUEST,
} from '@/graphql/repairRequests.query.ts'
import { ALL_LOANABLE_MATERIALS } from '@/graphql/loanableMaterials.query.ts'
import { ALL_ROOMS } from '@/graphql/room.query.ts'
import StyledButton from '@/components/generic/StyledButton.vue'
import StyledInputText from '@/components/generic/StyledInputText.vue'
import { RepairRequest } from '@/interface/repairRequestInterface'
import { RequestUser } from '@/interface/requestUserInterface'
import { Room } from '@/interface/roomInterface'
import { material } from '@/interface/materialInterface'

export default defineComponent({
  name: 'Edit',
  components: {
    StyledButton,
    Modal,
    StyledInputText,
    ShieldAlert,
    BadgeCheck,
  },
  setup: () => {
    const { push, currentRoute } = useRouter()
    const id = computed(() => currentRoute.value.params.id)

    const { mutate: mutateUpdateItem } = useMutation(UPDATE_REPAIR_REQUEST)

    // GET_ONE_REPAIR_REQUEST
    const { error, loading, result } = useQuery<IRepairRequest>(
      GET_ONE_REPAIR_REQUEST,
      {
        repairRequestId: id.value,
      },
    )

    // ALL_ROOMS
    const {
      error: errorRooms,
      loading: loadingRooms,
      result: resultRooms,
    } = useQuery<IRooms>(ALL_ROOMS, {})

    // ALL_LOANABLE_MATERIALS
    const {
      error: errorMaterials,
      loading: loadingMaterials,
      result: resultMaterials,
    } = useQuery<ILoanableMaterials>(ALL_LOANABLE_MATERIALS, {})

    const currentRepairRequest = ref<ICurrentRepairRequestCanBeEmpty>({})

    // Set currentRepairRequest based on result
    onBeforeMount(() => {
      if (result.value?.GetRepairRequestById) {
        currentRepairRequest.value = { ...result.value?.GetRepairRequestById }
      }
    })

    const handleSubmit = () => {
      const convertedRooms: IconvertedRooms[] = []
      if (currentRepairRequest.value.room) {
        currentRepairRequest.value.room.forEach(room => {
          const tempRoom: IconvertedRooms = {}
          tempRoom.id = room.id
          tempRoom.name = room.name
          tempRoom.pricePerHour = room.pricePerHour
          tempRoom.type = room.type
          convertedRooms.push(tempRoom)
        })
      }

      const convertedLoanableMaterials: IconvertedLoanableMaterials[] = []
      if (currentRepairRequest.value.loanableMaterial) {
        currentRepairRequest.value.loanableMaterial.forEach(material => {
          console.log('material', material)
          const Sports = material.sports?.map(sport => {
            console.log('sport', sport)
            return {
              id: sport.id,
              name: sport.name,
              description: sport.description,
            }
          })

          const tempMaterial: IconvertedLoanableMaterials = {}
          tempMaterial.id = material.id
          tempMaterial.name = material.name
          tempMaterial.totalAmount = material.totalAmount
          tempMaterial.wantedAmount = material.wantedAmount
          tempMaterial.price = material.price
          tempMaterial.sports = Sports
          tempMaterial.isComplete = material.isComplete
          tempMaterial.description = material.description
          convertedLoanableMaterials.push(tempMaterial)
        })
      }
      console.log('convertedLoanableMaterials', convertedLoanableMaterials)

      // Save changes
      mutateUpdateItem({
        updateRepairRequestInput: {
          id: currentRepairRequest.value.id,
          title: currentRepairRequest.value.title,
          description: currentRepairRequest.value.description,
          isRepaired: currentRepairRequest.value.isRepaired,
          room: convertedRooms,
          loanableMaterial: convertedLoanableMaterials,
          urgency: Number(currentRepairRequest.value.urgency),
        },
      }).then(e => {
        push('/admin/repair-requests')
      })
    }

    return {
      push,
      handleSubmit,
      result,
      error,
      loading,
      resultRooms,
      errorRooms,
      loadingRooms,
      resultMaterials,
      errorMaterials,
      loadingMaterials,
      currentRepairRequest,
    }
  },
})
</script>

<template>
  <Modal max-width="max-w-xl" @close="push('/admin/repair-requests')">
    <template v-slot:title>
      <div class="flex w-full flex-row items-center justify-between">
        <h2 v-if="loading" class="mr-2 w-full text-lg font-bold">Loading...</h2>
        <h2
          v-if="!result?.GetRepairRequestById && !loading"
          class="mr-2 w-full text-lg font-bold"
        >
          No item found with this id
        </h2>
        <h3 class="text-primary-text mb-2 mr-2 text-2xl font-bold">
          {{ result?.GetRepairRequestById.title }}
        </h3>
        <div></div>
      </div>
    </template>
    <template v-slot:default>
      <form v-if="result?.GetRepairRequestById" @submit.prevent="handleSubmit">
        <div class="flex gap-8">
          <div class="flex flex-col gap-2">
            <StyledInputText
              id="name"
              v-model="currentRepairRequest.title"
              :label="$t('repairRequest.title')"
            />
            <div class="mt-4 flex items-center justify-between">
              <ShieldAlert
                :class="{
                  'text-yellow-300': currentRepairRequest.urgency == 1,
                  'text-orange-500': currentRepairRequest.urgency == 2,
                  'text-red-600': currentRepairRequest.urgency == 3,
                  'opacity-40': currentRepairRequest.isRepaired,
                }"
                class="mr-2 min-h-[2rem] min-w-[2rem]"
              />
              <select
                id="urgency"
                v-model="currentRepairRequest.urgency"
                class="b-2 b-primary-light hover:border-primary focus:border-primary-dark focus-visible:border-primary-dark w-full rounded bg-white px-4 py-1.5 outline-none transition-colors"
                name="urgency"
              >
                <option value="1">{{ $t('repairRequest.notUrgent') }}</option>
                <option value="2">
                  {{ $t('repairRequest.mildlyUrgent') }}
                </option>
                <option value="3">{{ $t('repairRequest.veryUrgent') }}</option>
              </select>
            </div>
            <div class="flex items-center justify-between">
              <BadgeCheck
                :class="{
                  'opacity-40': !currentRepairRequest.isRepaired,
                }"
                class="mr-2 min-h-[2rem] min-w-[2rem] text-green-600"
              />
              <div class="flex items-center gap-2">
                <label class="text-primary-text font-medium" for="repaired">{{
                  $t('repairRequest.repaired')
                }}</label>
                <input
                  id="repaired"
                  v-model="currentRepairRequest.isRepaired"
                  name="repaired"
                  type="checkbox"
                />
              </div>
            </div>
            <div class="">
              <h4 class="text-primary-text font-medium">
                {{ $t('repairRequest.requester') }}
              </h4>
              <div
                v-if="currentRepairRequest.requestUser"
                class="flex flex-col"
              >
                <div class="flex gap-2">
                  <h5 class="text-primary-text">
                    {{ $t('repairRequest.name') }}:
                  </h5>
                  <p v-if="currentRepairRequest.requestUser.role !== 'GROUP'">
                    {{ currentRepairRequest.requestUser.firstName }}
                    {{ currentRepairRequest.requestUser.lastName }}
                  </p>
                  <p v-if="currentRepairRequest.requestUser.role === 'GROUP'">
                    {{ currentRepairRequest.requestUser.name }}
                  </p>
                </div>
                <div class="flex gap-2">
                  <h5 class="text-primary-text">
                    {{ $t('repairRequest.email') }}:
                  </h5>
                  <p>{{ currentRepairRequest.requestUser.email }}</p>
                </div>
                <div class="flex gap-2">
                  <h5 class="text-primary-text">
                    {{ $t('repairRequest.role') }}:
                  </h5>
                  <p>{{ currentRepairRequest.requestUser.role }}</p>
                </div>
              </div>
            </div>
            <StyledInputText
              id="description"
              v-model="currentRepairRequest.description"
              :label="$t('repairRequest.description')"
            />
          </div>
          <div>
            <h4 class="text-primary-text font-medium">
              {{ $t('repairRequest.materials') }}
            </h4>
            <ul>
              <li>
                <div
                  v-for="material in resultMaterials?.GetAllLoanableMaterials"
                  :key="material.id"
                  class="flex items-center gap-2"
                >
                  <input
                    :id="material.id"
                    :checked="
                      currentRepairRequest.loanableMaterial &&
                      currentRepairRequest.loanableMaterial.some(
                        s => s.id === material.id,
                      )
                        ? true
                        : false
                    "
                    :name="material.id"
                    type="checkbox"
                    @change="
                      (e: any) => {
                        if (e.target?.checked) {
                          currentRepairRequest = {
                            ...currentRepairRequest,
                            loanableMaterial: Array.isArray(
                              currentRepairRequest.loanableMaterial,
                            )
                              ? [
                                  ...currentRepairRequest.loanableMaterial,
                                  material,
                                ]
                              : [material],
                          }
                        } else {
                          currentRepairRequest = {
                            ...currentRepairRequest,
                            loanableMaterial: Array.isArray(
                              currentRepairRequest.loanableMaterial,
                            )
                              ? currentRepairRequest.loanableMaterial.filter(
                                  s => s.id !== material.id,
                                )
                              : [],
                          }
                        }
                      }
                    "
                  />
                  <label :for="material.id" class="select-none">{{
                    material.name
                  }}</label>
                </div>
              </li>
            </ul>
          </div>
          <div>
            <h4 class="text-primary-text font-medium">
              {{ $t('repairRequest.rooms') }}
            </h4>
            <ul>
              <li>
                <div
                  v-for="room in resultRooms?.GetAllRooms"
                  :key="room.id"
                  class="flex items-center gap-2"
                >
                  <input
                    :id="room.id"
                    :checked="
                      currentRepairRequest.room &&
                      currentRepairRequest.room.some(s => s.id === room.id)
                        ? true
                        : false
                    "
                    :name="room.id"
                    type="checkbox"
                    @change="
                      (e: any) => {
                        if (e.target?.checked) {
                          currentRepairRequest = {
                            ...currentRepairRequest,
                            room: Array.isArray(currentRepairRequest.room)
                              ? [...currentRepairRequest.room, room]
                              : [room],
                          }
                        } else {
                          currentRepairRequest = {
                            ...currentRepairRequest,
                            room: Array.isArray(currentRepairRequest.room)
                              ? currentRepairRequest.room.filter(
                                  s => s.id !== room.id,
                                )
                              : [],
                          }
                        }
                      }
                    "
                  />
                  <label :for="room.id" class="select-none">{{
                    room.name
                  }}</label>
                </div>
              </li>
            </ul>
          </div>
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
