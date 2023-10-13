<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import {
  ALL_STOCK_AND_SERVICES,
  AllStockAndServices,
} from '@/graphql/stock.graphql.ts'
import {
  ArrowDownNarrowWide,
  ArrowUpDown,
  ArrowUpNarrowWide,
  Edit2,
  Search,
  ChevronRight,
} from 'lucide-vue-next'
import StyledButton from '@/components/generic/StyledButton.vue'
import Modal from '@/components/Modal.vue'

export default defineComponent({
  name: 'Overview',
  components: {
    Modal,
    StyledButton,
    Edit2,
    Search,
    ArrowDownNarrowWide,
    ArrowUpNarrowWide,
    ArrowUpDown,
    ChevronRight,
  },

  setup() {
    const search = ref<string>('')
    const searchServiceId = ref<string>('')
    const sortDirection = ref<string>('ASC')
    const sortField = ref<string>('name')
    const isModalShown = ref<boolean>(true)

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

    watch(isModalShown, (newValue, oldValue) => {
      console.log('watch isModalShown', newValue, oldValue)
    })

    return {
      error,
      loading,
      result,
      search,
      sortDirection,
      sortField,
      isModalShown,
      sortName,
      sortService,
      whereName,
      whereService,
    }
  },
})
</script>

<template>
  <Modal v-model:show="isModalShown"> content </Modal>

  <h2>Inventory overview</h2>

  <div class="mx-2xl max-w-7xl">
    <div class="flex items-center justify-between">
      <div class="py4 flex flex-row gap-4">
        <label class="grid grid-cols-1 grid-rows-1">
          <input
            type="text"
            :placeholder="$t('search')"
            @input.capture="whereName"
            class="p1 bg-primary-surface b-2 col-start-1 row-start-1 border-neutral-200 px-4"
          />
          <Search class="m2 col-start-1 row-start-1 mx-3 justify-self-end" />
        </label>
        <select
          id="service"
          name="service"
          @change="whereService"
          class="bg-primary-surface b-2 border-neutral-200 px-4"
        >
          <option value="">{{ $t('inventory.sort.service.all') }}</option>
          <option
            v-for="service of result.service"
            v-if="result"
            :key="service.id"
            :value="service.id"
          >
            {{ service.name }}
          </option>
        </select>
      </div>
      <div>
        <StyledButton type="button"> {{ $t('inventory.new') }}</StyledButton>
      </div>
    </div>

    <table class="w-full border-collapse border-spacing-0">
      <thead class="border-2 border-neutral-200 bg-neutral-200/60 text-left">
        <tr class="text-neutral-8">
          <th
            @click="sortName"
            class="gap2 flex cursor-pointer flex-row items-center"
          >
            <span>{{ $t('inventory.name') }}</span>
            <arrow-up-down :size="16" v-if="sortField !== 'name'" />
            <arrow-down-narrow-wide
              :size="16"
              v-else-if="sortDirection === 'DESC'"
            />
            <arrow-up-narrow-wide :size="16" v-else />
          </th>
          <th>Description</th>
          <th :title="$t('inventory.title.amount.tooltip')">
            {{ $t('inventory.amount') }}
          </th>
          <th
            class="flex cursor-pointer flex-row items-center gap-2"
            @click="sortService"
          >
            <span>{{ $t('inventory.service') }}</span>
            <arrow-up-down :size="16" v-if="sortField !== 'service'" />
            <arrow-down-narrow-wide
              :size="16"
              v-else-if="sortDirection === 'DESC'"
            />
            <arrow-up-narrow-wide :size="16" v-else />
          </th>
          <!--          <th>Actions</th>-->
          <th></th>
        </tr>
      </thead>
      <tbody v-if="result">
        <tr
          v-for="stock of result.stock"
          :key="stock.id"
          class="hover:bg-primary-light/20 transition-colors duration-200"
        >
          <td>{{ stock.name }}</td>
          <td :title="stock.description" class="truncate">
            {{ stock.description }}
          </td>
          <td :title="$t('inventory.title.amount.tooltip')">
            {{ stock.amountInStock }} / {{ stock.idealStock }}
          </td>
          <td :title="stock.service.description">{{ stock.service.name }}</td>
          <td class="gap4 flex flex-row justify-end">
            <router-link :to="`/administration/inventory/${stock.id}`">
              <Edit2 />
            </router-link>
            <button>
              <ChevronRight />
            </button>
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
  font-weight: 400;
  font-size: 0.875rem;
  padding-block: 12px;
  padding-inline: 16px;
}

td {
  padding-block: 8px;
  padding-inline: 16px;
  border-top: 2px solid #e6edfa;
}

table {
  border: 2px solid #e6edfa;
}

/*
   tbody tr:nth-child(odd) {
//   apply tailwind primary-surface color
//  background-color: #edf2fa;

*/

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
