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
          <div class="flex flex-col">
          <label class="xl:text-lg text-base " :for="group.id">Score:</label>
          <input
            @change="(e:Event) =>updateScore(group.id,100-parseInt(e.target.value))"
            class=" my-2 slider h-4 rounded-md outline-none duration-200 opacity-70 hover:opacity-100 appearance-none bg-gradient-to-r from-red-600 via-yellow-400 to-green-600"
            :id="group.id"
            type="range"
            :value="100-group.score"
          />
          </div>
          <div class="flex items-center justify-between">
            <StyledButton class="my-2" @click="updateScore(group.id,group.score+1)">
              <Minus class="xl:h-4 h-3"/>
            </StyledButton>
            <p class="xl:text-lg lg:text-base">{{ group.score}}</p>
            <StyledButton class="my-2" @click="updateScore(group.id,group.score-1)">
              <Plus class="xl:h-4 h-3"/>
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

.slider:focus
{
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
