<script lang="ts">
interface Group {
  groups: [{ _id: string; name: string; btw_number: string; score: number }]
}

import { useMutation, useQuery } from '@vue/apollo-composable'
import { ALL_GROUPS, UPDATE_SCORE } from '@/graphql/group.query'
import { defineComponent, ref } from 'vue'
import UseFirebase from '@/composables/useFirebase'
import StyledButton from '@/components/generic/StyledButton.vue'
import { Minus, Plus } from 'lucide-vue-next'

export default defineComponent({
  setup() {
    const { firebaseUser } = UseFirebase()
    const idToken = ref()
    const getIdToken = async () => {
      idToken.value = await firebaseUser.value?.getIdToken()
    }
    getIdToken()
    const { mutate } = useMutation(UPDATE_SCORE)
    const { loading, result, error } = useQuery<Group>(ALL_GROUPS)
    const getScore = (score: number) => {
      let s: number = 0
      if (score != 0) {
        s = 50 + score
      } else if (score == 0) {
        s = 50
      }
      return s
    }
    const addScore = (id: string) => {
      mutate({ id: id, amount: 1 })
    }
    const removeScore = (id: string) => {
      mutate({ id: id, amount: -1 })
    }
    return {
      idToken,
      result,
      loading,
      error,
      getScore,
      addScore,
      removeScore,
      mutate,
    }
  },
  components: { StyledButton, Plus, Minus },
})
</script>

<template>
  <div class="m-8">
    <ul class="mx-auto grid grid-cols-3 gap-6">
      <li v-for="group in result?.groups" :key="group._id">
        <div class="h-full rounded-lg bg-white p-4 shadow-md">
          <p class="h-18 text-2xl">{{ group.name }}</p>
          <p class="text-lg">{{ group.btw_number }}</p>
          <div class="relative h-4 w-full">
            <div
              class="absolute h-4 w-full bg-gradient-to-r from-green-600 via-yellow-400 to-red-600"
            ></div>
            <div
              :class="`absolute h-4 w-px bg-black left-[${getScore(
                group.score,
              )}%]`"
            ></div>
          </div>
          <div class="flex items-center justify-between">
            <StyledButton class="my-2" @click="addScore(group._id)">
              <Plus />
            </StyledButton>
            <p class="text-lg">{{ getScore(group.score) }}</p>
            <StyledButton class="my-2" @click="removeScore(group._id)">
              <Minus />
            </StyledButton>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>
