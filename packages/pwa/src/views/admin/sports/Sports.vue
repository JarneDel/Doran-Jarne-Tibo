<script lang="ts">
// Interfaces
interface Sports {
  GetAllSports: [
    {
      id: string;
      name: string;
      createdAt: string;
      updatedAt: string;
    },
  ];
}

// Imports
import { useQuery } from '@vue/apollo-composable';
import { ALL_SPORTS } from '@/graphql/sport.query';
import { defineComponent, ref, watch } from 'vue';
import UseFirebase from '../../../composables/useFirebase';
import { PlusCircle } from 'lucide-vue-next';
import Modal from '@/components/Modal.vue';
import DoubleClickEdit from '@/components/generic/DoubleClickEdit.vue';
import useLastRoute from '@/composables/useLastRoute';
import { useRouter } from 'vue-router';
import StyledButton from '@/components/generic/StyledButton.vue';

// Export default
export default defineComponent({
  components: {
    PlusCircle,
    StyledButton,
    Modal,
    DoubleClickEdit,
  },
  setup() {
    // Router
    const { push } = useRouter();
    // Firebase
    const { firebaseUser } = UseFirebase();
    const idToken = ref();
    const getIdToken = async () => {
      idToken.value = await firebaseUser.value?.getIdToken();
    };
    getIdToken();
    // All sports
    const {
      loading: loadingSports,
      result: resultSports,
      error: errorSports,
      refetch: refetchSports,
    } = useQuery<Sports>(ALL_SPORTS, {}, { fetchPolicy: 'cache-and-network' });

    const { lastRoute } = useLastRoute();

    watch(
      lastRoute,
      (value) => {
        if (value.startsWith('/admin/sports/id/')) {
          fetchWithFilters();
        }
      },
      { immediate: true },
    );

    const fetchWithFilters = () => {
      refetchSports();
    };

    return {
      idToken,
      resultSports,
      loadingSports,
      errorSports,
      push,
    };
  },
});
</script>

<template>
  <div class="m-8">
    <div class="m-auto max-w-4xl">
      <div class="flex justify-between">
        <h1 class="text-3xl font-bold xl:text-4xl">Sports</h1>
        <StyledButton type="button" @click="push('/admin/sports/create')">
          {{ $t('inventory.new') }}
        </StyledButton>
      </div>
      <ul
        class="my-2 flex flex-wrap justify-between gap-4 md:my-4 lg:my-6 xl:my-8"
      >
        <li v-for="sport in resultSports?.GetAllSports">
          <button
            :key="sport.id"
            :id="sport.id"
            :name="sport.name"
            @click="push('/admin/sports/id/' + sport.id)"
            class="text-primary-text flex h-20 w-40 items-center justify-center rounded-md bg-white text-center text-xl font-bold shadow-md"
          >
            {{ sport.name }}
          </button>
        </li>
      </ul>
    </div>
    <RouterView />
  </div>
</template>

<style scoped></style>
