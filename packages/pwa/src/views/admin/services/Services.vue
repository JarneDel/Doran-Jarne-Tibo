<script lang="ts">
import { defineComponent } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import {
  ALL_SERVICES_EXTENDED,
  AllServicesExtendedData,
} from '@/graphql/service.query.ts'

export default defineComponent({
  name: 'Services',
  setup() {
    const { result, error } = useQuery<AllServicesExtendedData>(
      ALL_SERVICES_EXTENDED,
    )
    return {
      result,
      error,
    }
  },
})
</script>

<template>
  <div v-if="result">
    {{ result }}
  </div>
</template>

<style scoped></style>
