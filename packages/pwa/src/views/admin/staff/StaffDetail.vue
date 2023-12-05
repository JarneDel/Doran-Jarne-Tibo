<script lang="ts">
import { useRouter } from 'vue-router'
import { useQuery } from '@vue/apollo-composable'
import { STAFF_BY_ID } from '@/graphql/staff.query.ts'
import { computed, defineComponent, watch } from 'vue'

export default defineComponent({
  name: 'StaffDetail',
  setup(props, ctx) {
    const { currentRoute } = useRouter()
    const id = currentRoute.value.params.id

    const { result } = useQuery(STAFF_BY_ID, { id: id as string })
    const staff = computed(() => {
      return result.value?.staffItem
    })
    watch(staff, () => {
      console.log(result.value, staff.value)
    })

    return {
      staff,
      result,
    }
  },
})
</script>

<template>
  <div>StaffDetail</div>
  <div v-if="staff">
    {{ staff.firstName }}
  </div>
</template>

<style scoped></style>
