<script lang="ts">
// Interfaces
interface IRepairRequest {
  GetAllRepairRequests: RepairRequest[];
}

// Imports
import { RepairRequest } from '@/interface/repairRequestInterface';
import { defineComponent, computed, ref, watch } from 'vue';
import { useQuery } from '@vue/apollo-composable';
import { ALL_REPAIR_REQUESTS } from '@/graphql/repairRequests.query';
import UseFirebase from '../../../composables/useFirebase';
import { Warehouse, Box, ShieldAlert } from 'lucide-vue-next';
import Modal from '@/components/Modal.vue';
import { useRouter } from 'vue-router';
import DoubleClickEdit from '@/components/generic/DoubleClickEdit.vue';
import useLastRoute from '@/composables/useLastRoute';

// Export default
export default defineComponent({
  components: {
    Warehouse,
    Box,
    ShieldAlert,
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

    const {
      loading: loadingRepairRequests,
      result: resultRepairRequests,
      error: errorRepairRequests,
      onResult: onResultRepairRequests,
    } = useQuery<IRepairRequest>(ALL_REPAIR_REQUESTS);

    const sortedRepairRequests = ref<RepairRequest[]>();

    onResultRepairRequests((result) => {
      sortedRepairRequests.value = result.data.GetAllRepairRequests;
      sortRepairRequests();
    });

    const filter = ref<string>('date');
    const reverseFilter = ref<string>('normal');

    const { lastRoute } = useLastRoute();

    watch(
      lastRoute,
      (value) => {
        console.log(value);
        if (value.startsWith('/admin/repairRequests/id/')) {
          fetchWithFilters();
        }
      },
      { immediate: true }
    );

    const fetchWithFilters = () => {
      console.log('fetchWithFilters');
    };

    const changeSorting = (e: any) => {
      filter.value = e.target.value;
      sortRepairRequests();
    };

    const changeReverseSorting = (e: any) => {
      reverseFilter.value = e.target.value;
      sortRepairRequests();
    };

    const sortRepairRequests = () => {
      if (!sortedRepairRequests.value) return;

      const newArray = [...sortedRepairRequests.value];

      if (reverseFilter.value === 'normal') {
        switch (filter.value) {
          case 'date':
            newArray.sort((a, b) => {
              return (
                new Date(a.updatedAt).getTime() -
                new Date(b.updatedAt).getTime()
              );
            });
            break;
          case 'urgency':
            newArray.sort((a, b) => {
              return a.urgency - b.urgency;
            });
            break;
          case 'repaired':
            newArray.sort((a, b) => {
              return Number(a.isRepaired) - Number(b.isRepaired);
            });
            break;
        }
      } else if (reverseFilter.value === 'reverse') {
        switch (filter.value) {
          case 'date':
            newArray.sort((a, b) => {
              return (
                new Date(b.updatedAt).getTime() -
                new Date(a.updatedAt).getTime()
              );
            });
            break;
          case 'urgency':
            newArray.sort((a, b) => {
              return b.urgency - a.urgency;
            });
            break;
          case 'repaired':
            newArray.sort((a, b) => {
              return Number(b.isRepaired) - Number(a.isRepaired);
            });
            break;
        }
      }

      sortedRepairRequests.value = newArray;
    };

    return {
      idToken,
      loadingRepairRequests,
      resultRepairRequests,
      errorRepairRequests,
      sortedRepairRequests,
      push,
      replace,
      currentRoute,
      changeSorting,
      changeReverseSorting,
    };
  },
});
</script>

<template>
  <div class="m-8">
    <div class="flex flex-col">
      <div>
        <div class="flex flex-col lg:flex-row lg:justify-between">
          <h1 class="text-3xl font-bold mb-6">Repair Requests</h1>
          <div class="flex flex-wrap gap-2 mb-2 lg:my-2 xl:my-4 2xl:my-6">
            <div class="flex items-center">
              <ShieldAlert class="w-8 h-8 text-green-600" />
              <p>Not urgent</p>
            </div>
            <div class="flex items-center">
              <ShieldAlert class="w-8 h-8 text-yellow-400" />
              <p>
                Mildly urgent
              </p>
            </div>
            <div class="flex items-center">
              <ShieldAlert class="w-8 h-8 text-red-600" />
              <p>Very urgent!</p>
            </div>
          </div>
        </div>
        <div>
          <select
            id="sorting"
            class="bg-primary-surface b-2 border-neutral-200 px-4 mb-2 xl:mb-4 2xl:mb-6"
            name="sorting"
            @change="changeSorting"
          >
            <option value="date">Date</option>
            <option value="urgency">Urgency</option>
            <option value="repaired">Repaired</option>
          </select>
          <select
            id="sortingReverse"
            class="bg-primary-surface b-2 border-neutral-200 px-4 mb-2 xl:mb-4 2xl:mb-6"
            name="sortingReverse"
            @change="changeReverseSorting"
          >
            <option value="normal">Normal</option>
            <option value="reverse">Reverse</option>
          </select>
        </div>
        <ul
          class="flex flex-col w-full h-200 overflow-auto gap-2 lg:gap-4 2xl:gap-6"
        >
          <li
            :key="repairRequest.id"
            v-for="repairRequest in sortedRepairRequests"
          >
            <Button
              class="flex p-2 lg:p-3 2xl:p-4 rounded-md shadow-md bg-white w-full"
            >
              <div>
                <h3
                  class="text-lg 2xl:text-xl font-bold text-primary-text text-left mb-2"
                >
                  {{ repairRequest.title }}
                </h3>
                <div></div>
                <div class="flex justify-center items-center gap-2">
                  <ShieldAlert
                    class="w-8 h-8 mr-2"
                    :class="{
                      'text-green-600': repairRequest.urgency == 1,
                      'text-yellow-400': repairRequest.urgency == 2,
                      'text-red-600': repairRequest.urgency == 3,
                    }"
                  />
                  <div class="flex flex-col">
                    <div class="flex items-center">
                      <Box
                        class="w-8 h-8 mr-2 opacity-10"
                        :class="{
                          'opacity-100': repairRequest.loanableMaterial,
                        }"
                      />
                      <ul class="flex flex-wrap">
                        <li
                          class="group"
                          v-for="loanableMaterial in repairRequest.loanableMaterial"
                        >
                          {{ loanableMaterial.name }}
                          <span class="group-last:hidden mr-1">,</span>
                        </li>
                      </ul>
                    </div>
                    <div class="flex items-center">
                      <Warehouse
                        class="w-8 h-8 mr-2 opacity-10"
                        :class="{ 'opacity-100': repairRequest.room }"
                      />
                      <ul>
                        <li v-for="room in repairRequest.room">
                          {{ room.name }}
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div>{{ repairRequest.isRepaired }}</div>
            </Button>
          </li>
        </ul>
      </div>
    </div>
    <RouterView />
  </div>
</template>

<style scoped></style>
