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
      <ul
        class="flex flex-wrap justify-center gap-4 lg:justify-between flex-col lg:flex-row"
      >
        <li v-if="resultServices" v-for="service in resultServices.services">
          <div
            class="bg-white rounded-md shadow-md p-2 sm:p-3 md:p-4 lg:p-5 xl:p-6 min-w-sm max-w-md"
          >
            <h3 class="font-bold text-primary-text text-xl mb-2">
              {{ service.name }}
            </h3>
            <div>
              <div class="flex gap-1">
                <h4 class="font-medium text-primary-text">Rooms:</h4>
                <p class="">{{ service.rooms.length }}</p>
              </div>
              <div>
                <div class="flex gap-1">
                  <h4 class="font-medium text-primary-text">Staff:</h4>
                  <p class="">{{ service.staff.length }}</p>
                </div>
              </div>
              <div>
                <div>
                  <h4 class="font-medium text-primary-text">Description:</h4>
                  <p class="">{{ service.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <RouterView />
  </div>
</template>

<style scoped></style>
