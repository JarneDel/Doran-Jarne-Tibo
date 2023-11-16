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
import { Warehouse, Box } from 'lucide-vue-next';
import Modal from '@/components/Modal.vue';
import { useRouter } from 'vue-router';
import DoubleClickEdit from '@/components/generic/DoubleClickEdit.vue';
import useLastRoute from '@/composables/useLastRoute';

// Export default
export default defineComponent({
  components: {
    Warehouse,
    Box,
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
    } = useQuery<IRepairRequest>(ALL_REPAIR_REQUESTS);

    console.log(resultRepairRequests);

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

    return {
      idToken,
      loadingRepairRequests,
      resultRepairRequests,
      errorRepairRequests,
      push,
      replace,
      currentRoute,
    };
  },
});
</script>

<template>
  <div class="m-8">
    <div class="flex flex-col">
      <div>
        <h1 class="text-3xl font-bold mb-6">Repair Requests</h1>
        <ul class="flex flex-col w-full h-200 overflow-auto gap-2">
          <li
            :key="repairRequest.id"
            v-for="repairRequest in resultRepairRequests?.GetAllRepairRequests"
          >
            <Button class="flex p-2 rounded-md shadow-md bg-white w-full">
              <div>
                <div class="flex flex-col">
                  <div class="flex items-center">
                    <Box
                      class="w-8 h-8 mr-2 opacity-10"
                      :class="{ 'opacity-100': repairRequest.loanableMaterial }"
                    />
                    <ul class="overflow-auto">
                      <li
                        v-for="loanableMaterial in repairRequest.loanableMaterial"
                      >
                        {{ loanableMaterial.name }}
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
              <div>2</div>
            </Button>
          </li>
        </ul>
      </div>
    </div>
    <RouterView />
  </div>
</template>

<style scoped></style>
