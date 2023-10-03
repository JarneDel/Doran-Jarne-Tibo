<script lang="ts">
import { useQuery } from '@vue/apollo-composable'
import { ALL_GROUPS } from '@/graphql/group.query'
import { ALL_STOCK } from '@/graphql/stock.graphql'
import { defineComponent, ref } from 'vue'
import UseFirebase from '@/composables/useFirebase'
interface Group {
  groups:[{ _id: string; name: string }]
}

export default defineComponent({
  setup() {
    const { firebaseUser } = UseFirebase()
    const idToken = ref()

    const getIdToken = async () => {
      idToken.value = await firebaseUser.value?.getIdToken()
    }
    getIdToken()
    const { loading, result, error } = useQuery<Group>(ALL_GROUPS)
    const {loading:loadingStock, result:resultStock, error:errorStock} = useQuery<Group>(ALL_STOCK)
    return {
      idToken,
      result,
      loading,
      error,
      resultStock,
      loadingStock,
      errorStock
    }
  },
})
</script>

<template>
  <div>
    {{ idToken }}
    <div >
      <ul>
        <li v-for="group in result?.groups" :key="group._id">
          {{ group.name }}
        </li>
      </ul>
    </div>
    <div >
      <ul>
        <li v-for="stock in resultStock?.stock" :key="stock._id">
          {{ stock.name }}
        </li>
      </ul>
    </div>
  <div>
    loading
  </div>
  </div>
</template>

<style scoped></style>
