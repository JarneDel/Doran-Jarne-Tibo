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
// import { ALL_ROOMS } from '../../../graphql/room.query';
import { ALL_GYMS } from '../../../graphql/room.query';
import { ALL_WORK_ROOMS } from '../../../graphql/room.query';
import { ALL_CHANGING_ROOMS } from '../../../graphql/room.query';
import { ALL_SWIMMING_POOLS } from '../../../graphql/room.query';
import { ALL_DIVE_POOLS } from '../../../graphql/room.query';
import { defineComponent, ref } from 'vue';
import UseFirebase from '../../../composables/useFirebase';
import { PlusCircle } from 'lucide-vue-next';

// Export default
export default defineComponent({
  components: {
    PlusCircle,
  },
  setup() {
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
    } = useQuery<Rooms>(ALL_GYMS);
    const {
      loading: loadingWorkRooms,
      result: resultWorkRooms,
      error: errorWorkRooms,
    } = useQuery<Rooms>(ALL_WORK_ROOMS);
    const {
      loading: loadingChangingRooms,
      result: resultChangingRooms,
      error: errorChangingRooms,
    } = useQuery<Rooms>(ALL_CHANGING_ROOMS);
    const {
      loading: loadingSwimmingPools,
      result: resultSwimmingPools,
      error: errorSwimmingPools,
    } = useQuery<Rooms>(ALL_SWIMMING_POOLS);
    const {
      loading: loadingDivePools,
      result: resultDivePools,
      error: errorDivePools,
    } = useQuery<Rooms>(ALL_DIVE_POOLS);

    const TypeSelector = ref(0);

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
    };
  },
});
</script>

<template>
  <div class="flex justify-center items-center">
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
      <h3 class="font-bold text-3xl mb-2">Sportzalen</h3>
      <ul class="mx-auto grid grid-cols-3 gap-6">
        <li v-for="gym in resultGyms?.GetAllGyms" :key="gym._id">
          <div class="h-full rounded-lg bg-white p-4 shadow-md">
            <h3 class="mb-2 font-bold text-2xl">{{ gym.name }}</h3>
            <p class="text-lg font-semibold">Sports:</p>
            <ul>
              <li
                class="list-disc ml-4"
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
        </li>
        <li>
          <RouterLink
            to="/admin/rooms/create"
            class="flex w-full justify-center items-center h-full rounded-lg bg-white p-4 shadow-md"
          >
            <PlusCircle class="text-secondary-light" height="140" width="140" />
          </RouterLink>
        </li>
      </ul>
    </div>
    <div v-if="TypeSelector == 1">
      <h3 class="font-bold text-3xl mb-2">WerkRuimtes</h3>
      <ul class="mx-auto grid grid-cols-3 gap-6">
        <li
          v-for="workRoom in resultWorkRooms?.GetAllWorkRooms"
          :key="workRoom._id"
        >
          <div class="h-full rounded-lg bg-white p-4 shadow-md">
            <h3 class="mb-2 font-bold text-2xl">{{ workRoom.name }}</h3>
          </div>
        </li>
        <li>
          <RouterLink
            to="/admin/rooms/create"
            class="flex w-full justify-center items-center h-full rounded-lg bg-white p-4 shadow-md"
          >
            <PlusCircle class="text-secondary-light" height="140" width="140" />
          </RouterLink>
        </li>
      </ul>
    </div>
    <div v-if="TypeSelector == 2">
      <h3 class="font-bold text-3xl mb-2">Kleedkamers</h3>
      <ul class="mx-auto grid grid-cols-3 gap-6">
        <li
          v-for="changingRoom in resultChangingRooms?.GetAllChangingRooms"
          :key="changingRoom._id"
        >
          <div class="h-full rounded-lg bg-white p-4 shadow-md">
            <h3 class="mb-2 font-bold text-2xl">{{ changingRoom.name }}</h3>
            <div class="flex items-center gap-1">
              <p class="text-lg font-semibold">Price per hour:</p>
              <p>€{{ changingRoom.pricePerHour }}</p>
            </div>
          </div>
        </li>
        <li>
          <RouterLink
            to="/admin/rooms/create"
            class="flex w-full justify-center items-center h-full rounded-lg bg-white p-4 shadow-md"
          >
            <PlusCircle class="text-secondary-light" height="140" width="140" />
          </RouterLink>
        </li>
      </ul>
    </div>
    <div v-if="TypeSelector == 3">
      <h3 class="font-bold text-3xl mb-2">Zwembaden</h3>
      <ul class="mx-auto grid grid-cols-3 gap-6">
        <li
          v-for="pool in resultSwimmingPools?.GetAllSwimmingPools"
          :key="pool._id"
        >
          <div class="h-full rounded-lg bg-white p-4 shadow-md">
            <h3 class="mb-2 font-bold text-2xl">{{ pool.name }}</h3>
            <p class="text-lg font-semibold">Sports:</p>
            <ul>
              <li
                class="list-disc ml-4"
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
            class="flex w-full justify-center items-center h-full rounded-lg bg-white p-4 shadow-md"
          >
            <PlusCircle class="text-secondary-light" height="140" width="140" />
          </RouterLink>
        </li>
      </ul>
    </div>
    <div v-if="TypeSelector == 4">
      <h3 class="font-bold text-3xl mb-2">Duikputten</h3>
      <ul class="mx-auto grid grid-cols-3 gap-6">
        <li
          v-for="divePool in resultDivePools?.GetAllDivePools"
          :key="divePool._id"
        >
          <div class="h-full rounded-lg bg-white p-4 shadow-md">
            <h3 class="mb-2 font-bold text-2xl">{{ divePool.name }}</h3>
            <p class="text-lg font-semibold">Sports:</p>
            <ul>
              <li
                class="list-disc ml-4"
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
            class="flex w-full justify-center items-center h-full rounded-lg bg-white p-4 shadow-md"
          >
            <PlusCircle class="text-secondary-light" height="140" width="140" />
          </RouterLink>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped></style>
