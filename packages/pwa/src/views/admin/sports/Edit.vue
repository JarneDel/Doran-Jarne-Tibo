<script lang="ts">
//Interfaces
interface ILoanableMaterial {
  GetSportById: Sport;
}

interface Sport {
  id: string;
  name: string;
  description: string;
}

interface ISport {
  GetSportById: [
    {
      id: string;
      name: string;
      createdAt: Date;
      updatedAt: Date;
    },
  ];
}

export interface IUpdateItem {
  id?: string;
  name?: string;
  description?: string;
}

import { computed, defineComponent, ref, watch } from 'vue';
import Modal from '@/components/Modal.vue';
import { useRouter } from 'vue-router';
import { useMutation, useQuery } from '@vue/apollo-composable';
import { UPDATE_SPORT, GET_SPORT } from '@/graphql/sport.query.ts';
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
    const { result, onResult } = useQuery<ILoanableMaterial>(GET_SPORT, { id });

    // ALL_SPORTS
    const {
      error: errorSports,
      loading: loadingSports,
      result: resultSports,
      refetch: refetchSports,
    } = useQuery<ISport>(ALL_SPORTS, {}, { fetchPolicy: 'cache-and-network' });

    const currentItem = ref<IUpdateItem>({});
    const oldResult = ref<IUpdateItem>();

    const { mutate: mutateUpdateItem } = useMutation(UPDATE_SPORT);

    const compare = (val?: IUpdateItem, oldValue?: IUpdateItem): boolean => {
      if (!val || !oldValue) return false;

      return (
        val.name !== oldValue.name || val.description !== oldValue.description
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
      setPageTitle('Edit ' + param.data.GetSportById.name);

      // Set current item
      currentItem.value = JSON.parse(JSON.stringify(param.data.GetSportById));

      // Set old result
      oldResult.value = JSON.parse(JSON.stringify(param.data.GetSportById));
    });

    const submit = () => {
      updateItem(id);
    };

    const updateItem = (id: string) => {
      // Update the item in the database
      mutateUpdateItem({
        updateSportInput: {
          id: id,
          name: currentItem.value.name,
          description: currentItem.value.description,
        },
      }).then((e) => {
        push(`/admin/sports`);
      });
    };

    const descriptionLength = computed(() => {
      if (!currentItem.value.description) return '0/250';
      return currentItem.value.description.length + '/250';
    });

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
      descriptionLength,
      id,
    };
  },
});
</script>

<template>
  <!--  Todo: popup to discard changes-->
  <Modal min-width="min-w-md" @close="push(`/admin/sports`)">
    <template v-slot:title>
      <h2
        v-if="result?.GetSportById"
        class="mr-2 w-full text-2xl font-bold text-primary-text"
      >
        {{ result.GetSportById.name }}
      </h2>
    </template>
    <template v-slot:default>
      <form v-if="result?.GetSportById" @submit.prevent="submit">
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
          <label class="text-primary-text font-medium" for="description">{{
            $t('inventory.description')
          }}</label>
          <div class="flex items-end">
            <textarea
              id="description"
              v-model="currentItem.description"
              maxlength="250"
              class="b-2 b-primary-light hover:border-primary focus:border-primary-dark focus-visible:border-primary-dark h-34 w-full resize-none rounded bg-white px-4 py-1.5 outline-none transition-colors"
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
