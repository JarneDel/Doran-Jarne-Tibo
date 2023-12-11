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

interface ISport {
  GetAllSports: [
    {
      id: string;
      name: string;
      createdAt: Date;
      updatedAt: Date;
    },
  ];
}

interface Sport {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface IUpdateItem {
  id?: string;
  name?: string;
  totalAmount?: number;
  wantedAmount?: number;
  price?: number;
  sports?: Sport[];
  isComplete?: boolean;
  description?: string;
}

import { computed, defineComponent, ref, watch } from 'vue';
import Modal from '@/components/Modal.vue';
import { useRouter } from 'vue-router';
import { useMutation, useQuery } from '@vue/apollo-composable';
import {
  UPDATE_LOABALE_MATERIAL,
  GET_LOANABLE_MATERIAL,
} from '@/graphql/loanableMaterials.query.ts';
import { ALL_SPORTS } from '@/graphql/sport.query.ts';
import StyledInputText from '@/components/generic/StyledInputText.vue';
import StyledButton from '@/components/generic/StyledButton.vue';
import useA11y from '@/composables/useA11y.ts';

export default defineComponent({
  name: 'Edit',
  components: { StyledButton, StyledInputText, Modal },
  setup() {
    const { push, currentRoute } = useRouter();
    const id = currentRoute.value.params.id as string;
    const { setPageTitle } = useA11y();
    const { result, onResult } = useQuery<ILoanableMaterial>(
      GET_LOANABLE_MATERIAL,
      { id },
    );

    // ALL_SPORTS
    const {
      error: errorSports,
      loading: loadingSports,
      result: resultSports,
      refetch: refetchSports,
    } = useQuery<ISport>(ALL_SPORTS, {}, { fetchPolicy: 'cache-and-network' });

    const currentItem = ref<IUpdateItem>({});
    const oldResult = ref<IUpdateItem>();

    const { mutate: mutateUpdateItem } = useMutation(UPDATE_LOABALE_MATERIAL);

    const compare = (val?: IUpdateItem, oldValue?: IUpdateItem): boolean => {
      if (!val || !oldValue) return false;

      // Compare the sports appart, because they are an array of objects
      // And .map() creates a new array, so it will always be different
      const sportsEqual =
        JSON.stringify(val.sports?.map((sport) => sport.id)) ===
        JSON.stringify(oldValue.sports?.map((sport) => sport.id));

      return (
        val.name !== oldValue.name ||
        val.totalAmount != oldValue.totalAmount ||
        val.wantedAmount != oldValue.wantedAmount ||
        val.price != oldValue.price ||
        !sportsEqual ||
        val.isComplete !== oldValue.isComplete ||
        val.description !== oldValue.description
      );
    };

    // Watch the current item for changes
    watch(
      currentItem,
      (value) => {
        if (!oldResult.value) return;
        hasChanged.value = compare(value, oldResult.value);
      },
      { deep: true },
    );

    const hasChanged = ref<boolean>(false);
    onResult((param) => {
      // Set page title
      setPageTitle('Edit ' + param.data.GetloanableMaterialById.name);

      // Set current item
      currentItem.value = JSON.parse(
        JSON.stringify(param.data.GetloanableMaterialById),
      );

      // Set old result
      oldResult.value = JSON.parse(
        JSON.stringify(param.data.GetloanableMaterialById),
      );
    });

    const submit = () => {
      updateItem(id);
    };

    const updateItem = (id: string) => {
      // Update the item in the database
      mutateUpdateItem({
        updateLoanableMaterialInput: {
          _id: id,
          name: currentItem.value.name,
          totalAmount: Number(currentItem.value.totalAmount),
          wantedAmount: Number(currentItem.value.wantedAmount),
          price: Number(currentItem.value.price),
          SportId: currentItem.value.sports?.map((sport) => {
            return sport.id;
          }),
          isComplete: currentItem.value.isComplete,
          description: currentItem.value.description,
        },
      }).then((e) => {
        push(`/admin/sport-equipment`);
      });
    };

    const descriptionLength = computed(() => {
      if (!currentItem.value.description) return '0/250';
      return currentItem.value.description.length + '/250';
    });

    const isSportSelected = (sportId: string) => {
      return (
        currentItem.value.sports?.some((sport) => sport.id === sportId) || false
      );
    };
    const toggleSportSelection = (sportId: string) => {
      const selectedSports = currentItem.value.sports || [];
      const index = selectedSports.findIndex((sport) => sport.id === sportId);

      if (index === -1) {
        // Sport not found, add it
        const sport = resultSports.value?.GetAllSports.find(
          (sport) => sport.id === sportId,
        );

        if (!sport) return;

        // Convert Date properties to strings
        currentItem.value.sports = [
          ...selectedSports,
          {
            id: sport.id,
            name: sport.name,
            createdAt: sport.createdAt.toString(),
            updatedAt: sport.updatedAt.toString(),
          },
        ];
      } else {
        // Sport found, remove it
        if (!currentItem.value.sports) return;
        currentItem.value.sports.splice(index, 1);
      }
    };

    return {
      push,
      submit,
      result,
      errorSports,
      loadingSports,
      resultSports,
      refetchSports,
      currentItem,
      hasChanged,
      isSportSelected,
      toggleSportSelection,
      descriptionLength,
      id,
    };
  },
});
</script>

<template>
  <!--  Todo: popup to discard changes-->
  <Modal min-width="min-w-md" @close="push(`/admin/sport-equipment`)">
    <template v-slot:title>
      <h2 v-if="result?.GetloanableMaterialById" class="mr-2 w-full">
        <!--        <span>{{ $t('edit.edit') }}</span>-->
        <span class="text-lg font-bold">
          {{ result.GetloanableMaterialById.name }}
        </span>
      </h2>
    </template>
    <template v-slot:default>
      <form v-if="result?.GetloanableMaterialById" @submit.prevent="submit">
        <StyledInputText
          v-model="currentItem.name"
          :label="$t('inventory.name')"
          :maxlength="20"
        />
        <label
          :title="$t('inventory.description')"
          class="mt-2 block"
          for="description"
        >
          <span class="text-primary-text font-medium">{{
            $t('inventory.description')
          }}</span>
          <div class="flex items-end">
            <textarea
              v-model="currentItem.description"
              maxlength="250"
              class="b-2 b-primary-light hover:border-primary focus:border-primary-dark focus-visible:border-primary-dark h-24 w-full resize-none rounded bg-white px-4 py-1.5 outline-none transition-colors"
            ></textarea>
            <div
              v-if="currentItem.description"
              class="relative w-0 -left-12 opacity-60"
              :class="{
                '-left-14': currentItem.description.length >= 10,
                '-left-16': currentItem.description.length >= 100,
              }"
            >
              {{ descriptionLength }}
            </div>
          </div>
        </label>
        <StyledInputText
          v-model="currentItem.totalAmount"
          :label="$t('inventory.amount')"
          :min="0"
          type="number"
        />
        <StyledInputText
          v-model="currentItem.wantedAmount"
          :label="$t('inventory.idealStock')"
          :min="0"
          type="number"
        />
        <StyledInputText
          v-model="currentItem.price"
          :label="$t('inventory.pricePerHour') + '(€)'"
          :min="0"
          type="number"
        />
        <div>
          <h4 class="text-primary-text font-medium">
            {{ $t('rooms.selectTheCorrectSports') }}
          </h4>
          <div class="grid grid-cols-1 gap-1 sm:grid-cols-2 md:grid-cols-3">
            <div
              v-for="sport in resultSports?.GetAllSports"
              :key="sport.id"
              class="flex items-center gap-2"
            >
              <input
                type="checkbox"
                :id="sport.id"
                :name="sport.id"
                :checked="isSportSelected(sport.id)"
                @change="toggleSportSelection(sport.id)"
              />
              <label :for="sport.id" class="select-none">{{
                sport.name
              }}</label>
            </div>
          </div>
        </div>
        <div class="flex justify-end">
          <StyledButton
            :disabled="!hasChanged"
            button-type="secondary"
            class="mt4"
            type="submit"
          >
            {{ $t('item.edit.modify') }}
          </StyledButton>
        </div>
      </form>
    </template>
  </Modal>
</template>

<style scoped></style>
