<script lang="ts">
// Imports
import { useQuery } from '@vue/apollo-composable';
import { ALL_SERVICES, IServices } from '@/graphql/service.query';
import { defineComponent, ref, watch } from 'vue';
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
    // All sports
    const {
      loading: loadingServices,
      result: resultServices,
      error: errorServices,
    } = useQuery<IServices>(ALL_SERVICES);

    const { lastRoute } = useLastRoute();

    watch(
      lastRoute,
      (value) => {
        if (value.startsWith('/admin/services/id/')) {
          fetchWithFilters();
        }
      },
      { immediate: true },
    );

    const fetchWithFilters = () => {
      console.log('fetching with filters');
    };

    return {
      idToken,
      resultServices,
      loadingServices,
      errorServices,
      push,
      replace,
      currentRoute,
    };
  },
});
</script>

<template>
  <div class="m-8">
    <div>
      <h1>Dit is een test zin!</h1>
      <ul>
        <li v-if="resultServices" v-for="service in resultServices.services">
          {{ service.name }}
        </li>
      </ul>
    </div>
    <RouterView />
  </div>
</template>

<style scoped></style>
