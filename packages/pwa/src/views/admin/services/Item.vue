<script lang="ts">
import { computed, defineComponent } from 'vue';
import Modal from '@/components/Modal.vue';
import { useRouter } from 'vue-router';
import { useMutation, useQuery } from '@vue/apollo-composable';
import Modal from '@/components/modal/Modal.vue'
import {
  DELETE_SERVICE,
  GET_SERVICE,
  IGetService,
} from '@/graphql/service.query.ts';
import { Edit2, Trash2 } from 'lucide-vue-next';
import StyledButton from '@/components/generic/StyledButton.vue';
import StyledLable from '@/components/generic/StyledLable.vue';

export default defineComponent({
  components: {
    StyledButton,
    Modal,
    Edit2,
    Trash: Trash2,
    StyledLable,
  },
  name: 'Item',
  setup: () => {
    const { push, replace, currentRoute } = useRouter();
    const id = computed(() => currentRoute.value.params.id);
    // region graphql
    const { error, loading, result } = useQuery<IGetService>(
      GET_SERVICE,
      {
        id: id.value,
      },
      {
        fetchPolicy: 'cache-and-network',
      },
    );
    const { mutate: deleteItem } = useMutation(DELETE_SERVICE);

    const deleteItemWithConfirmation = (id: string) => {
      if (!confirm('Are you sure you want to delete this service?')) return;
      deleteItem({ id }).then(() => {
        replace('/admin/services');
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
  <Modal max-width="max-w-md" @close="push('/admin/services')">
    <template v-slot:title>
      <div class="flex w-full flex-row items-center justify-between">
        <h2 v-if="loading" class="mr-2 w-full text-lg font-bold">Loading...</h2>
        <h2
          v-if="!result?.service && !loading"
          class="mr-2 w-full text-lg font-bold"
        >
          No item found with this id
        </h2>
        <h3 class="text-primary-text mr-4 text-2xl font-bold">
          {{ result?.service.name }}
        </h3>
        <div>
          <button
            v-if="result?.service"
            class="bg-danger-surface hover:bg-danger-light active:bg-danger-light mr-2 self-end rounded-full p-2 transition-colors duration-100 ease-in-out"
            @click="deleteItemWithConfirmation(result?.service.id)"
          >
            <Trash :size="20" />
          </button>
          <button
            v-if="result?.service"
            class="bg-primary-surface hover:bg-primary-surface/80 active:bg-primary-surface/60 mr-2 self-end rounded-full p-2"
            @click="push('/admin/services/id/' + result?.service.id + '/edit')"
          >
            <Edit2 :size="20" />
          </button>
        </div>
      </div>
    </template>
    <template v-slot:default>
      <div>
        <div class="flex flex-col gap-1">
          <h4 class="font-medium text-primary-text">
            {{ $t('service.rooms') }}:
          </h4>
          <ul class="flex flex-wrap gap-x-2 gap-y-1">
            <StyledLable type="room" v-for="room in result?.service.rooms">
              {{ room.name }}
            </StyledLable>
          </ul>
        </div>
        <div>
          <div class="flex gap-1">
            <h4 class="font-medium text-primary-text">
              {{ $t('service.staff') }}:
            </h4>
            <p class="">{{ result?.service.staff.length }}</p>
          </div>
        </div>
        <div>
          <div>
            <h4 class="font-medium text-primary-text">
              {{ $t('service.description') }}:
            </h4>
            <p class="">{{ result?.service.description }}</p>
          </div>
        </div>
      </div>
    </template>
  </Modal>
</template>

<style scoped></style>
