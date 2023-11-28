<script lang="ts">
// Interfaces
interface Sports {
  GetAllSports: [
    {
      id: string
      name: string
      createdAt: string
      updatedAt: string
    },
  ]
}

// Imports
import { useQuery } from '@vue/apollo-composable'
import { ALL_SPORTS } from '@/graphql/sport.query'
import { defineComponent, ref, watch } from 'vue'
import UseFirebase from '../../../composables/useFirebase'
import { PlusCircle } from 'lucide-vue-next'
import Modal from '@/components/Modal.vue'
import DoubleClickEdit from '@/components/generic/DoubleClickEdit.vue'
import useLastRoute from '@/composables/useLastRoute'
import { useRouter } from 'vue-router'

// Export default
export default defineComponent({
  components: {
    PlusCircle,
    Modal,
    DoubleClickEdit,
  },
  setup() {
    // Router
    const { push } = useRouter()
    // Firebase
    const { firebaseUser } = UseFirebase()
    const idToken = ref()
    const getIdToken = async () => {
      idToken.value = await firebaseUser.value?.getIdToken()
    }
    getIdToken()
    // All sports
    const {
      loading: loadingSports,
      result: resultSports,
      error: errorSports,
    } = useQuery<Sports>(ALL_SPORTS)

    const { lastRoute } = useLastRoute()

    watch(
      lastRoute,
      value => {
        if (value.startsWith('/admin/rooms/id/')) {
          fetchWithFilters()
        }
      },
      { immediate: true },
    )

    const fetchWithFilters = () => {
      console.log('fetchWithFilters')
    }

    return {
      idToken,
      resultSports,
      loadingSports,
      errorSports,
      push,
    }
  },
})
</script>

<template>
  <div class="m-8">
    <ul class="m-2 flex flex-wrap justify-center gap-4">
      <li v-for="sport in resultSports?.GetAllSports">
        <button
          :key="sport.id"
          :id="sport.id"
          :name="sport.name"
          @click="push('/admin/sports/id/' + sport.id)"
          class="text-primary-text flex h-20 w-40 items-center justify-center rounded-md bg-white text-center text-xl font-bold shadow-md"
        >
          {{ sport.name }}
        </button>
      </li>
    </ul>
    <RouterView />
  </div>
</template>

<style scoped></style>
