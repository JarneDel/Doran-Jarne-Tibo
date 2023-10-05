<script lang="ts">
interface Group {
  groups: [{ _id: string; name: string }]
}

import { useQuery } from '@vue/apollo-composable'
import { ALL_GROUPS } from '@/graphql/group.query'
import { defineComponent, ref } from 'vue'
import UseFirebase from '@/composables/useFirebase'

export default defineComponent({
  setup() {
    const { firebaseUser } = UseFirebase()
    const idToken = ref()

    const getIdToken = async () => {
      idToken.value = await firebaseUser.value?.getIdToken()
    }
    getIdToken()
    console.log(idToken.value)
    const { loading, result, error } = useQuery<Group>(ALL_GROUPS)
    return {
      idToken,
      result,
      loading,
      error,
    }
  },
})
</script>

<template>
  <ul>
    <li v-for="group in result?.groups" :key="group._id">
      {{ group.name }}
    </li>
  </ul>
</template>
