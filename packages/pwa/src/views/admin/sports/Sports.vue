<script lang="ts">
// Vue
import { defineComponent, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
// Components
import Modal from '@/components/modal/Modal.vue'
import DoubleClickEdit from '@/components/generic/DoubleClickEdit.vue'
import StyledButton from '@/components/generic/StyledButton.vue'
// Composables
import useLastRoute from '@/composables/useLastRoute'
import UseFirebase from '@/composables/useFirebase'
// GraphQL
import { ALL_SPORTS } from '@/graphql/sport.query'
// Apollo
import { useQuery } from '@vue/apollo-composable'
// Lucide
import { PlusCircle } from 'lucide-vue-next'
// Interfaces
import { ISports } from '@/interface/sportInterface'

// Export default
export default defineComponent({
  components: {
    PlusCircle,
    StyledButton,
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
      refetch: refetchSports,
    } = useQuery<ISports>(ALL_SPORTS, {}, { fetchPolicy: 'cache-and-network' })

    // Watch last route
    const { lastRoute } = useLastRoute()
    watch(
      lastRoute,
      value => {
        console.log(value)
        if (value.startsWith('/admin/sports/id/')) {
          fetchWithFilters()
        }
      },
      { immediate: true },
    )

    // Fetch with filters
    const fetchWithFilters = () => {
      refetchSports()
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
    <div class="m-auto max-w-4xl">
      <div class="flex justify-between">
        <h1 class="text-primary-text text-3xl font-bold xl:text-4xl">
          {{ $t('sports.sports') }}
        </h1>
        <StyledButton type="button" @click="push('/admin/sports/create')">
          {{ $t('inventory.new') }}
        </StyledButton>
      </div>
      <ul
        class="my-2 flex flex-wrap justify-between gap-4 md:my-4 lg:my-6 xl:my-8"
      >
        <li v-for="sport in resultSports?.GetAllSports">
          <button
            :id="sport.id"
            :key="sport.id"
            :name="sport.name"
            class="text-primary-text flex h-20 w-40 items-center justify-center rounded-md bg-white text-center text-xl font-bold shadow-md"
            @click="push('/admin/sports/id/' + sport.id)"
          >
            {{ sport.name }}
          </button>
        </li>
      </ul>
    </div>
    <RouterView />
  </div>
</template>

<style scoped></style>
