<script lang="ts">
export interface IUpdateItem {
  id?: string;
  name?: string;
  description?: string;
  staff?: [
    {
      id?: string;
      UID?: string;
      locale?: string;
      role?: string;
      profilePictureUrl?: string;
      firstName?: string;
      lastName?: string;
      email?: string;
      phone?: string;
    },
  ];
  rooms?: [
    {
      id?: string;
      name?: string;
      sports?: {
        id?: string;
        name?: string;
        description?: string;
      };
      pricePerHour?: number;
      type?: string;
      canBeUsed?: boolean;
    },
  ];
}

import { computed, defineComponent, ref, watch } from 'vue';
import Modal from '@/components/Modal.vue';
import { useRouter } from 'vue-router';
import { useMutation, useQuery } from '@vue/apollo-composable';
import {
  GET_SERVICE,
  IGetService,
  UPDATE_SERVICE,
} from '@/graphql/service.query.ts';
import { ALL_ROOMS, IRoom } from '@/graphql/room.query.ts';
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
    const { result, onResult } = useQuery<IGetService>(GET_SERVICE, {
      id,
    });

    // ALL_ROOMS
    const {
      error: errorRooms,
      loading: loadingRooms,
      result: resultRooms,
    } = useQuery<IRoom>(ALL_ROOMS, {}, { fetchPolicy: 'cache-and-network' });

    const currentItem = ref<IUpdateItem>({});
    const oldResult = ref<IUpdateItem>();

    const { mutate: mutateUpdateItem } = useMutation(UPDATE_SERVICE);

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
      setPageTitle('Edit ' + param.data.service.name);

      // Set current item
      currentItem.value = JSON.parse(JSON.stringify(param.data.service));

      // Set old result
      oldResult.value = JSON.parse(JSON.stringify(param.data.service));
    });

    const submit = () => {
      updateItem(id);
    };

    const updateItem = (id: string) => {
      // Update the item in the database
      mutateUpdateItem({
        updateServiceInput: {
          id: id,
          name: currentItem.value.name,
          description: currentItem.value.description,
          staffUID: currentItem.value.staff?.map((staff) => staff.UID),
          roomId: currentItem.value.rooms?.map((room) => room.id),
        },
      }).then((e) => {
        push(`/admin/services`);
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
      errorRooms,
      resultRooms,
      loadingRooms,
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
        v-if="result?.service"
        class="mr-2 w-full text-2xl font-bold text-primary-text"
      >
        {{ result.service.name }}
      </h2>
    </template>
    <template v-slot:default>
      <form v-if="result?.service" @submit.prevent="submit">
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
