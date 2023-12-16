<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { useMutation, useQuery } from '@vue/apollo-composable'
import {
  ALL_STOCK_AND_SERVICES,
  getUpdatedStockItem,
  UPDATE_STOCK,
} from '@/graphql/stock.query.ts'
import {
  ArrowDownAz,
  ArrowDownNarrowWide,
  ArrowUpAz,
  ArrowUpDown,
  ArrowUpNarrowWide,
  ChevronRight,
  Edit2,
} from 'lucide-vue-next'
import StyledButton from '@/components/generic/StyledButton.vue'
import Modal from '@/components/Modal.vue'
import { useRouter } from 'vue-router'
import useLastRoute from '@/composables/useLastRoute.ts'
import DoubleClickEdit from '@/components/generic/DoubleClickEdit.vue'
import DoubleClickSelect from '@/components/generic/DoubleClickSelect.vue'
import Error from '@/components/Error.vue'
import { IUpdateItemOptional } from '@/interface/stock.interface.ts'
import useA11y from '@/composables/useA11y.ts'
import { useWindowSize } from '@vueuse/core'
import MobileAdd from '@/components/mobile/MobileAdd.vue'
import StyledInputText from '@/components/generic/StyledInputText.vue'
import Search from '@/components/input/search.vue'
import ServicesSelect from '@/components/input/ServicesSelect.vue'
import ErrorList from '@/components/ErrorList.vue'

export default defineComponent({
  name: 'Overview',
  components: {
    ErrorList,
    ServicesSelect,
    StyledInputText,
    MobileAdd,
    Error,
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
    ArrowUpAz,
    ArrowDownAz,
  },

  setup: function () {
    const search = ref<string>('')
    const searchServiceId = ref<string>('')
    const sortDirection = ref<string>('ASC')
    const sortFieldName = ref<string>('name')
    const isModalShown = ref<boolean>(true)
    const errorMessages = ref<string[]>([])
    const { push } = useRouter()

    // graphql
    const { error, loading, result, refetch } = useQuery(
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

    const { mutate: mutateUpdateItem, onError: onMutateUpdateItemError } =
      useMutation(UPDATE_STOCK)

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

    const whereName = (value: string) => {
      search.value = value
      fetchWithFilters()
    }
    const whereService = (value: string) => {
      searchServiceId.value = value
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

    onMutateUpdateItemError(err => {
      const originalError = err.graphQLErrors[0].extensions.originalError as any
      if (!originalError || !originalError.message)
        return console.log('no message')

      console.log({ originalError })
      originalError.message.forEach((message: string) => {
        errorMessages.value.push(message)
      })
    })

    return {
      error,
      loading,
      searchServiceId,
      result,
      search,
      sortDirection,
      sortFieldName,
      isModalShown,
      errorMessages,
      sortField,
      whereName,
      whereService,
      push,
      updateItem,
      MOBILE_VIEWPORT_SIZE: useA11y().MOBILE_VIEWPORT_SIZE,
      windowWidth: useWindowSize().width,
    }
  },
})
</script>

<template>
  <RouterView />
  <ErrorList :error-messages="errorMessages"></ErrorList>
  <div class="mx-a mt-8 max-w-7xl">
    <div class="flex flex-row items-center justify-between gap-4">
      <div class="sm:w-unset flex w-full flex-col gap-4 sm:flex-row">
        <Search :placeholder="$t('search')" @input="whereName" />
        <ServicesSelect
          v-if="result"
          :content="result.services"
          :empty-option="{
            value: '',
            text: $t('inventory.sort.service.all'),
          }"
          @change="whereService"
        />
      </div>
      <StyledButton
        v-if="windowWidth > MOBILE_VIEWPORT_SIZE"
        type="button"
        @click="push('/admin/inventory/new')"
      >
        {{ $t('inventory.new') }}
      </StyledButton>
    </div>
    <MobileAdd
      v-if="windowWidth < MOBILE_VIEWPORT_SIZE"
      @click="$router.push('/admin/inventory/new')"
    />

    <div class="flex w-full items-center justify-between">
      <div class="py4 flex w-full flex-col gap-4 sm:flex-row"></div>
      <div class="flex w-full justify-end"></div>
    </div>

    <table class="w-full border-collapse text-sm">
      <thead>
        <tr class="border-b text-left transition-colors">
          <th class="cursor-pointer" @click="sortField('name')">
            <button class="gap2 flex flex-row items-center">
              <span>{{ $t('inventory.name') }}</span>
              <arrow-up-down v-if="sortFieldName !== 'name'" :size="16" />
              <arrow-up-az v-else-if="sortDirection === 'DESC'" :size="16" />
              <arrow-down-az v-else :size="16" />
            </button>
          </th>
          <th v-if="MOBILE_VIEWPORT_SIZE < windowWidth">
            {{ $t('inventory.description') }}
          </th>
          <th
            :title="$t('inventory.title.amount.tooltip')"
            class="cursor-pointer"
            @click="sortField('amountInStock')"
          >
            <button class="flex flex-row items-center gap-2">
              <span v-if="MOBILE_VIEWPORT_SIZE < windowWidth"
                >{{ $t('inventory.amount') }} &nbsp;</span
              >
              <span v-else> # &nbsp; </span>
              <arrow-up-down
                v-if="sortFieldName !== 'amountInStock'"
                :size="16"
                class="inline"
              />
              <arrow-up-az
                v-else-if="sortDirection === 'DESC'"
                :size="16"
                class="inline"
              />
              <arrow-down-az v-else :size="16" class="inline" />
            </button>
          </th>
          <th class="cursor-pointer" @click="sortField('service')">
            <button class="flex flex-row items-center gap-2">
              <span>{{ $t('inventory.service') }}</span>
              <arrow-up-down v-if="sortFieldName !== 'service'" :size="16" />
              <arrow-up-az v-else-if="sortDirection === 'DESC'" :size="16" />
              <arrow-down-az v-else :size="16" />
            </button>
          </th>
          <!--          <th>Actions</th>-->
          <th></th>
        </tr>
      </thead>
      <tbody
        v-if="result && result.stock.length > 0"
        :class="{ loader: loading }"
      >
        <tr
          v-for="stock of result.stock"
          :key="stock.id"
          class="hover:bg-primary-light/20 border-b transition-colors duration-200"
        >
          <td>
            <DoubleClickEdit
              :value="stock.name"
              @submit="newValue => updateItem(stock.id, { name: newValue })"
            />
          </td>
          <td
            v-if="MOBILE_VIEWPORT_SIZE < windowWidth"
            :title="stock.description"
            class="truncate"
          >
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
      <tbody
        v-else-if="
          result && result.stock.length === 0 && (search || searchServiceId)
        "
      >
        <tr>
          <td class="text-center" colspan="5">
            {{ $t('inventory.noItemsQuery') }}
          </td>
        </tr>
      </tbody>
      <tbody v-else-if="result && result.stock.length === 0">
        <tr>
          <td class="text-center" colspan="5">
            {{ $t('inventory.noItems') }}
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
</template>

<style scoped>
.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

th {
  @apply h-12 text-left align-middle font-medium;
}

td {
  @apply py2 align-middle;
}

th:first-child,
td:first-child {
  @apply pl-4;
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
