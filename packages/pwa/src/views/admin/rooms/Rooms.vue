<script lang="ts">
// Interfaces
interface Rooms {
  GetAllRooms: [
    {
      _id: string;
      name: string;
      sports: Sport[];
      pricePerHour: number;
      type: string;
      createdAt: string;
      updatedAt: string;
    }
  ];
  GetAllGyms: [
    {
      _id: string;
      name: string;
      sports: Sport[];
      pricePerHour: number;
      type: string;
      createdAt: string;
      updatedAt: string;
    }
  ];
  GetAllWorkRooms: [
    {
      _id: string;
      name: string;
      sports: Sport[];
      pricePerHour: number;
      type: string;
      createdAt: string;
      updatedAt: string;
    }
  ];
  GetAllChangingRooms: [
    {
      _id: string;
      name: string;
      sports: Sport[];
      pricePerHour: number;
      type: string;
      createdAt: string;
      updatedAt: string;
    }
  ];
  GetAllSwimmingPools: [
    {
      _id: string;
      name: string;
      sports: Sport[];
      pricePerHour: number;
      type: string;
      createdAt: string;
      updatedAt: string;
    }
  ];
  GetAllDivePools: [
    {
      _id: string;
      name: string;
      sports: Sport[];
      pricePerHour: number;
      type: string;
      createdAt: string;
      updatedAt: string;
    }
  ];
}

interface Sport {
  id: string;
  name: string;
}

// Imports
import { useQuery } from '@vue/apollo-composable';
import { ALL_GYMS } from '../../../graphql/room.query';
import { ALL_WORK_ROOMS } from '../../../graphql/room.query';
import { ALL_CHANGING_ROOMS } from '../../../graphql/room.query';
import { ALL_SWIMMING_POOLS } from '../../../graphql/room.query';
import { ALL_DIVE_POOLS } from '../../../graphql/room.query';
import { defineComponent, ref } from 'vue';
import UseFirebase from '../../../composables/useFirebase';
import { PlusCircle } from 'lucide-vue-next';
import Modal from '@/components/Modal.vue';
import { useRouter } from 'vue-router';

// Export default
export default defineComponent({
  components: {
    PlusCircle,
    Modal,
  },
  setup() {
    const { push, currentRoute } = useRouter();
    // Firebase
    const { firebaseUser } = UseFirebase();
    const idToken = ref();
    const getIdToken = async () => {
      idToken.value = await firebaseUser.value?.getIdToken();
    };
    getIdToken();
    // //All rooms
    // const {
    //   loading,
    //   result,
    //   error
    // } = useQuery<Rooms>(ALL_ROOMS);
    const {
      loading: loadingGyms,
      result: resultGyms,
      error: errorGyms,
    } = useQuery<Rooms>(
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
    } = useQuery<Rooms>(
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
    } = useQuery<Rooms>(
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
    } = useQuery<Rooms>(
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
    } = useQuery<Rooms>(
      ALL_DIVE_POOLS,
      {},
      {
        fetchPolicy: 'no-cache',
      }
    );

    // Selector type of room
    const TypeSelector = ref(0);

    // Modal
    const isOpen = ref(false);
    const currentRoom = ref({
      _id: '',
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

    const handleRoomDetail = (room: any) => {
      isOpen.value = true;
      currentRoom.value = room;
      console.log(currentRoom.value);
    };

    return {
      idToken,
      // result,
      // loading,
      // error,
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
      TypeSelector,
      isOpen,
      currentRoom,
      handleRoomDetail,
      push,
      currentRoute,
    };
  },
});
</script>

<template>
  <div class="flex items-center justify-center">
    <button
      @click="TypeSelector = 0"
      :class="{
        'bg-secondary ': TypeSelector === 0,
        'bg-primary-light': TypeSelector !== 0,
      }"
      class="p-2"
    >
      Sportzalen
    </button>
    <button
      @click="TypeSelector = 1"
      :class="{
        'bg-secondary ': TypeSelector === 1,
        'bg-primary-light': TypeSelector !== 1,
      }"
      class="p-2"
    >
      WerkRuimtes
    </button>
    <button
      @click="TypeSelector = 2"
      :class="{
        'bg-secondary ': TypeSelector === 2,
        'bg-primary-light': TypeSelector !== 2,
      }"
      class="p-2"
    >
      Kleedkamers
    </button>
    <button
      @click="TypeSelector = 3"
      :class="{
        'bg-secondary ': TypeSelector === 3,
        'bg-primary-light': TypeSelector !== 3,
      }"
      class="p-2"
    >
      Zwembaden
    </button>
    <button
      @click="TypeSelector = 4"
      :class="{
        'bg-secondary ': TypeSelector === 4,
        'bg-primary-light': TypeSelector !== 4,
      }"
      class="p-2"
    >
      Duikputten
    </button>
  </div>
  <div class="flex flex-col gap-20">
    <div v-if="TypeSelector == 0">
      <h3 class="mb-2 text-3xl font-bold">Sportzalen</h3>
      <ul class="mx-auto grid grid-cols-3 gap-6">
        <li
          v-for="gym in resultGyms?.GetAllGyms"
          :key="gym._id"
          @click="handleRoomDetail(gym)"
        >
          <button class="h-full w-full text-left" @click="">
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
            <PlusCircle class="text-secondary-light" height="140" width="140" />
          </RouterLink>
        </li>
      </ul>
    </div>
    <div v-if="TypeSelector == 1">
      <h3 class="mb-2 text-3xl font-bold">WerkRuimtes</h3>
      <ul class="mx-auto grid grid-cols-3 gap-6">
        <li
          v-for="workRoom in resultWorkRooms?.GetAllWorkRooms"
          :key="workRoom._id"
        >
          <div class="h-full rounded-lg bg-white p-4 shadow-md">
            <h3 class="mb-2 text-2xl font-bold">{{ workRoom.name }}</h3>
          </div>
        </li>
        <li>
          <RouterLink
            to="/admin/rooms/create"
            class="flex h-full w-full items-center justify-center rounded-lg bg-white p-4 shadow-md"
          >
            <PlusCircle class="text-secondary-light" height="140" width="140" />
          </RouterLink>
        </li>
      </ul>
    </div>
    <div v-if="TypeSelector == 2">
      <h3 class="mb-2 text-3xl font-bold">Kleedkamers</h3>
      <ul class="mx-auto grid grid-cols-3 gap-6">
        <li
          v-for="changingRoom in resultChangingRooms?.GetAllChangingRooms"
          :key="changingRoom._id"
        >
          <div class="h-full rounded-lg bg-white p-4 shadow-md">
            <h3 class="mb-2 text-2xl font-bold">{{ changingRoom.name }}</h3>
            <div class="flex items-center gap-1">
              <p class="text-lg font-semibold">Price per hour:</p>
              <p>€{{ changingRoom.pricePerHour }}</p>
            </div>
          </div>
        </li>
        <li>
          <RouterLink
            to="/admin/rooms/create"
            class="flex h-full w-full items-center justify-center rounded-lg bg-white p-4 shadow-md"
          >
            <PlusCircle class="text-secondary-light" height="140" width="140" />
          </RouterLink>
        </li>
      </ul>
    </div>
    <div v-if="TypeSelector == 3">
      <h3 class="mb-2 text-3xl font-bold">Zwembaden</h3>
      <ul class="mx-auto grid grid-cols-3 gap-6">
        <li
          v-for="pool in resultSwimmingPools?.GetAllSwimmingPools"
          :key="pool._id"
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
        </li>
        <li>
          <RouterLink
            to="/admin/rooms/create"
            class="flex h-full w-full items-center justify-center rounded-lg bg-white p-4 shadow-md"
          >
            <PlusCircle class="text-secondary-light" height="140" width="140" />
          </RouterLink>
        </li>
      </ul>
    </div>
    <div v-if="TypeSelector == 4">
      <h3 class="mb-2 text-3xl font-bold">Duikputten</h3>
      <ul class="mx-auto grid grid-cols-3 gap-6">
        <li
          v-for="divePool in resultDivePools?.GetAllDivePools"
          :key="divePool._id"
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
        </li>
        <li>
          <RouterLink
            to="/admin/rooms/create"
            class="flex h-full w-full items-center justify-center rounded-lg bg-white p-4 shadow-md"
          >
            <PlusCircle class="text-secondary-light" height="140" width="140" />
          </RouterLink>
        </li>
      </ul>
    </div>
    <Modal v-if="isOpen" @close="console.log("closed")">
      <template v-slot:title>
        <h2 class="mr-2 w-full">
          <span class="text-lg font-bold">{{ currentRoom.name }}</span>
        </h2>
      </template>
      <template v-slot:default>
        <p class="text-lg font-semibold">Sports:</p>
        <ul>
          <li
            class="ml-4 list-disc"
            v-for="sport in currentRoom.sports"
            :key="sport.name"
          >
            <p>{{ sport.name }}</p>
          </li>
        </ul>
        <div class="flex items-center gap-1">
          <p class="text-lg font-semibold">Price per hour:</p>
          <p>€{{ currentRoom.pricePerHour }}</p>
        </div>
      </template>
    </Modal>
  </div>
</template>

<style scoped></style>
