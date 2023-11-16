<script lang="ts">
// Interfaces
interface IRepairRequest {
  GetAllRepairRequests: [RepairRequest];
}

// Imports
import { RepairRequest } from '@/interface/repairRequestInterface';
import { defineComponent, ref, watch } from 'vue';
import { useQuery } from '@vue/apollo-composable';
import { ALL_REPAIR_REQUESTS } from '@/graphql/repairRequests.query';
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
    <div v-for="repairRequest in resultRepairRequests">
      {{ repairRequest }}
    </div>
    <RouterView />
  </div>
</template>

<style scoped></style>
