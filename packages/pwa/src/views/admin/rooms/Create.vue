<script lang="ts">
// Interfaces
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
import { useRouter } from 'vue-router';
import {
  CREATE_ROOM,
  createRoomInput,
  ICreateRoom,
} from '@/graphql/room.query';
import { defineComponent, ref } from 'vue';
import StyledInputText from '@/components/generic/StyledInputText.vue';
import UseFirebase from '../../../composables/useFirebase';

// Export default
export default defineComponent({
  name: 'CreateRoom',
  components: {
    StyledInputText,
  },

  setup: function () {
    const { firebaseUser } = UseFirebase();
    const idToken = ref();
    const getIdToken = async () => {
      idToken.value = await firebaseUser.value?.getIdToken();
    };
    getIdToken();
    const { push } = useRouter();

    // All sports
    const { loading, result, error } = useQuery<Sports>(ALL_SPORTS);
    // CREATE ROOM
    const { mutate } = useMutation<ICreateRoom>(CREATE_ROOM);
    const typeSelector = ref(-1);

    const typeSelectorChange = (e: Event) => {
      const target = e.target as HTMLSelectElement;
      const value = Number(target.value);
      typeSelector.value = value;
      console.log(typeSelector.value);
    };

    const handleSubmit = async (e: Event) => {
      //prevent default submit behaviour
      e.preventDefault();

      //get all form data
      const formData = new FormData(e.target as HTMLFormElement);
      const data = Object.fromEntries(formData.entries());
      let Price = 0;
      const { title, price } = data;
      if (price) Price = Number(price);
      const sportsIds = [];
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          const element = data[key];
          if (element === 'on') {
            sportsIds.push(key);
          }
        }
      }
      let type = '';
      if (typeSelector.value == 0) {
        type = 'Sportzaal';
      } else if (typeSelector.value == 1) {
        type = 'Werkruimte';
      } else if (typeSelector.value == 2) {
        type = 'Kleedruimte';
      } else if (typeSelector.value == 3) {
        type = 'Zwembad';
      } else if (typeSelector.value == 4) {
        type = 'Duikput';
      }

      const params: createRoomInput = {
        name: title.toString(),
        pricePerHour: Price,
        SportId: sportsIds,
        type: type,
      };
      console.log(params);

      //Create a new room in the database
      const res = await mutate({
        createRoomInput: params,
      });
      console.info(res);

      //redirect to the room page
      if (res?.data?.createRoom.id) {
        await push('/admin/rooms/');
      }
      console.log('submit');
    };

    return {
      idToken,
      loading,
      result,
      error,
      typeSelector,
      typeSelectorChange,
      handleSubmit,
    };
  },
});
</script>

<template>
  <div class="flex flex-col items-center">
    <form @submit.prevent="handleSubmit" class="flex flex-col gap-4 max-w-md">
      <div class="flex flex-col gap-1">
        <label for="roomType" class="text-primary-text font-bold"
          >Kies een type ruimte</label
        >
        <select
          id="roomType"
          class="bg-primary-surface b-2 border-neutral-200 px-4"
          name="service"
          @change="typeSelectorChange"
        >
          <option value="-1" disabled selected>Selecteer een type</option>
          <option value="0">Sportzalen</option>
          <option value="1">WerkRuimtes</option>
          <option value="2">Kleedkamers</option>
          <option value="3">Zwembaden</option>
          <option value="4">Duikputten</option>
        </select>
      </div>
      <div v-if="typeSelector >= 0">
        <StyledInputText label="Title" name="title" />
      </div>
      <div v-if="typeSelector == 0 || typeSelector == 3 || typeSelector == 4">
        <div
          v-for="sport in result?.GetAllSports"
          :key="sport.id"
          class="flex items-center gap-2"
        >
          <input type="checkbox" :name="sport.id" :id="sport.id" />
          <label :for="sport.id" class="select-none">{{ sport.name }}</label>
        </div>
      </div>
      <div v-if="typeSelector != -1 && typeSelector != 1" class="flex flex-col">
        <label for="price">Price Per Hour</label>
        <input
          type="number"
          name="price"
          id="price"
          min="0"
          max="1000"
          class="bg-primary-surface b-2 border-neutral-200 px-4"
        />
      </div>
      <div v-if="typeSelector >= 0">
        <button
          type="submit"
          class="bg-secondary text-primary-text font-bold py-2 px-4 rounded"
        >
          Maak ruimte aan
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped></style>
