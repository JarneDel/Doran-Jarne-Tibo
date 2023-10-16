<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue'
import Modal from '@/components/Modal.vue'
import { useRouter } from 'vue-router'
import { useQuery } from '@vue/apollo-composable'
import { IOneStockItem, ONE_STOCK } from '@/graphql/stock.query.ts'
import { Edit2, Minus, Plus } from 'lucide-vue-next'

export default defineComponent({
  components: {
    Modal,
    Edit2,
    Plus,
    Minus,
  },
  name: 'Item',
  setup: (props, ctx) => {
    const addAmount = ref<number>(0)
    const progressbar = ref<HTMLDivElement | null>(null)

    const { push, currentRoute } = useRouter()
    const id = computed(() => currentRoute.value.params.id)
    // region graphql
    const { error, loading, result } = useQuery<IOneStockItem>(ONE_STOCK, {
      id: id.value,
    })

    const widthPercentage = computed(() => {
      if (!result.value?.stockItem.idealStock) return 0
      if (result.value.stockItem.amountInStock === 0) return 0
      return (
        (result.value?.stockItem.amountInStock /
          result.value?.stockItem.idealStock) *
        100
      )
    })

    watch(progressbar, () => {
      if (!progressbar.value) return
      if (!widthPercentage.value) return
      console.log(widthPercentage.value)
      progressbar.value.style.width = widthPercentage.value + '%'
    })

    return {
      push,
      addAmount,
      result,
      error,
      loading,
      progressbar,
      widthPercentage,
    }
  },
})
</script>

<template>
  <Modal
    :title="result?.stockItem.name + ' - ' + result?.stockItem.service.name"
    @close="push('/admin/inventory')"
    max-width="max-w-xl"
  >
    <template v-slot:title>
      <div class="flex w-full flex-row items-center justify-between">
        <h2 class="w-full">
          <span class="text-xl font-bold">
            {{ result?.stockItem.name }}
          </span>
          <span class="text-base">
            - {{ result?.stockItem.service.name }}
          </span>
        </h2>
        <button
          class="bg-primary-surface hover:bg-primary-surface/80 active:bg-primary-surface/60 mr-2 self-end rounded-full p-2"
          @click="push('/admin/inventory/' + result?.stockItem.id + '/edit')"
        >
          <Edit2 />
        </button>
        <div></div>
      </div>
    </template>
    <template v-slot:default>
      <div v-if="result">
        <div>{{ result.stockItem.description }}</div>

        <div class="mt-2 flex w-1/2 flex-row items-center justify-between">
          <div>
            <div class="text-gray-6">{{ $t('inventory.amount') }}</div>
            <div class="text-bold text-lg">
              {{ result.stockItem.amountInStock }}
            </div>
          </div>
          <div>
            <div class="text-gray-6">{{ $t('inventory.idealStock') }}</div>
            <div class="text-bold text-right text-lg">
              {{ result.stockItem.idealStock }}
            </div>
          </div>
        </div>

        <div class="bg-primary-light h-3 w-1/2 rounded-full">
          <div ref="progressbar" class="bg-primary h-3 w-0 rounded-full"></div>
        </div>
        <button
          @click="subtractItems"
          class="bg-primary-surface hover:bg-primary-surface/80 active:bg-primary-surface/60 mr-2 self-end rounded-full p-2"
        >
          <Minus></Minus>
        </button>
        <input type="number" placeholder="0" class="w-12" v-model="addAmount" />
        <button
          @click="addItems"
          class="bg-primary-surface hover:bg-primary-surface/80 active:bg-primary-surface/60 mr-2 self-end rounded-full p-2"
        >
          <Plus></Plus>
        </button>

        <!--        <div v-if='success' ></div>-->
      </div>
    </template>
    <template v-slot:actions>
      <button>Report broken / missing item</button>
    </template>
  </Modal>
</template>

<style scoped></style>
