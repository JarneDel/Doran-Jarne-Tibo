<script lang="ts">
// Interfaces
interface IRepairRequest {
  GetRepairRequestById: RepairRequest
}

import { RepairRequest } from '@/interface/repairRequestInterface'
import { computed, defineComponent } from 'vue'
import Modal from '@/components/modal/Modal.vue'
import { useRouter } from 'vue-router'
import { useMutation, useQuery } from '@vue/apollo-composable'
import {
  GET_ONE_REPAIR_REQUEST,
  DELETE_REPAIR_REQUEST,
} from '@/graphql/repairRequests.query.ts'
import {
  Edit2,
  Trash2,
  BadgeCheck,
  ShieldAlert,
  Warehouse,
  Box,
} from 'lucide-vue-next'
import StyledButton from '@/components/generic/StyledButton.vue'
import StyledLable from '@/components/generic/StyledLable.vue'

export default defineComponent({
  components: {
    StyledButton,
    Modal,
    Edit2,
    Trash: Trash2,
    BadgeCheck,
    ShieldAlert,
    Warehouse,
    Box,
    StyledLable
},
  name: 'Item',
  setup: () => {
    const { push, replace, currentRoute } = useRouter()
    const id = computed(() => currentRoute.value.params.id)
    // region graphql
    const { error, loading, result } = useQuery<IRepairRequest>(
      GET_ONE_REPAIR_REQUEST,
      {
        repairRequestId: id.value,
      },
      {
        fetchPolicy: 'cache-and-network',
      },
    )
    const { mutate: deleteItem } = useMutation(DELETE_REPAIR_REQUEST)

    const deleteItemWithConfirmation = (repairRequestId: string) => {
      if (!confirm('Are you sure you want to delete this item?')) return
      deleteItem({ repairRequestId }).then(() => {
        replace('/admin/repair-requests')
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
  <Modal max-width="max-w-md" @close="push('/admin/repair-requests')">
    <template v-slot:title>
      <div class="flex w-full flex-row items-center justify-between">
        <h2 v-if="loading" class="mr-2 w-full text-lg font-bold">Loading...</h2>
        <h2
          v-if="!result?.GetRepairRequestById && !loading"
          class="mr-2 w-full text-lg font-bold"
        >
          No item found with this id
        </h2>
        <h3 class="text-primary-text mr-4 text-2xl font-bold">
          {{ result?.GetRepairRequestById.title }}
        </h3>
        <ShieldAlert
          class="mr-2 h-8 w-8"
          :class="{
            'text-yellow-300': result?.GetRepairRequestById.urgency == 1,
            'text-orange-500': result?.GetRepairRequestById.urgency == 2,
            'text-red-600': result?.GetRepairRequestById.urgency == 3,
            hidden: result?.GetRepairRequestById.isRepaired,
          }"
        />
        <BadgeCheck
          class="mr-2 h-8 w-8 text-green-600"
          :class="{
            hidden: !result?.GetRepairRequestById.isRepaired,
          }"
        />
        <div>
          <button
            v-if="result?.GetRepairRequestById"
            class="bg-danger-surface hover:bg-danger-light active:bg-danger-light mr-2 self-end rounded-full p-2 transition-colors duration-100 ease-in-out"
            @click="deleteItemWithConfirmation(result?.GetRepairRequestById.id)"
          >
            <Trash :size="20" />
          </button>
          <button
            v-if="result?.GetRepairRequestById"
            class="bg-primary-surface hover:bg-primary-surface/80 active:bg-primary-surface/60 mr-2 self-end rounded-full p-2"
            @click="
              push(
                '/admin/repair-requests/id/' +
                  result?.GetRepairRequestById.id +
                  '/edit',
              )
            "
          >
            <Edit2 :size="20" />
          </button>
        </div>
      </div>
    </template>
    <template v-slot:default>
      <div class="flex flex-col gap-4">
        <div class="flex flex-col">
          <div class="flex items-center mb-1">
            <Box
              class="mr-2 min-h-[2rem] min-w-[2rem] opacity-10"
              :class="{
                'opacity-100': result?.GetRepairRequestById.loanableMaterial,
              }"
            />
            <ul >
              <li class="flex flex-wrap gap-x-4 gap-y-1"
                v-if="
                  Array.isArray(result?.GetRepairRequestById.loanableMaterial)
                "
              >
                <StyledLable
                type="material"
                  v-if="result?.GetRepairRequestById.loanableMaterial.length"
                  v-for="(loanableMaterial) in result
                    ?.GetRepairRequestById.loanableMaterial"
                >
                  {{ loanableMaterial.name }}
                </StyledLable>
              </li>
              <li v-else>
                {{ result?.GetRepairRequestById.loanableMaterial }}
              </li>
            </ul>
          </div>
          <div class="flex items-center">
            <Warehouse
              class="mr-2 min-h-[2rem] min-w-[2rem] opacity-10"
              :class="{ 'opacity-100': result?.GetRepairRequestById.room }"
            />
            <ul class="flex flex-wrap gap-x-4 gap-y-1" v-if="Array.isArray(result?.GetRepairRequestById.room)">
              <StyledLable
                v-if="result?.GetRepairRequestById.room.length"
                v-for="(room, index) in result?.GetRepairRequestById.room"
                :key="index"
              >
                {{ room.name }}
              </StyledLable>
            </ul>
            <p v-else>{{ result?.GetRepairRequestById.room }}</p>
          </div>
        </div>
        <div class="flex flex-col text-left">
          <h4 class="text-primary-text mb-1 text-xl font-bold">
            {{ $t('repairRequest.requester') }}
          </h4>
          <div class="flex flex-col">
            <div class="flex gap-2">
              <h5 class="text-primary-text font-medium">
                {{ $t('repairRequest.name') }}:
              </h5>
              <p
                v-if="result?.GetRepairRequestById.requestUser.role !== 'GROUP'"
              >
                {{ result?.GetRepairRequestById.requestUser.firstName }}
                {{ result?.GetRepairRequestById.requestUser.lastName }}
              </p>
              <p
                v-if="result?.GetRepairRequestById.requestUser.role === 'GROUP'"
              >
                {{ result?.GetRepairRequestById.requestUser.name }}
              </p>
            </div>
            <div class="flex gap-2">
              <h5 class="text-primary-text font-medium">
                {{ $t('repairRequest.email') }}:
              </h5>
              <p>{{ result?.GetRepairRequestById.requestUser.email }}</p>
            </div>
            <div class="flex gap-2">
              <h5 class="text-primary-text font-medium">
                {{ $t('repairRequest.role') }}:
              </h5>
              <p>{{ result?.GetRepairRequestById.requestUser.role }}</p>
            </div>
          </div>
        </div>
        <div class="items-start text-start">
          <h4 class="text-primary-text mb-1 text-xl font-bold">
            {{ $t('repairRequest.description') }}
          </h4>
          <p>{{ result?.GetRepairRequestById.description }}</p>
        </div>
      </div>
    </template>
  </Modal>
</template>

<style scoped></style>
