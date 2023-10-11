<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import {
  ALL_STOCK_AND_SERVICES,
  AllStockAndServices,
} from '@/graphql/stock.graphql.ts'

export default defineComponent({
  name: 'Overview',
  setup() {
    const search = ref<string>('')
    const searchServiceId = ref<string>('')
    const sortDirection = ref<string>('ASC')
    const sortField = ref<string>('name')

    const { error, loading, result, refetch } = useQuery<AllStockAndServices>(
      ALL_STOCK_AND_SERVICES,
      {
        searchName: search.value,
        // searchServiceId: searchServiceId.value,
        orderDirection: sortDirection.value,
        orderByField: sortField.value,
      },
    )
    const sortName = () => {
      console.log('sortName')
      if (sortField.value === 'name') {
        sortDirection.value = sortDirection.value === 'ASC' ? 'DESC' : 'ASC'
        console.log(sortDirection.value)
      } else {
        sortField.value = 'name'
        sortDirection.value = 'asc'
      }
      fetchWithFilters()
    }
    const sortService = () => {
      console.log('sortService')
      if (sortField.value === 'service') {
        sortDirection.value = sortDirection.value === 'ASC' ? 'DESC' : 'ASC'
      } else {
        sortField.value = 'service'
        sortDirection.value = 'asc'
      }
      fetchWithFilters()
    }

    const whereName = (e: Event) => {
      const target = e.target as HTMLInputElement
      search.value = target.value
      fetchWithFilters()
    }

    const fetchWithFilters = () => {
      refetch({
        searchName: search.value,
        orderDirection: sortDirection.value,
        orderByField: sortField.value,
        searchServiceId: searchServiceId.value,
      })
    }

    const whereService = (e: Event) => {
      const target = e.target as HTMLSelectElement
      searchServiceId.value = target.value
      fetchWithFilters()
    }

    return {
      error,
      loading,
      result,
      search,
      sortName,
      sortService,
      whereName,
      whereService,
    }
  },
})
</script>

<template>
  <h2>Inventory overview</h2>
  <input type="text" @input.capture="whereName" />
  <select id="service" name="service" @change="whereService">
    <option value="">All</option>
    <option
      v-for="service of result.service"
      v-if="result"
      :key="service.id"
      :value="service.id"
    >
      {{ service.name }}
    </option>
  </select>

  <div class="mx-2xl overflow-hidden rounded-lg shadow-lg">
    <table class="w-full border-separate border-spacing-0">
      <thead class="bg-primary-light rounded-t-lg text-left">
        <tr>
          <th @click="sortName">Name</th>
          <th>Description</th>
          <th>Amount</th>
          <th @click="sortService">Service</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody v-if="result">
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
      <tbody v-else>
        <tr v-for="_ of 5" class="loader">
          <td v-for="_ of 5" class="loader">loading</td>
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

.loader {
  animation: blink 1s infinite;
}

@keyframes blink {
  0% {
    background-color: white;
  }
  50% {
    background-color: #edf2fa;
  }
  100% {
    background-color: #fff;
  }
}
</style>
