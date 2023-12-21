<script lang="ts">
interface Group {
  groups: [
    {
      id: string
      email: string
      name: string
      btwNumber: string
      score: number
    },
  ]
}

import { useMutation, useQuery } from '@vue/apollo-composable'
import { ALL_GROUPS, UPDATE_SCORE } from '@/graphql/group.query'
import { defineComponent, ref } from 'vue'
import UseFirebase from '@/composables/useFirebase'
import StyledButton from '@/components/generic/StyledButton.vue'
import { Minus, Plus, ChevronRight, ChevronLeft } from 'lucide-vue-next'

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
    const updateScore = (id: string, amount: number) => {
      mutate({ id: id, amount: amount })
    }

    return {
      idToken,
      result,
      loading,
      error,
      getScore,
      updateScore,
      mutate,
    }
  },
  components: { StyledButton, Plus, Minus,ChevronRight,ChevronLeft},
})
</script>

<template>
  <div class="m-8">
    <div
      class="mx-auto grid w-fit gap-6 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
    >
      <div
        v-for="group in result?.groups"
        :key="group.id"
        class="2xl:w-75 xl:w-70 md:w-55 h-full rounded-lg bg-white p-4 shadow-md"
      >
        <p class="h-16 text-xl xl:h-20 xl:text-2xl">{{ group.name }}</p>
        <p class="h-5 text-base xl:text-lg">{{ group.email }}</p>
        <p class="my-2 h-5 text-base xl:text-lg">{{ group.btwNumber }}</p>
        <div class="flex flex-col">
          <label :for="group.id" class="text-base xl:text-lg">Score:</label>
          <input
            :id="group.id"
            :value="100 - group.score"
            class="slider my-2 h-4 appearance-none rounded-md bg-gradient-to-r from-red-600 via-yellow-400 to-green-600 opacity-70 outline-none duration-200 hover:opacity-100"
            type="range"
            @change="
              (e: Event) =>
                updateScore(
                  group.id,
                  100 - parseInt((e.target as HTMLInputElement).value),
                )
            "
          />
        </div>
        <div class="flex items-center justify-between">
          <StyledButton
            class="my-2"
            @click="updateScore(group.id, group.score + 1)"
          >
            <ChevronLeft class="h-3 xl:h-4" />
          </StyledButton>
          <p class="lg:text-base xl:text-lg">{{ group.score }}</p>
          <StyledButton
            class="my-2"
            @click="updateScore(group.id, group.score - 1)"
          >
            <ChevronRight class="h-3 xl:h-4" />
          </StyledButton>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 5px;
  height: 25px;
  border-radius: 8px;
  background: black;
  cursor: pointer;
}

.slider:focus {
  outline: #f5cb5c auto 8px;
}

.slider::-moz-range-thumb {
  width: 5px;
  height: 25px;
  border-radius: 8px;
  background: black;
  cursor: pointer;
}
</style>
