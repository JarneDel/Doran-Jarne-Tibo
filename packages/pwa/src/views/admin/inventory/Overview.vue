<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { useMutation, useQuery } from '@vue/apollo-composable'
import {
  ALL_STOCK_AND_SERVICES,
  AllStockAndServices,
  getUpdatedStockItem,
  IUpdateItemOptional,
  UPDATE_STOCK,
} from '@/graphql/stock.query.ts'
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
import useLastRoute from '@/composables/useLastRoute.ts'
import DoubleClickEdit from '@/components/generic/DoubleClickEdit.vue'
import DoubleClickSelect from '@/components/generic/DoubleClickSelect.vue'

export default defineComponent({
  name: 'Overview',
  components: {
    DoubleClickSelect,
    DoubleClickEdit,
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

    const { push } = useRouter()

    // graphql
    const { error, loading, result, refetch } = useQuery<AllStockAndServices>(
      ALL_STOCK_AND_SERVICES,
      {
        searchName: search.value,
        orderDirection: sortDirection.value,
        orderByField: sortFieldName.value,
      },
      {
        nextFetchPolicy: 'cache-and-network',
        fetchPolicy: 'cache-and-network',
      },
    )

    const { mutate: mutateUpdateItem } = useMutation(UPDATE_STOCK)

    /**
     * Sorts the table by the given field and requests the data again
     * @param field
     */
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

    const { lastRoute } = useLastRoute()
    watch(
      lastRoute,
      value => {
        console.log(lastRoute)
        if (value.startsWith('/admin/inventory/')) {
          console.log('refetching')
          fetchWithFilters()
        }
      },
      { immediate: true },
    )

    const updateItem = (
      id: string,
      fieldsToUpdate: Partial<IUpdateItemOptional>,
    ) => {
      const stockItem = result.value?.stock.find(s => s.id == id)
      if (!stockItem) return
      mutateUpdateItem({
        updateStockInput: getUpdatedStockItem(stockItem, fieldsToUpdate),
      }).then(() => {
        fetchWithFilters()
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
      push,
      updateItem,
    }
  },
})
</script>

<template>
  <RouterView />
  <div class="mx-a max-w-7xl">
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
            v-for="service of result.services"
            v-if="result"
            :key="service.id"
            :value="service.id"
          >
            {{ service.name }}
          </option>
        </select>
      </div>
      <div>
        <StyledButton type="button" @click="push('/admin/inventory/new')">
          {{ $t('inventory.new') }}
        </StyledButton>
      </div>
    </div>

    <table class="w-full border-collapse border-spacing-0">
      <thead class="border-2 border-neutral-200 bg-neutral-200/60 text-left">
        <tr class="text-neutral-8">
          <th class="cursor-pointer" @click="sortField('name')">
            <button class="gap2 flex flex-row items-center">
              <span>{{ $t('inventory.name') }}</span>
              <arrow-up-down v-if="sortFieldName !== 'name'" :size="16" />
              <arrow-down-narrow-wide
                v-else-if="sortDirection === 'DESC'"
                :size="16"
              />
              <arrow-up-narrow-wide v-else :size="16" />
            </button>
          </th>
          <th>{{ $t('inventory.description') }}</th>
          <th
            :title="$t('inventory.title.amount.tooltip')"
            class="cursor-pointer"
            @click="sortField('amountInStock')"
          >
            <button class="flex flex-row items-center gap-2">
              <span>{{ $t('inventory.amount') }} &nbsp;</span>
              <arrow-up-down
                v-if="sortFieldName !== 'amountInStock'"
                :size="16"
                class="inline"
              />
              <arrow-down-narrow-wide
                v-else-if="sortDirection === 'DESC'"
                :size="16"
                class="inline"
              />
              <arrow-up-narrow-wide v-else :size="16" class="inline" />
            </button>
          </th>
          <th class="cursor-pointer" @click="sortField('service')">
            <button class="flex flex-row items-center gap-2">
              <span>{{ $t('inventory.service') }}</span>
              <arrow-up-down v-if="sortFieldName !== 'service'" :size="16" />
              <arrow-down-narrow-wide
                v-else-if="sortDirection === 'DESC'"
                :size="16"
              />
              <arrow-up-narrow-wide v-else :size="16" />
            </button>
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
          <td>
            <DoubleClickEdit
              :value="stock.name"
              @submit="newValue => updateItem(stock.id, { name: newValue })"
            />
          </td>
          <td :title="stock.description" class="truncate">
            <DoubleClickEdit
              :value="stock.description"
              @submit="
                newValue => updateItem(stock.id, { description: newValue })
              "
            />
          </td>
          <td
            :class="{
              'text-primary': stock.amountInStock >= stock.idealStock,
              'text-warning': stock.amountInStock < stock.idealStock,
            }"
            :title="$t('inventory.title.amount.tooltip')"
          >
            <DoubleClickEdit
              :value="stock.amountInStock"
              type="number"
              @submit="
                newValue => updateItem(stock.id, { amountInStock: newValue })
              "
            />
            /
            <DoubleClickEdit
              :value="stock.idealStock"
              type="number"
              @submit="
                newValue => updateItem(stock.id, { idealStock: newValue })
              "
            />
          </td>
          <td :title="stock.service.description">
            <DoubleClickSelect
              :options="
                result.services.reduce((service: Record<string, string>, s) => {
                  service[s.id] = s.name
                  return service
                }, {})
              "
              :selected="{ key: stock.service.id, value: stock.service.name }"
              @submit="
                newValue => updateItem(stock.id, { serviceId: newValue })
              "
            />
          </td>
          <td class="gap4 flex flex-row justify-end">
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

.text-primary {
  @apply text-primary;
}

.text-warning {
  @apply text-danger;
}
</style>
