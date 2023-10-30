<script lang="ts">
// Interfaces
interface Room {
  id: string;
  name: string;
  sports: Sport[];
  pricePerHour: number;
  type: string;
  canBeUsed: boolean;
}
interface IRoom {
  GetRoomById: Room;
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
    }
  ];
}

import { computed, defineComponent, ref } from 'vue';
import Modal from '@/components/Modal.vue';
import { useRouter } from 'vue-router';
import { useQuery, useMutation } from '@vue/apollo-composable';
import { GET_ONE_ROOM, UPDATE_ROOM } from '@/graphql/room.query.ts';
import StyledButton from '@/components/generic/StyledButton.vue';
import StyledInputText from '@/components/generic/StyledInputText.vue';
import { ALL_SPORTS } from '@/graphql/sport.query';
import { onBeforeMount } from 'vue';

export default defineComponent({
  name: 'Edit',
  components: {
    StyledButton,
    Modal,
    StyledInputText,
  },
  setup: () => {
    const { push, currentRoute } = useRouter();
    const id = computed(() => currentRoute.value.params.id);

    const { mutate: mutateUpdateItem } = useMutation(UPDATE_ROOM);

    // GET_ONE_ROOM
    const { error, loading, result } = useQuery<IRoom>(GET_ONE_ROOM, {
      roomId: id.value,
    });
    // All sports
    const {
      loading: loadingSports,
      result: resultSports,
      error: errorSports,
    } = useQuery<Sports>(ALL_SPORTS);

    const sortedSports = computed(() => {
      if (resultSports.value && resultSports.value.GetAllSports) {
        return resultSports.value.GetAllSports.slice().sort((a, b) =>
          a.name.localeCompare(b.name)
        );
      }
      return [];
    });

    const currentRoom = ref<Room>({
      id: '',
      name: '',
      sports: [],
      pricePerHour: 0,
      type: '',
      canBeUsed: false,
    });

    onBeforeMount(() => {
      if (result.value?.GetRoomById) {
        currentRoom.value = { ...result.value?.GetRoomById };
      }
    });

    const handleSubmit = () => {
      console.log('submit');

      console.log(currentRoom.value);

      // Convert sports to sportIds
      let SportIds: String[] = [];
      currentRoom.value.sports.forEach((sport) => {
        SportIds.push(sport.id);
      });

      console.log(SportIds);
      console.log(currentRoom.value);

      // Save changes
      mutateUpdateItem({
        updateRoomInput: {
          _id: currentRoom.value.id,
          name: currentRoom.value.name,
          SportId: SportIds,
          pricePerHour: Number(currentRoom.value.pricePerHour),
          type: currentRoom.value.type,
        },
      });
    };

    return {
      push,
      handleSubmit,
      result,
      error,
      loading,
      resultSports,
      errorSports,
      loadingSports,
      currentRoom,
      sortedSports,
    };
  },
});
</script>

<template>
  <Modal max-width="max-w-xl" @close="push('/admin/rooms')">
    <template v-slot:title>
      <div class="flex w-full flex-row items-center justify-between">
        <h2 v-if="loading" class="mr-2 w-full text-lg font-bold">
          Loading...
        </h2>
        <h2
          v-if="!result?.GetRoomById && !loading"
          class="mr-2 w-full text-lg font-bold"
        >
          No item found with this id
        </h2>
        <h3 class="mb-2 mr-2 text-2xl font-bold">
          {{ result?.GetRoomById.name }}
        </h3>
        <div></div>
      </div>
    </template>
    <template v-slot:default>
      <form v-if="result?.GetRoomById" @submit.prevent="handleSubmit">
        <StyledInputText
          v-model="currentRoom.name"
          id="name"
          :label="$t('inventory.name')"
        />
        <div
          v-if="
            result?.GetRoomById.type == 'Sportzaal' ||
            result?.GetRoomById.type == 'Zwembad' ||
            result?.GetRoomById.type == 'Duikput'
          "
        >
          <p class="text-lg font-semibold">Sports:</p>
          <ul>
            <li>
              <div
                v-for="sport in sortedSports"
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
                        console.log('checked');
                        currentRoom = {
                          ...currentRoom,
                          sports: [...currentRoom.sports, sport],
                        };
                        console.log(currentRoom.sports);
                      } else {
                        console.log('unchecked');
                        currentRoom = {
                          ...currentRoom,
                          sports: currentRoom.sports.filter(
                            (s) => s.id !== sport.id
                          ),
                        };
                        console.log(currentRoom.sports);
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
        <div v-if="currentRoom.type !== 'Werkruimte'">
          <StyledInputText
            type="number"
            v-model="currentRoom.pricePerHour"
            id="pricePerHour"
            :label="$t('inventory.pricePerHour')"
            :min="0"
          >
          </StyledInputText>
        </div>
        <div class="flex justify-end">
          <StyledButton button-type="secondary" class="mt4" type="submit">
            {{ $t('item.edit.modify') }}
          </StyledButton>
        </div>
      </form>
    </template>
  </Modal>
</template>

<style scoped></style>
