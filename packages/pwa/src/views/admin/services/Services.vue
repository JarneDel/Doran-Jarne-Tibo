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
import StyledButton from '@/components/generic/StyledButton.vue';
import StyledLable from '@/components/generic/StyledLable.vue';

// Export default
export default defineComponent({
  components: {
    PlusCircle,
    Modal,
    DoubleClickEdit,
    StyledButton,
    StyledLable,
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
      refetch: refetchServices,
    } = useQuery<IServices>(
      ALL_SERVICES,
      {},
      { fetchPolicy: 'cache-and-network' },
    );

    const { lastRoute } = useLastRoute();

    watch(
      lastRoute,
      (value) => {
        console.log(value);
        if (value.startsWith('/admin/services/id/')) {
          fetchWithFilters();
        }
      },
      { immediate: true },
    );

    const fetchWithFilters = () => {
      refetchServices();
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
    <div class="m-auto max-w-4xl 2xl:max-w-6xl">
      <div class="flex justify-between mb-4">
        <h1
          class="font-bold text-center lg:text-left text-primary-text text-3xl xl:text-4xl"
        >
          {{ $t('service.services') }}
        </h1>
        <StyledButton type="button" @click="push('/admin/services/create')">
          {{ $t('inventory.new') }}
        </StyledButton>
      </div>
      <ul
        class="grid lg:grid-cols-2 2xl:grid-cols-3 grid-content-around justify-center gap-4 lg:gap-6 xl:gap-8"
      >
        <li
          class="h-full"
          v-if="resultServices"
          v-for="service in resultServices.services"
        >
          <button
            class="flex flex-col bg-white text-left rounded-md w-full shadow-md p-2 lg:p-3 xl:p-4 h-full max-w-md"
            @click="push('/admin/services/id/' + service.id)"
          >
            <h3 class="font-bold text-primary-text text-xl mb-2">
              {{ service.name }}
            </h3>
            <div>
              <div class="flex flex-col gap-1">
                <h4 class="font-medium text-primary-text">
                  {{ $t('service.rooms') }}:
                </h4>
                <ul class="flex flex-wrap gap-x-2 gap-y-1">
                  <StyledLable type="room" v-for="room in service.rooms">
                    {{ room.name }}
                  </StyledLable>
                </ul>
              </div>
              <div>
                <div class="flex gap-1">
                  <h4 class="font-medium text-primary-text">
                    {{ $t('service.staff') }}:
                  </h4>
                  <p class="">{{ service.staff.length }}</p>
                </div>
              </div>
              <div>
                <div>
                  <h4 class="font-medium text-primary-text">
                    {{ $t('service.description') }}:
                  </h4>
                  <p class="">{{ service.description }}</p>
                </div>
              </div>
            </div>
          </button>
        </li>
      </ul>
    </div>
    <RouterView />
  </div>
</template>

<style scoped></style>
