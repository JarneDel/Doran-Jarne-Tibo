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

import { computed, defineComponent, ref, watch } from 'vue'
import Modal from '@/components/modal/Modal.vue'
import { useRouter } from 'vue-router'
import { useMutation, useQuery } from '@vue/apollo-composable'
import {
  GET_LOANABLE_MATERIAL,
  REMOVE_LOANABLE_MATERIAL,
} from '@/graphql/loanableMaterials.query.ts';
import { Edit2, Trash2 } from 'lucide-vue-next';
import StyledButton from '@/components/generic/StyledButton.vue';
import useA11y from '@/composables/useA11y.ts';
import StyledLable from '@/components/generic/StyledLable.vue';

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
        <h2 class="text-primary-text font-bold text-xl mr-2 w-full">
          <span class="text-xl font-bold">
            {{ result?.GetloanableMaterialById.name }}
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
        <div>
          <h4 class="text-primary-text font-medium">
            {{ $t('inventory.description') }}
          </h4>
          <div>{{ result.GetloanableMaterialById.description }}</div>
        </div>

        <div>
          <h4 class="text-primary-text font-medium">
            {{ $t('sportEquipment.sports') }}
          </h4>
          <ul class="flex flex-wrap gap-x-2 gap-y-1">
            <StyledLable
              type="sport"
              v-for="sport in result?.GetloanableMaterialById.sports"
              :key="sport.name"
            >
              {{ sport.name }}
            </StyledLable>
          </ul>
        </div>

        <div>
          <h4 class="text-primary-text font-medium">
            {{ $t('inventory.pricePerHour') }}
          </h4>
          <div>€ {{ result.GetloanableMaterialById.price }}</div>
        </div>

        <div>
          <div class="mt-2 flex flex-row items-center justify-between">
            <div>
              <h4 class="text-primary-text font-medium">
                {{ $t('inventory.amount') }}
              </h4>
              <div class="text-bold text-lg">
                {{ result.GetloanableMaterialById.totalAmount }}
              </div>
            </div>
            <div>
              <h4 class="text-primary-text font-medium">
                {{ $t('inventory.idealStock') }}
              </h4>
              <div class="text-bold text-right text-lg">
                {{ result.GetloanableMaterialById.wantedAmount }}
              </div>
            </div>
          </div>

          <div class="bg-primary-light h-3 rounded-full">
            <div
              ref="progressbar"
              class="bg-primary h-3 w-0 rounded-full"
            ></div>
          </div>
        </div>
      </div>
    </template>
    <template v-slot:actions>
      <!-- <StyledButton :px="2" :py="1" button-type="danger"
        >Report broken / missing item</StyledButton
      > -->
    </template>
  </Modal>
</template>

<style scoped></style>
