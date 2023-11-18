<script lang="ts">
// Interfaces
interface IRepairRequest {
  GetRepairRequestById: RepairRequest;
}

import { RepairRequest } from '@/interface/repairRequestInterface';
import { computed, defineComponent } from 'vue';
import Modal from '@/components/Modal.vue';
import { useRouter } from 'vue-router';
import { useMutation, useQuery } from '@vue/apollo-composable';
import {
  GET_ONE_REPAIR_REQUEST,
  DELETE_REPAIR_REQUEST,
} from '@/graphql/repairRequests.query.ts';
import {
  Edit2,
  Trash2,
  BadgeCheck,
  ShieldAlert,
  Warehouse,
  Box,
} from 'lucide-vue-next';
import StyledButton from '@/components/generic/StyledButton.vue';

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
  },
  name: 'Item',
  setup: () => {
    const { push, replace, currentRoute } = useRouter();
    const id = computed(() => currentRoute.value.params.id);
    // region graphql
    const { error, loading, result } = useQuery<IRepairRequest>(
      GET_ONE_REPAIR_REQUEST,
      {
        repairRequestId: id.value,
      },
      {
        fetchPolicy: 'cache-and-network',
      }
    );
    const { mutate: deleteItem } = useMutation(DELETE_REPAIR_REQUEST);

    const deleteItemWithConfirmation = (repairRequestId: string) => {
      if (!confirm('Are you sure you want to delete this item?')) return;
      deleteItem({ repairRequestId }).then((e) => {
        replace('/admin/repair-requests');
      });
    };

    return {
      push,
      result,
      error,
      loading,
      deleteItemWithConfirmation,
    };
  },
});
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
        <h3 class="mb-2 mr-2 text-2xl font-bold text-primary-text">
          {{ result?.GetRepairRequestById.title }}
        </h3>
        <ShieldAlert
          class="w-8 h-8 mr-2"
          :class="{
            'text-yellow-300': result?.GetRepairRequestById.urgency == 1,
            'text-orange-500': result?.GetRepairRequestById.urgency == 2,
            'text-red-600': result?.GetRepairRequestById.urgency == 3,
            hidden: result?.GetRepairRequestById.isRepaired,
          }"
        />
        <BadgeCheck
          class="w-8 h-8 mr-2 text-green-600"
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
                  '/edit'
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
          <div class="flex items-center">
            <Box
              class="w-8 h-8 mr-2 opacity-10"
              :class="{
                'opacity-100': result?.GetRepairRequestById.loanableMaterial,
              }"
            />
            <ul class="flex flex-wrap">
              <li
                v-if="
                  Array.isArray(result?.GetRepairRequestById.loanableMaterial)
                "
              >
                <template
                  v-if="result?.GetRepairRequestById.loanableMaterial.length"
                  v-for="(loanableMaterial, index) in result
                    ?.GetRepairRequestById.loanableMaterial"
                >
                  {{ loanableMaterial.name }}
                  <span
                    v-if="
                      index !==
                      result?.GetRepairRequestById.loanableMaterial.length - 1
                    "
                    class="mr-1"
                    >,</span
                  >
                </template>
              </li>
              <li v-else>
                {{ result?.GetRepairRequestById.loanableMaterial }}
              </li>
            </ul>
          </div>
          <div class="flex items-center">
            <Warehouse
              class="w-8 h-8 mr-2 opacity-10"
              :class="{ 'opacity-100': result?.GetRepairRequestById.room }"
            />
            <ul v-if="Array.isArray(result?.GetRepairRequestById.room)">
              <li
                v-if="result?.GetRepairRequestById.room.length"
                v-for="(room, index) in result?.GetRepairRequestById.room"
                :key="index"
              >
                {{ room.name }}
                <span
                  v-if="index !== result?.GetRepairRequestById.room.length - 1"
                  class="mr-1"
                  >,</span
                >
              </li>
            </ul>
            <p v-else>{{ result?.GetRepairRequestById.room }}</p>
          </div>
        </div>
        <div class="flex flex-col text-left">
          <h4 class="font-bold text-xl mb-1 text-primary-text">
            {{ $t('repairRequest.requester') }}
          </h4>
          <div class="flex flex-col">
            <div class="flex gap-2">
              <h5 class="font-medium text-primary-text">
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
              <h5 class="font-medium text-primary-text">
                {{ $t('repairRequest.email') }}:
              </h5>
              <p>{{ result?.GetRepairRequestById.requestUser.email }}</p>
            </div>
            <div class="flex gap-2">
              <h5 class="font-medium text-primary-text">
                {{ $t('repairRequest.role') }}:
              </h5>
              <p>{{ result?.GetRepairRequestById.requestUser.role }}</p>
            </div>
          </div>
        </div>
        <div class="items-start text-start">
          <h4 class="font-bold text-xl mb-1 text-primary-text">
            {{ $t('repairRequest.description') }}
          </h4>
          <p>{{ result?.GetRepairRequestById.description }}</p>
        </div>
      </div>
    </template>
  </Modal>
</template>

<style scoped></style>
