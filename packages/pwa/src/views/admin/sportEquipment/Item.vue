<script lang="ts">
//Interfaces
interface ILoanableMaterial {
  GetloanableMaterialById: LoanableMaterial;
}

interface LoanableMaterial {
  id: string;
  name: string;
  totalAmount: number;
  wantedAmount: number;
  price: number;
  sports: [{ id: string; name: string; createdAt: Date; updatedAt: Date }];
  isComplete: boolean;
  description: string;
}

import { computed, defineComponent, ref, watch } from 'vue';
import Modal from '@/components/Modal.vue';
import { useRouter } from 'vue-router';
import { useMutation, useQuery } from '@vue/apollo-composable';
import {
  GET_LOANABLE_MATERIAL,
  REMOVE_LOANABLE_MATERIAL,
} from '@/graphql/loanableMaterials.query.ts';
import { Edit2, Trash2 } from 'lucide-vue-next';
import StyledButton from '@/components/generic/StyledButton.vue';
import useA11y from '@/composables/useA11y.ts';

export default defineComponent({
  components: {
    StyledButton,
    Modal,
    Edit2,
    Trash: Trash2,
  },
  name: 'Item',
  setup: () => {
    const progressbar = ref<HTMLDivElement | null>(null);

    const { push, replace, currentRoute } = useRouter();
    const { setPageTitle } = useA11y();
    const id = computed(() => currentRoute.value.params.id);
    // region graphql
    const { error, loading, result, onResult } = useQuery<ILoanableMaterial>(
      GET_LOANABLE_MATERIAL,
      {
        id: id.value,
      }
    );
    const { mutate: deleteItem } = useMutation(REMOVE_LOANABLE_MATERIAL);

    const widthPercentage = computed(() => {
      console.log(result.value);
      if (!result.value?.GetloanableMaterialById.wantedAmount) return 0;
      if (result.value.GetloanableMaterialById.totalAmount === 0) return 0;
      if (
        result.value.GetloanableMaterialById.totalAmount >
        result.value.GetloanableMaterialById.wantedAmount
      )
        return 100;
      return (
        (result.value?.GetloanableMaterialById.totalAmount /
          result.value?.GetloanableMaterialById.wantedAmount) *
        100
      );
    });

    watch(progressbar, () => {
      if (!progressbar.value) return;
      if (!widthPercentage.value) return;
      console.log(widthPercentage.value);
      if ('style' in progressbar.value) {
        progressbar.value.style.width = widthPercentage.value + '%';
      }
    });

    const deleteItemWithConfirmation = (id: string) => {
      if (!confirm('Are you sure you want to delete this item?')) return;
      deleteItem({ id }).then((e) => {
        replace('/admin/sport-equipment');
      });
    };
    onResult((e) => {
      if (e?.data?.GetloanableMaterialById.name) {
        setPageTitle(e.data.GetloanableMaterialById.name);
      }
    });

    return {
      push,
      result,
      error,
      loading,
      progressbar,
      widthPercentage,
      deleteItemWithConfirmation,
    };
  },
});
</script>

<template>
  <Modal max-width="max-w-xl" @close="push('/admin/sport-equipment')">
    <template v-slot:title>
      <div class="flex w-full flex-row items-center justify-between">
        <h2 class="mr-2 w-full">
          <span class="text-xl font-bold">
            {{ result?.GetloanableMaterialById.name }}
          </span>
          <span class="text-base">
            -
            {{
              result?.GetloanableMaterialById.sports.forEach(
                (e) => e.name + ' '
              )
            }}
          </span>
        </h2>
        <button
          v-if="result?.GetloanableMaterialById"
          class="bg-danger-surface hover:bg-danger-light active:bg-danger-light mr-2 self-end rounded-full p-2 transition-colors duration-100 ease-in-out"
          @click="
            deleteItemWithConfirmation(result?.GetloanableMaterialById.id)
          "
        >
          <trash :size="20" />
        </button>
        <button
          class="bg-primary-surface hover:bg-primary-surface/80 active:bg-primary-surface/60 mr-2 self-end rounded-full p-2"
          @click="
            push(
              '/admin/sport-equipment/id/' +
                result?.GetloanableMaterialById.id +
                '/edit'
            )
          "
        >
          <Edit2 :size="20" />
        </button>
        <div></div>
      </div>
    </template>
    <template v-slot:default>
      <div v-if="result">
        <div>{{ result.GetloanableMaterialById.description }}</div>

        <div class="mt-2 flex w-1/2 flex-row items-center justify-between">
          <div>
            <div class="text-gray-6">{{ $t('inventory.amount') }}</div>
            <div class="text-bold text-lg">
              {{ result.GetloanableMaterialById.totalAmount }}
            </div>
          </div>
          <div>
            <div class="text-gray-6">{{ $t('inventory.idealStock') }}</div>
            <div class="text-bold text-right text-lg">
              {{ result.GetloanableMaterialById.wantedAmount }}
            </div>
          </div>
        </div>

        <div class="bg-primary-light h-3 w-1/2 rounded-full">
          <div ref="progressbar" class="bg-primary h-3 w-0 rounded-full"></div>
        </div>

        <!--        <div v-if='success' ></div>-->
      </div>
    </template>
    <template v-slot:actions>
      <StyledButton :px="2" :py="1" button-type="danger"
        >Report broken / missing item</StyledButton
      >
    </template>
  </Modal>
</template>

<style scoped></style>
