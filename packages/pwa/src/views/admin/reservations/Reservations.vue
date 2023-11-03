<script lang="ts">
// Interfaces
interface Room {
  id: string;
  name: string;
  sports: Sport[];
  pricePerHour: number;
  type: string;
  createdAt: string;
  updatedAt: string;
}
interface IRooms {
  GetAllGyms: [Room];
  GetAllWorkRooms: [Room];
  GetAllChangingRooms: [Room];
  GetAllSwimmingPools: [Room];
  GetAllDivePools: [Room];
}

interface Sport {
  id: string;
  name: string;
}

// Imports
import { useQuery } from '@vue/apollo-composable';
import {
  ALL_GYMS,
  ALL_WORK_ROOMS,
  ALL_CHANGING_ROOMS,
  ALL_SWIMMING_POOLS,
  ALL_DIVE_POOLS,
} from '../../../graphql/room.query';
import { computed, defineComponent, ref } from 'vue';
import UseFirebase from '../../../composables/useFirebase';
import Modal from '@/components/Modal.vue';
import { useRouter } from 'vue-router';
import DoubleClickEdit from '@/components/generic/DoubleClickEdit.vue';

// Export default
export default defineComponent({
  components: {
    Modal,
    DoubleClickEdit,
  },
  setup() {
    // Router
    const { push, replace, currentRoute } = useRouter();
    // Firebase
    const { firebaseUser } = UseFirebase();
    const idToken = ref();
    const getIdToken = async () => {
      idToken.value = await firebaseUser.value?.getIdToken();
    };
    getIdToken();

    // ALL ROOMS
    const {
      loading: loadingGyms,
      result: resultGyms,
      error: errorGyms,
      refetch: refetchGyms,
    } = useQuery<IRooms>(
      ALL_GYMS,
      {},
      {
        fetchPolicy: 'no-cache',
      }
    );
    const {
      loading: loadingWorkRooms,
      result: resultWorkRooms,
      error: errorWorkRooms,
      refetch: refetchWorkRooms,
    } = useQuery<IRooms>(
      ALL_WORK_ROOMS,
      {},
      {
        fetchPolicy: 'no-cache',
      }
    );
    const {
      loading: loadingChangingRooms,
      result: resultChangingRooms,
      error: errorChangingRooms,
      refetch: refetchChangingRooms,
    } = useQuery<IRooms>(
      ALL_CHANGING_ROOMS,
      {},
      {
        fetchPolicy: 'no-cache',
      }
    );
    const {
      loading: loadingSwimmingPools,
      result: resultSwimmingPools,
      error: errorSwimmingPools,
      refetch: refetchSwimmingPools,
    } = useQuery<IRooms>(
      ALL_SWIMMING_POOLS,
      {},
      {
        fetchPolicy: 'no-cache',
      }
    );
    const {
      loading: loadingDivePools,
      result: resultDivePools,
      error: errorDivePools,
      refetch: refetchDivePools,
    } = useQuery<IRooms>(
      ALL_DIVE_POOLS,
      {},
      {
        fetchPolicy: 'no-cache',
      }
    );

    const fetchWithFilters = () => {
      console.log('fetchWithFilters');
      console.log(typeSelector.value);
      if (typeSelector.value == 0) {
        refetchGyms();
      } else if (typeSelector.value == 1) {
        refetchWorkRooms();
      } else if (typeSelector.value == 2) {
        refetchChangingRooms();
      } else if (typeSelector.value == 3) {
        refetchSwimmingPools();
      } else if (typeSelector.value == 4) {
        refetchDivePools();
      }
    };

    // Selector type of room
    let typeSelector = ref(0);

    const type = computed(() => currentRoute.value.params.type);
    if (type.value !== undefined) typeSelector.value = Number(type.value);
    else push('/admin/reservations/type/0');

    return {
      idToken,
      resultGyms,
      loadingGyms,
      errorGyms,
      resultWorkRooms,
      loadingWorkRooms,
      errorWorkRooms,
      resultChangingRooms,
      loadingChangingRooms,
      errorChangingRooms,
      resultSwimmingPools,
      loadingSwimmingPools,
      errorSwimmingPools,
      resultDivePools,
      loadingDivePools,
      errorDivePools,
      typeSelector,
      push,
      replace,
      currentRoute,
      fetchWithFilters,
    };
  },
});
</script>

<template>
  <div class="m-8">
    <div class="flex items-center justify-center">
      <button
        @click="
          replace('/admin/reservations/type/0');
          typeSelector = 0;
        "
        :class="{
          'bg-secondary ': typeSelector === 0,
          'bg-primary-light': typeSelector !== 0,
        }"
        class="p-2"
      >
        {{ $t('rooms.gyms') }}
      </button>
      <button
        @click="
          replace('/admin/reservations/type/1');
          typeSelector = 1;
        "
        :class="{
          'bg-secondary ': typeSelector === 1,
          'bg-primary-light': typeSelector !== 1,
        }"
        class="p-2"
      >
        {{ $t('rooms.workRooms') }}
      </button>
      <button
        @click="
          replace('/admin/reservations/type/2');
          typeSelector = 2;
        "
        :class="{
          'bg-secondary ': typeSelector === 2,
          'bg-primary-light': typeSelector !== 2,
        }"
        class="p-2"
      >
        {{ $t('rooms.dressingRooms') }}
      </button>
      <button
        @click="
          replace('/admin/reservations/type/3');
          typeSelector = 3;
        "
        :class="{
          'bg-secondary ': typeSelector === 3,
          'bg-primary-light': typeSelector !== 3,
        }"
        class="p-2"
      >
        {{ $t('rooms.swimmingPools') }}
      </button>
      <button
        @click="
          replace('/admin/reservations/type/4');
          typeSelector = 4;
        "
        :class="{
          'bg-secondary ': typeSelector === 4,
          'bg-primary-light': typeSelector !== 4,
        }"
        class="p-2"
      >
        {{ $t('rooms.divingWells') }}
      </button>
    </div>
    <div class="flex flex-col gap-20">
      <RouterView />
    </div>
  </div>
</template>

<style scoped></style>
