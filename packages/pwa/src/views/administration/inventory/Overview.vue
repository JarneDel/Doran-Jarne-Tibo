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
  ChevronRight,
  Edit2,
  Search,
} from 'lucide-vue-next'
import StyledButton from '@/components/generic/StyledButton.vue'
import Modal from '@/components/Modal.vue'
import { useRouter } from 'vue-router'

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

  setup: function () {
    const search = ref<string>('')
    const searchServiceId = ref<string>('')
    const sortDirection = ref<string>('ASC')
    const sortFieldName = ref<string>('name')
    const isModalShown = ref<boolean>(true)

    const { error, loading, result, refetch } = useQuery<AllStockAndServices>(
      ALL_STOCK_AND_SERVICES,
      {
        searchName: search.value,
        orderDirection: sortDirection.value,
        orderByField: sortFieldName.value,
      },
    )
    const sortField = (field: string) => {
      if (sortFieldName.value === field) {
        sortDirection.value = sortDirection.value === 'ASC' ? 'DESC' : 'ASC'
      } else {
        sortFieldName.value = field
        sortDirection.value = 'asc'
      }
      fetchWithFilters()
    }

    const whereName = (e: Event) => {
      const target = e.target as HTMLInputElement
      search.value = target.value
      fetchWithFilters()
    }
    const whereService = (e: Event) => {
      const target = e.target as HTMLSelectElement
      searchServiceId.value = target.value
      fetchWithFilters()
    }

    const fetchWithFilters = () => {
      refetch({
        searchName: search.value,
        orderDirection: sortDirection.value,
        orderByField: sortFieldName.value,
        searchServiceId: searchServiceId.value,
      })
    }

    return {
      error,
      loading,
      result,
      search,
      sortDirection,
      sortFieldName,
      isModalShown,
      sortField,
      whereName,
      whereService,
    }
  },
})
</script>

<template>
  <RouterView />
  <h2>Inventory overview</h2>

  <div class="mx-2xl max-w-7xl">
    <div class="flex items-center justify-between">
      <div class="py4 flex flex-row gap-4">
        <label class="grid grid-cols-1 grid-rows-1">
          <input
            :placeholder="$t('search')"
            class="p1 bg-primary-surface b-2 col-start-1 row-start-1 border-neutral-200 px-4"
            type="text"
            @input.capture="whereName"
          />
          <Search class="m2 col-start-1 row-start-1 mx-3 justify-self-end" />
        </label>
        <select
          id="service"
          class="bg-primary-surface b-2 border-neutral-200 px-4"
          name="service"
          @change="whereService"
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
            class="gap2 flex cursor-pointer flex-row items-center"
            @click="sortField('name')"
          >
            <span>{{ $t('inventory.name') }}</span>
            <arrow-up-down v-if="sortFieldName !== 'name'" :size="16" />
            <arrow-down-narrow-wide
              v-else-if="sortDirection === 'DESC'"
              :size="16"
            />
            <arrow-up-narrow-wide v-else :size="16" />
          </th>
          <th>Description</th>
          <th
            :title="$t('inventory.title.amount.tooltip')"
            class="cursor-pointer"
            @click="sortField('amountInStock')"
          >
            <span>{{ $t('inventory.amount') }} &nbsp;</span>
            <arrow-up-down
              class="inline"
              v-if="sortFieldName !== 'amountInStock'"
              :size="16"
            />
            <arrow-down-narrow-wide
              class="inline"
              v-else-if="sortDirection === 'DESC'"
              :size="16"
            />
            <arrow-up-narrow-wide v-else :size="16" class="inline" />
          </th>
          <th
            class="flex cursor-pointer flex-row items-center gap-2"
            @click="sortField('service')"
          >
            <span>{{ $t('inventory.service') }}</span>
            <arrow-up-down v-if="sortFieldName !== 'service'" :size="16" />
            <arrow-down-narrow-wide
              v-else-if="sortDirection === 'DESC'"
              :size="16"
            />
            <arrow-up-narrow-wide v-else :size="16" />
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
            <router-link :to="`/admin/inventory/${stock.id}/edit`">
              <Edit2 />
            </router-link>
            <router-link :to="`/admin/inventory/${stock.id}`">
              <ChevronRight />
            </router-link>
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
