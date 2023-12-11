<script lang="ts">
interface Group {
  groups: [{ id: string;email:string; name: string; btwNumber: string; score: number }]
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
    <div class="mx-auto w-fit grid 2xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 gap-6">
      <div v-for="group in result?.groups" :key="group.id" class="2xl:w-75 xl:w-70 md:w-55 h-full rounded-lg bg-white p-4 shadow-md">

          <p class=" xl:h-20 h-16 xl:text-2xl text-xl">{{ group.name }}</p>
          <p class="xl:text-lg text-base h-5">{{ group.email }}</p>
          <p class="xl:text-lg text-base h-5 my-2">{{ group.btwNumber }}</p>
          <p class="xl:text-lg text-base ">Score:</p>
          <div class="relative h-4 w-full rounded-md overflow-hidden">
            <div
            class="absolute h-4 w-full bg-gradient-to-r from-green-600 via-yellow-400 to-red-600"
            ></div>
            
            <div
              :class="`absolute h-4 w-px bg-black left-[${
                group.score}%]`"
            ></div>
          </div>
          <div class="flex items-center justify-between">
            <StyledButton class="my-2" @click="removeScore(group.id)">
              <Minus class="xl:h-4 h-3"/>
            </StyledButton>
            <p class="xl:text-lg lg:text-base">{{ group.score}}</p>
            <StyledButton class="my-2" @click="addScore(group.id)">
              <Plus class="xl:h-4 h-3"/>
            </StyledButton>
          </div>
        </div>

      </div>
  </div>
</template>
