<script lang="ts">
// Interfaces
interface Rooms {
  GetRoomById: [
    {
      _id: string;
      name: string;
      sports: string[];
      pricePerHour: number;
      type: string;
    }
  ];
}

// Imports
import { useQuery } from '@vue/apollo-composable';
import { GET_ROOM_BY_ID } from '@/graphql/room.query';
import { defineComponent, ref } from 'vue';
import UseFirebase from '@/composables/useFirebase';

// Export default
export default defineComponent({
  setup() {
    const { firebaseUser } = UseFirebase();
    const idToken = ref();
    const getIdToken = async () => {
      idToken.value = await firebaseUser.value?.getIdToken();
    };
    getIdToken();
    const { loading, result, error } = useQuery<Rooms>(GET_ROOM_BY_ID);
    return {
      idToken,
      result,
      loading,
      error,
    };
  },
});
</script>

<template>
  <div class="m-8">
    <ul class="mx-auto grid grid-cols-3 gap-6">
      <li v-for="room in result?.GetRoomById" :key="room._id">
        <div class="h-full rounded-lg bg-white p-4 shadow-md">
          <h3 class="mb-2 font-bold text-2xl">{{ room.name }}</h3>
          <div v-if="room.type == 'Sportzaal'">
            <p class="text-lg font-semibold">Sports:</p>
            <ul>
              <li
                class="list-disc ml-4"
                v-for="sport in result?.GetAllRooms[
                  result?.GetAllRooms.indexOf(room)
                ].sports"
                :key="sport"
              >
                <p>{{ sport }}</p>
              </li>
            </ul>
          </div>
          <div class="flex items-center gap-1">
            <p class="text-lg font-semibold">Price per hour:</p>
            <p>€{{ room.pricePerHour }}</p>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped></style>
