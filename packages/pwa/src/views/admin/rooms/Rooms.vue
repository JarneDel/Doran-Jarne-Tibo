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
import { defineComponent, ref } from 'vue';
import UseFirebase from '../../../composables/useFirebase';
import { PlusCircle } from 'lucide-vue-next';
import Modal from '@/components/Modal.vue';
import { useRouter } from 'vue-router';
import DoubleClickEdit from '@/components/generic/DoubleClickEdit.vue';

// Export default
export default defineComponent({
  components: {
    PlusCircle,
    Modal,
    DoubleClickEdit,
  },
  setup() {
    // Router
    const { push, currentRoute } = useRouter();
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
    const typeSelector = ref(0);

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

    const handleRoomDetail = (room: any) => {
      push(`/admin/rooms/${room.id}`);
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
      currentRoute,
      mutate,
    };
  },
});
</script>

<template>
  <div class="m-8">
    <div class="flex items-center justify-center">
      <button
        @click="typeSelector = 0"
        :class="{
          'bg-secondary ': typeSelector === 0,
          'bg-primary-light': typeSelector !== 0,
        }"
        class="p-2"
      >
        Sportzalen
      </button>
      <button
        @click="typeSelector = 1"
        :class="{
          'bg-secondary ': typeSelector === 1,
          'bg-primary-light': typeSelector !== 1,
        }"
        class="p-2"
      >
        WerkRuimtes
      </button>
      <button
        @click="typeSelector = 2"
        :class="{
          'bg-secondary ': typeSelector === 2,
          'bg-primary-light': typeSelector !== 2,
        }"
        class="p-2"
      >
        Kleedkamers
      </button>
      <button
        @click="typeSelector = 3"
        :class="{
          'bg-secondary ': typeSelector === 3,
          'bg-primary-light': typeSelector !== 3,
        }"
        class="p-2"
      >
        Zwembaden
      </button>
      <button
        @click="typeSelector = 4"
        :class="{
          'bg-secondary ': typeSelector === 4,
          'bg-primary-light': typeSelector !== 4,
        }"
        class="p-2"
      >
        Duikputten
      </button>
    </div>
    <div class="flex flex-col gap-20">
      <div v-if="typeSelector == 0">
        <h3 class="mb-2 text-3xl font-bold">Sportzalen</h3>
        <ul class="mx-auto grid grid-cols-3 gap-6">
          <li v-for="gym in resultGyms?.GetAllGyms" :key="gym.id">
            <button
              class="h-full w-full text-left"
              @click="handleRoomDetail(gym)"
            >
              <div class="h-full rounded-lg bg-white p-4 shadow-md">
                <h3 class="mb-2 text-2xl font-bold">{{ gym.name }}</h3>
                <p class="text-lg font-semibold">Sports:</p>
                <ul>
                  <li
                    class="ml-4 list-disc"
                    v-for="sport in resultGyms?.GetAllGyms[
                      resultGyms?.GetAllGyms.indexOf(gym)
                    ].sports"
                    :key="sport.name"
                  >
                    <p>{{ sport.name }}</p>
                  </li>
                </ul>
                <div class="flex items-center gap-1">
                  <p class="text-lg font-semibold">Price per hour:</p>
                  <p>€{{ gym.pricePerHour }}</p>
                </div>
              </div>
            </button>
          </li>
          <li>
            <RouterLink
              to="/admin/rooms/create"
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
        <h3 class="mb-2 text-3xl font-bold">WerkRuimtes</h3>
        <ul class="mx-auto grid grid-cols-3 gap-6">
          <li
            v-for="workRoom in resultWorkRooms?.GetAllWorkRooms"
            :key="workRoom.id"
          >
            <button
              class="h-full w-full text-left"
              @click="handleRoomDetail(workRoom)"
            >
              <div class="h-full rounded-lg bg-white p-4 shadow-md">
                <h3 class="mb-2 text-2xl font-bold">{{ workRoom.name }}</h3>
              </div>
            </button>
          </li>
          <li>
            <RouterLink
              to="/admin/rooms/create"
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
        <h3 class="mb-2 text-3xl font-bold">Kleedkamers</h3>
        <ul class="mx-auto grid grid-cols-3 gap-6">
          <li
            v-for="changingRoom in resultChangingRooms?.GetAllChangingRooms"
            :key="changingRoom.id"
          >
            <button
              class="h-full w-full text-left"
              @click="handleRoomDetail(changingRoom)"
            >
              <div class="h-full rounded-lg bg-white p-4 shadow-md">
                <h3 class="mb-2 text-2xl font-bold">{{ changingRoom.name }}</h3>
                <div class="flex items-center gap-1">
                  <p class="text-lg font-semibold">Price per hour:</p>
                  <p>€{{ changingRoom.pricePerHour }}</p>
                </div>
              </div>
            </button>
          </li>
          <li>
            <RouterLink
              to="/admin/rooms/create"
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
        <h3 class="mb-2 text-3xl font-bold">Zwembaden</h3>
        <ul class="mx-auto grid grid-cols-3 gap-6">
          <li
            v-for="pool in resultSwimmingPools?.GetAllSwimmingPools"
            :key="pool.id"
          >
            <button
              class="h-full w-full text-left"
              @click="handleRoomDetail(pool)"
            >
              <div class="h-full rounded-lg bg-white p-4 shadow-md">
                <h3 class="mb-2 text-2xl font-bold">{{ pool.name }}</h3>
                <p class="text-lg font-semibold">Sports:</p>
                <ul>
                  <li
                    class="ml-4 list-disc"
                    v-for="sport in resultSwimmingPools?.GetAllSwimmingPools[
                      resultSwimmingPools?.GetAllSwimmingPools.indexOf(pool)
                    ].sports"
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
              to="/admin/rooms/create"
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
        <h3 class="mb-2 text-3xl font-bold">Duikputten</h3>
        <ul class="mx-auto grid grid-cols-3 gap-6">
          <li
            v-for="divePool in resultDivePools?.GetAllDivePools"
            :key="divePool.id"
          >
            <button
              class="h-full w-full text-left"
              @click="handleRoomDetail(divePool)"
            >
              <div class="h-full rounded-lg bg-white p-4 shadow-md">
                <h3 class="mb-2 text-2xl font-bold">{{ divePool.name }}</h3>
                <p class="text-lg font-semibold">Sports:</p>
                <ul>
                  <li
                    class="ml-4 list-disc"
                    v-for="sport in resultDivePools?.GetAllDivePools[
                      resultDivePools?.GetAllDivePools.indexOf(divePool)
                    ].sports"
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
              to="/admin/rooms/create"
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
      <Modal v-if="isOpen" @close="handleCloseModal">
        <template v-slot:title>
          <h2 class="mr-2 w-full text-lg font-bold">
            <DoubleClickEdit
              :value="currentRoom.name"
              @submit="
                (newValue) => {
                  currentRoom.name = newValue;
                }
              "
            />
          </h2>
        </template>
        <template v-slot:default>
          <div
            v-if="typeSelector == 0 || typeSelector == 3 || typeSelector == 4"
          >
            <p class="text-lg font-semibold">Sports:</p>
            <ul>
              <li>
                <div
                  v-for="sport in resultSports?.GetAllSports"
                  :key="sport.id"
                  class="flex items-center gap-2"
                >
                  <input
                    type="checkbox"
                    :name="sport.id"
                    :id="sport.id"
                    :checked="
                      currentRoom.sports.some((s) => s.id === sport.id)
                        ? true
                        : false
                    "
                    @change="
                      (e: any) => {
                        if (e.target?.checked) {
                          currentRoom.sports.push(sport);
                        } else {
                          currentRoom.sports = currentRoom.sports.filter(
                            (s) => s.id !== sport.id
                          );
                        }
                      }
                    "
                  />
                  <label :for="sport.id" class="select-none">{{
                    sport.name
                  }}</label>
                </div>
              </li>
            </ul>
          </div>
          <div
            v-if="
              typeSelector == 0 ||
              typeSelector == 2 ||
              typeSelector == 3 ||
              typeSelector == 4
            "
            class="flex items-center gap-1"
          >
            <p class="text-lg font-semibold">Price per hour:</p>
            <p>€</p>
            <DoubleClickEdit
              :value="currentRoom.pricePerHour"
              type="number"
              @submit="
                (newValue) => {
                  currentRoom.pricePerHour = newValue;
                }
              "
            />
          </div>
        </template>
      </Modal>
    </div>
  </div>
</template>

<style scoped></style>
