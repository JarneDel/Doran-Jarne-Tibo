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

interface Sports {
  GetAllSports: [
    {
      id: string;
      name: string;
      createdAt: string;
      updatedAt: string;
    }
  ];
}

// Imports
import { useQuery, useMutation } from '@vue/apollo-composable';
import { ALL_SPORTS } from '@/graphql/sport.query';
import {
  ALL_GYMS,
  ALL_WORK_ROOMS,
  ALL_CHANGING_ROOMS,
  ALL_SWIMMING_POOLS,
  ALL_DIVE_POOLS,
  UPDATE_ROOM,
} from '../../../graphql/room.query';
import { computed, defineComponent, ref, watch } from 'vue';
import UseFirebase from '../../../composables/useFirebase';
import { PlusCircle } from 'lucide-vue-next';
import Modal from '@/components/Modal.vue';
import { useRouter } from 'vue-router';
import DoubleClickEdit from '@/components/generic/DoubleClickEdit.vue';
import useLastRoute from '@/composables/useLastRoute';

// Export default
export default defineComponent({
  components: {
    PlusCircle,
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
    // All sports
    const {
      loading: loadingSports,
      result: resultSports,
      error: errorSports,
    } = useQuery<Sports>(ALL_SPORTS);
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

    // Mutation
    const { mutate } = useMutation(UPDATE_ROOM);

    // Selector type of room
    let typeSelector = ref(0);

    const type = computed(() => currentRoute.value.params.type);
    if (type.value !== undefined) typeSelector.value = Number(type.value);
    else push('/admin/rooms/type/0');

    const { lastRoute } = useLastRoute();

    watch(
      lastRoute,
      (value) => {
        if (value.startsWith('/admin/rooms/id/')) {
          fetchWithFilters();
        }
      },
      { immediate: true }
    );

    const fetchWithFilters = () => {
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

    // Modal
    const isOpen = ref(false);
    const currentRoom = ref<Room>({
      id: '',
      name: '',
      sports: [
        {
          id: '',
          name: '',
        },
      ],
      pricePerHour: 0,
      type: '',
      createdAt: '',
      updatedAt: '',
    });

    const handleCloseModal = () => {
      // toggle modal
      isOpen.value = !isOpen.value;

      // Convert sports to sportIds
      let SportIds: String[] = [];
      currentRoom.value.sports.forEach((sport) => {
        SportIds.push(sport.id);
      });

      // Save changes
      mutate({
        updateRoomInput: {
          _id: currentRoom.value.id,
          name: currentRoom.value.name,
          SportId: SportIds,
          pricePerHour: currentRoom.value.pricePerHour,
          type: currentRoom.value.type,
        },
      });
    };

    const handleRoomDetail = (room: Room) => {
      push(`/admin/rooms/id/${room.id}`);
    };

    return {
      idToken,
      resultSports,
      loadingSports,
      errorSports,
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
      isOpen,
      currentRoom,
      handleRoomDetail,
      handleCloseModal,
      push,
      replace,
      currentRoute,
      mutate,
    };
  },
});
</script>

<template>
  <div class="m-8">
    <div class="flex flex-col items-center justify-center md:flex-row">
      <button
        @click="replace('/admin/rooms/type/0'), (typeSelector = 0)"
        :class="{
          'bg-secondary': typeSelector === 0,
          'bg-primary-light': typeSelector !== 0,
        }"
        class="w-30 rounded-l-md p-2 hover:text-white"
      >
        {{ $t('rooms.gyms') }}
      </button>
      <button
        @click="replace('/admin/rooms/type/1'), (typeSelector = 1)"
        :class="{
          'bg-secondary ': typeSelector === 1,
          'bg-primary-light': typeSelector !== 1,
        }"
        class="w-30 p-2 hover:text-white"
      >
        {{ $t('rooms.workRooms') }}
      </button>
      <button
        @click="replace('/admin/rooms/type/2'), (typeSelector = 2)"
        :class="{
          'bg-secondary ': typeSelector === 2,
          'bg-primary-light': typeSelector !== 2,
        }"
        class="w-30 p-2 hover:text-white"
      >
        {{ $t('rooms.dressingRooms') }}
      </button>
      <button
        @click="replace('/admin/rooms/type/3'), (typeSelector = 3)"
        :class="{
          'bg-secondary ': typeSelector === 3,
          'bg-primary-light': typeSelector !== 3,
        }"
        class="w-30 p-2 hover:text-white"
      >
        {{ $t('rooms.swimmingPools') }}
      </button>
      <button
        @click="replace('/admin/rooms/type/4'), (typeSelector = 4)"
        :class="{
          'bg-secondary ': typeSelector === 4,
          'bg-primary-light': typeSelector !== 4,
        }"
        class="w-30 rounded-r-md p-2 hover:text-white"
      >
        {{ $t('rooms.divingWells') }}
      </button>
    </div>
    <div class="flex flex-col gap-20">
      <div v-if="typeSelector == 0">
        <h3
          class="mb-2 py-4 text-center text-3xl font-bold md:py-8 md:text-left"
        >
          {{ $t('rooms.gyms') }}
        </h3>
        <ul class="mx-auto grid w-fit gap-6 md:grid-cols-2 lg:grid-cols-3">
          <li
            class="md:w-55 xl:w-70 2xl:w-90 w-full break-words"
            v-for="gym in resultGyms?.GetAllGyms"
            :key="gym.id"
          >
            <button
              class="flex h-full w-full rounded-lg bg-white p-6 text-left shadow-md"
              @click="handleRoomDetail(gym)"
            >
              <div class="flex h-full flex-col justify-between">
                <div>
                  <h3 class="mb-2 text-xl font-bold lg:text-2xl">
                    {{ gym.name }}
                  </h3>
                  <p class="text-lg font-semibold">Sports:</p>
                  <ul class="flex flex-wrap gap-x-2 gap-y-1">
                    <li
                      class="bg-secondary mt-1 w-fit rounded-full px-4 text-sm"
                      v-for="sport in resultGyms?.GetAllGyms[
                        resultGyms?.GetAllGyms.indexOf(gym)
                      ].sports.sort((a, b) => a.name.localeCompare(b.name))"
                      :key="sport.name"
                    >
                      <p>{{ sport.name }}</p>
                    </li>
                  </ul>
                </div>
                <div class="flex items-center gap-1">
                  <p class="text-lg font-semibold">
                    {{ $t('rooms.pricePerHour') }}:
                  </p>
                  <p>€{{ gym.pricePerHour }}</p>
                </div>
              </div>
            </button>
          </li>
          <li>
            <RouterLink
              to="/admin/rooms/create/type/0"
              class="flex h-full w-full items-center justify-center rounded-lg bg-white p-4 shadow-md"
            >
              <PlusCircle
                class="text-secondary-light"
                height="140"
                width="140"
              />
            </RouterLink>
          </li>
        </ul>
      </div>
      <div v-if="typeSelector == 1">
        <h3
          class="mb-2 py-4 text-center text-3xl font-bold md:py-8 md:text-left"
        >
          {{ $t('rooms.workRooms') }}
        </h3>
        <ul class="mx-auto grid w-fit gap-6 md:grid-cols-2 lg:grid-cols-3">
          <li
            class="md:w-55 xl:w-70 2xl:w-90 w-fit break-words"
            v-for="workRoom in resultWorkRooms?.GetAllWorkRooms"
            :key="workRoom.id"
          >
            <button
              class="h-full w-full text-left"
              @click="handleRoomDetail(workRoom)"
            >
              <div class="h-full rounded-lg bg-white p-4 shadow-md">
                <h3 class="mb-2 text-xl font-bold lg:text-2xl">
                  {{ workRoom.name }}
                </h3>
              </div>
            </button>
          </li>
          <li>
            <RouterLink
              to="/admin/rooms/create/type/1"
              class="flex h-full w-full items-center justify-center rounded-lg bg-white p-4 shadow-md"
            >
              <PlusCircle
                class="text-secondary-light"
                height="140"
                width="140"
              />
            </RouterLink>
          </li>
        </ul>
      </div>
      <div v-if="typeSelector == 2">
        <h3
          class="mb-2 py-4 text-center text-3xl font-bold md:py-8 md:text-left"
        >
          {{ $t('rooms.dressingRooms') }}
        </h3>
        <ul class="mx-auto grid w-fit gap-6 md:grid-cols-2 lg:grid-cols-3">
          <li
            class="md:w-55 xl:w-70 2xl:w-90 w-fit break-words"
            v-for="changingRoom in resultChangingRooms?.GetAllChangingRooms"
            :key="changingRoom.id"
          >
            <button
              class="h-full w-full text-left"
              @click="handleRoomDetail(changingRoom)"
            >
              <div class="h-full rounded-lg bg-white p-4 shadow-md">
                <h3 class="mb-2 text-xl font-bold lg:text-2xl">
                  {{ changingRoom.name }}
                </h3>
                <div class="flex items-center gap-1">
                  <p class="text-lg font-semibold">Price per hour:</p>
                  <p>€{{ changingRoom.pricePerHour }}</p>
                </div>
              </div>
            </button>
          </li>
          <li>
            <RouterLink
              to="/admin/rooms/create/type/2"
              class="flex h-full w-full items-center justify-center rounded-lg bg-white p-4 shadow-md"
            >
              <PlusCircle
                class="text-secondary-light"
                height="140"
                width="140"
              />
            </RouterLink>
          </li>
        </ul>
      </div>
      <div v-if="typeSelector == 3">
        <h3
          class="mb-2 py-4 text-center text-3xl font-bold md:py-8 md:text-left"
        >
          {{ $t('rooms.swimmingPools') }}
        </h3>
        <ul class="mx-auto grid w-fit gap-6 md:grid-cols-2 lg:grid-cols-3">
          <li
            class="md:w-55 xl:w-70 2xl:w-90 w-fit break-words"
            v-for="pool in resultSwimmingPools?.GetAllSwimmingPools"
            :key="pool.id"
          >
            <button
              class="h-full w-full text-left"
              @click="handleRoomDetail(pool)"
            >
              <div class="h-full rounded-lg bg-white p-4 shadow-md">
                <h3 class="mb-2 text-xl font-bold lg:text-2xl">
                  {{ pool.name }}
                </h3>
                <p class="text-lg font-semibold">Sports:</p>
                <ul class="flex flex-wrap gap-x-2 gap-y-1">
                  <li
                    class="bg-secondary mt-1 w-fit rounded-full px-4 text-sm"
                    v-for="sport in resultSwimmingPools?.GetAllSwimmingPools[
                      resultSwimmingPools?.GetAllSwimmingPools.indexOf(pool)
                    ].sports.sort((a, b) => a.name.localeCompare(b.name))"
                    :key="sport.name"
                  >
                    <p>{{ sport.name }}</p>
                  </li>
                </ul>
                <div class="flex items-center gap-1">
                  <p class="text-lg font-semibold">Price per hour:</p>
                  <p>€{{ pool.pricePerHour }}</p>
                </div>
              </div>
            </button>
          </li>
          <li>
            <RouterLink
              to="/admin/rooms/create/type/3"
              class="flex h-full w-full items-center justify-center rounded-lg bg-white p-4 shadow-md"
            >
              <PlusCircle
                class="text-secondary-light"
                height="140"
                width="140"
              />
            </RouterLink>
          </li>
        </ul>
      </div>
      <div v-if="typeSelector == 4">
        <h3
          class="mb-2 py-4 text-center text-3xl font-bold md:py-8 md:text-left"
        >
          {{ $t('rooms.divingWells') }}
        </h3>
        <ul class="mx-auto grid w-fit gap-6 md:grid-cols-2 lg:grid-cols-3">
          <li
            class="md:w-55 xl:w-70 2xl:w-90 w-fit break-words"
            v-for="divePool in resultDivePools?.GetAllDivePools"
            :key="divePool.id"
          >
            <button
              class="h-full w-full text-left"
              @click="handleRoomDetail(divePool)"
            >
              <div class="h-full rounded-lg bg-white p-4 shadow-md">
                <h3 class="mb-2 text-xl font-bold lg:text-2xl">
                  {{ divePool.name }}
                </h3>
                <p class="text-lg font-semibold">Sports:</p>
                <ul>
                  <li
                    class="bg-secondary mt-1 w-fit rounded-full px-4 text-sm"
                    v-for="sport in resultDivePools?.GetAllDivePools[
                      resultDivePools?.GetAllDivePools.indexOf(divePool)
                    ].sports.sort((a, b) => a.name.localeCompare(b.name))"
                    :key="sport.name"
                  >
                    <p>{{ sport.name }}</p>
                  </li>
                </ul>
                <div class="flex items-center gap-1">
                  <p class="text-lg font-semibold">Price per hour:</p>
                  <p>€{{ divePool.pricePerHour }}</p>
                </div>
              </div>
            </button>
          </li>
          <li>
            <RouterLink
              to="/admin/rooms/create/type/4"
              class="flex h-full w-full items-center justify-center rounded-lg bg-white p-4 shadow-md"
            >
              <PlusCircle
                class="text-secondary-light"
                height="140"
                width="140"
              />
            </RouterLink>
          </li>
        </ul>
      </div>
      <RouterView />
    </div>
  </div>
</template>

<style scoped></style>
