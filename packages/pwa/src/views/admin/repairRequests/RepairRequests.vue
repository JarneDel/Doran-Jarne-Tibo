<script lang="ts">
// Interfaces
// interface Room {
//   id: string;
//   name: string;
//   sports: Sport[];
//   pricePerHour: number;
//   type: string;
//   createdAt: string;
//   updatedAt: string;
// }

// interface Sport {
//   id: string;
//   name: string;
// }

// Imports
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
      <h1>Title</h1>
      <p>Content</p>
    </div>
    <RouterView />
  </div>
</template>

<style scoped></style>
