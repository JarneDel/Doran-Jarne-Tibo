<script lang="ts">
import { defineComponent } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import { ALL_STOCK, AllStock } from '@/graphql/stock.graphql.ts'

export default defineComponent({
  name: 'Overview',
  setup() {
    const { error, loading, result } = useQuery<AllStock>(ALL_STOCK)
    return {
      error,
      loading,
      result,
    }
  },
})
</script>

<template>
  <h2>Inventory overview</h2>
  <div
    v-if="!loading && result"
    class="mx-2xl overflow-hidden rounded-lg shadow-lg"
  >
    <table class="w-full border-separate border-spacing-0">
      <thead class="bg-primary-light rounded-t-lg text-left">
        <tr>
          <th>Name</th>
          <th>Description</th>
          <th>Amount</th>
          <th>Service</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="stock of result.stock" :key="stock.id">
          <td>{{ stock.name }}</td>
          <td :title="stock.description" class="truncate">
            {{ stock.description }}
          </td>
          <td>{{ stock.amountInStock }} / {{ stock.idealStock }}</td>
          <td :title="stock.service.description">{{ stock.service.name }}</td>
          <td>
            <router-link :to="`/administration/inventory/${stock.id}`"
              >Edit
            </router-link>
            <button>delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <div v-if="loading">Loading...</div>
</template>

<style scoped>
.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

th {
  font-weight: 500;
  font-size: 1.125rem;
  padding-block: 12px;
  padding-inline: 16px;
}
td {
  padding-block: 12px;
  padding-inline: 16px;
}
tbody tr:nth-child(odd) {
  /* apply tailwind primary-surface color */
  background-color: #edf2fa;
}
</style>
