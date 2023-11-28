<script lang="ts">
interface ISport {
  GetSportById: Sport
}

interface Sport {
  id: string
  name: string
  description: string
}

import { computed, defineComponent } from 'vue'
import Modal from '@/components/Modal.vue'
import { useRouter } from 'vue-router'
import { useMutation, useQuery } from '@vue/apollo-composable'
import { DELETE_SPORT, GET_SPORT } from '@/graphql/sport.query.ts'
import { Edit2, Trash2 } from 'lucide-vue-next'
import StyledButton from '@/components/generic/StyledButton.vue'

export default defineComponent({
  components: {
    StyledButton,
    Modal,
    Edit2,
    Trash: Trash2,
  },
  name: 'Item',
  setup: () => {
    const { push, replace, currentRoute } = useRouter()
    const id = computed(() => currentRoute.value.params.id)
    // region graphql
    const { error, loading, result } = useQuery<ISport>(
      GET_SPORT,
      {
        id: id.value,
      },
      {
        fetchPolicy: 'cache-and-network',
      },
    )
    const { mutate: deleteItem } = useMutation(DELETE_SPORT)

    const deleteItemWithConfirmation = (roomId: string) => {
      if (!confirm('Are you sure you want to delete this sport?')) return
      deleteItem({ roomId }).then(() => {
        replace('/admin/sports')
      })
    }

    return {
      push,
      result,
      error,
      loading,
      deleteItemWithConfirmation,
    }
  },
})
</script>

<template>
  <Modal max-width="max-w-md" @close="push('/admin/sports')">
    <template v-slot:title>
      <div class="flex w-full flex-row items-center justify-between">
        <h2 v-if="loading" class="mr-2 w-full text-lg font-bold">Loading...</h2>
        <h2
          v-if="!result?.GetSportById && !loading"
          class="mr-2 w-full text-lg font-bold"
        >
          No item found with this id
        </h2>
        <h3 class="text-primary-text mr-4 text-2xl font-bold">
          {{ result?.GetSportById.name }}
        </h3>
        <div>
          <button
            v-if="result?.GetSportById"
            class="bg-danger-surface hover:bg-danger-light active:bg-danger-light mr-2 self-end rounded-full p-2 transition-colors duration-100 ease-in-out"
            @click="deleteItemWithConfirmation(result?.GetSportById.id)"
          >
            <Trash :size="20" />
          </button>
          <button
            v-if="result?.GetSportById"
            class="bg-primary-surface hover:bg-primary-surface/80 active:bg-primary-surface/60 mr-2 self-end rounded-full p-2"
            @click="
              push('/admin/sports/id/' + result?.GetSportById.id + '/edit')
            "
          >
            <Edit2 :size="20" />
          </button>
        </div>
      </div>
    </template>
    <template v-slot:default>
      <div>
        {{ result?.GetSportById.description }}
      </div>
    </template>
  </Modal>
</template>

<style scoped></style>
