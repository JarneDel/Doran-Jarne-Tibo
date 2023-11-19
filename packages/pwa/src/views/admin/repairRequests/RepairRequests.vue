<script lang="ts">
// Interfaces
interface IRepairRequest {
  GetAllRepairRequests: RepairRequest[];
}

// Imports
import { RepairRequest } from '@/interface/repairRequestInterface';
import { defineComponent, ref, watch } from 'vue';
import { useQuery } from '@vue/apollo-composable';
import { ALL_REPAIR_REQUESTS } from '@/graphql/repairRequests.query';
import UseFirebase from '../../../composables/useFirebase';
import { Warehouse, Box, ShieldAlert, BadgeCheck } from 'lucide-vue-next';
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
    BadgeCheck,
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
      refetch: refetchRepairRequests,
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
        if (value.startsWith('/admin/repair-requests/id/')) {
          fetchWithFilters();
        }
      },
      { immediate: true }
    );

    const fetchWithFilters = () => {
      console.log('fetchWithFilters');
      refetchRepairRequests();
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
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime()
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
              return a.urgency - b.urgency;
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

    const handleRepairRequestDetail = (repairRequest: RepairRequest) => {
      push(`/admin/repair-requests/id/${repairRequest.id}`);
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
      handleRepairRequestDetail,
    };
  },
});
</script>

<template>
  <div class="m-8">
    <div class="flex flex-col max-w-4xl m-auto">
      <div>
        <div class="flex flex-col lg:flex-row lg:justify-between">
          <h1 class="text-3xl font-bold mb-6 text-primary-text">
            {{ $t('repairRequest.repairRequests') }}
          </h1>
          <div class="flex flex-wrap gap-2 mb-2 lg:my-2 xl:my-4 2xl:my-6">
            <div class="flex items-center">
              <BadgeCheck class="w-8 h-8 text-green-600" />
              <p>{{ $t('repairRequest.repaired') }}</p>
            </div>
            <div class="flex items-center">
              <ShieldAlert class="w-8 h-8 text-yellow-300" />
              <p>{{ $t('repairRequest.notUrgent') }}</p>
            </div>
            <div class="flex items-center">
              <ShieldAlert class="w-8 h-8 text-orange-500" />
              <p>{{ $t('repairRequest.mildlyUrgent') }}</p>
            </div>
            <div class="flex items-center">
              <ShieldAlert class="w-8 h-8 text-red-600" />
              <p>{{ $t('repairRequest.veryUrgent') }}</p>
            </div>
          </div>
        </div>
        <div class="flex gap-2">
          <select
            id="sorting"
            class="bg-primary-surface b-2 border-neutral-200 px-4 mb-2 xl:mb-4 2xl:mb-6"
            name="sorting"
            @change="changeSorting"
          >
            <option value="date">{{ $t('repairRequest.date') }}</option>
            <option value="urgency">{{ $t('repairRequest.urgency') }}</option>
            <option value="repaired">{{ $t('repairRequest.repaired') }}</option>
          </select>
          <select
            id="sortingReverse"
            class="bg-primary-surface b-2 border-neutral-200 px-4 mb-2 xl:mb-4 2xl:mb-6"
            name="sortingReverse"
            @change="changeReverseSorting"
          >
            <option value="normal">{{ $t('repairRequest.normal') }}</option>
            <option value="reverse">{{ $t('repairRequest.reversed') }}</option>
          </select>
        </div>
        <ul
          class="flex flex-col w-full h-160 overflow-auto gap-2 lg:gap-4 2xl:gap-6 border-primary-light p-2 border-2 rounded-md"
        >
          <li
            :key="repairRequest.id"
            v-for="repairRequest in sortedRepairRequests"
          >
            <button
              class="flex justify-between p-2 lg:p-3 2xl:p-4 rounded-md shadow-md bg-white w-full"
              @click="handleRepairRequestDetail(repairRequest)"
            >
              <div
                class="flex flex-col justify-start items-start w-full sm:w-[60%] md:w-[30%]"
              >
                <h3
                  class="text-lg 2xl:text-xl font-bold text-primary-text text-left mb-2"
                >
                  {{ repairRequest.title }}
                </h3>
                <div class="flex justify-center items-center gap-2">
                  <ShieldAlert
                    class="w-8 h-8 mr-2"
                    :class="{
                      'text-yellow-300': repairRequest.urgency == 1,
                      'text-orange-500': repairRequest.urgency == 2,
                      'text-red-600': repairRequest.urgency == 3,
                      hidden: repairRequest.isRepaired,
                    }"
                  />
                  <BadgeCheck
                    class="w-8 h-8 mr-2 text-green-600"
                    :class="{
                      hidden: !repairRequest.isRepaired,
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
                          v-if="Array.isArray(repairRequest.loanableMaterial)"
                        >
                          <template
                            v-for="(loanableMaterial,
                            index) in repairRequest.loanableMaterial"
                          >
                            {{ loanableMaterial.name }}
                            <span
                              v-if="
                                index !==
                                repairRequest.loanableMaterial.length - 1
                              "
                              class="mr-1"
                              >,</span
                            >
                          </template>
                        </li>
                        <li v-else>
                          {{ repairRequest.loanableMaterial }}
                        </li>
                      </ul>
                    </div>
                    <div class="flex items-center">
                      <Warehouse
                        class="w-8 h-8 mr-2 opacity-10"
                        :class="{ 'opacity-100': repairRequest.room }"
                      />
                      <ul v-if="Array.isArray(repairRequest.room)">
                        <li
                          v-for="(room, index) in repairRequest.room"
                          :key="index"
                        >
                          {{ room.name }}
                          <span
                            v-if="index !== repairRequest.room.length - 1"
                            class="mr-1"
                            >,</span
                          >
                        </li>
                      </ul>
                      <p v-else>{{ repairRequest.room }}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="hidden md:flex flex-col text-left w-[25%]">
                <h4 class="font-bold text-primary-text">
                  {{ $t('repairRequest.requester') }}
                </h4>
                <div class="flex flex-col">
                  <div class="flex gap-2">
                    <h5 class="font-medium text-primary-text">
                      {{ $t('repairRequest.name') }}:
                    </h5>
                    <p v-if="repairRequest.requestUser.role !== 'GROUP'">
                      {{ repairRequest.requestUser.firstName }}
                      {{ repairRequest.requestUser.lastName }}
                    </p>
                    <p v-if="repairRequest.requestUser.role === 'GROUP'">
                      {{ repairRequest.requestUser.name }}
                    </p>
                  </div>
                  <div class="flex gap-2">
                    <h5 class="font-medium text-primary-text">
                      {{ $t('repairRequest.email') }}:
                    </h5>
                    <p>{{ repairRequest.requestUser.email }}</p>
                  </div>
                  <div class="flex gap-2">
                    <h5 class="font-medium text-primary-text">
                      {{ $t('repairRequest.role') }}:
                    </h5>
                    <p>{{ repairRequest.requestUser.role }}</p>
                  </div>
                </div>
              </div>
              <div
                class="hidden items-start text-start sm:flex flex-col w-[25%]"
              >
                <h4 class="font-bold text-primary-text">
                  {{ $t('repairRequest.description') }}
                </h4>
                <p>{{ repairRequest.description }}</p>
              </div>
            </button>
          </li>
        </ul>
      </div>
    </div>
    <RouterView />
  </div>
</template>

<style scoped></style>