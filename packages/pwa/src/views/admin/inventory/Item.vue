<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue'
import Modal from '@/components/Modal.vue'
import { useRouter } from 'vue-router'
import { useMutation, useQuery } from '@vue/apollo-composable'
import { DELETE_STOCK, ONE_STOCK } from '@/graphql/stock.query.ts'
import { Edit2, Trash2 } from 'lucide-vue-next'
import StyledButton from '@/components/generic/StyledButton.vue'
import useA11y from '@/composables/useA11y.ts'

export default defineComponent({
  components: {
    StyledButton,
    Modal,
    Edit2,
    Trash: Trash2,
  },
  name: 'Item',
  setup: () => {
    const progressbar = ref<HTMLDivElement | null>(null)

    const { push, replace, currentRoute } = useRouter()
    const { setPageTitle } = useA11y()
    const id = computed(() => currentRoute.value.params.id)
    // region graphql
    const { error, loading, result, onResult } = useQuery(ONE_STOCK, {
      id: id.value as string,
    })
    const { mutate: deleteItem } = useMutation(DELETE_STOCK)

    const widthPercentage = computed(() => {
      if (!result.value?.stockItem.idealStock) return 0
      if (result.value.stockItem.amountInStock === 0) return 0
      if (
        result.value.stockItem.amountInStock > result.value.stockItem.idealStock
      )
        return 100
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
      if ('style' in progressbar.value) {
        progressbar.value.style.width = widthPercentage.value + '%'
      }
    })

    const deleteItemWithConfirmation = (id: string) => {
      if (!confirm('Are you sure you want to delete this item?')) return
      deleteItem({ id }).then(e => {
        if (e?.data && e.data.removeStock) {
          // @ts-ignore
          if (e.data.removeStock === id) {
            replace('/admin/inventory')
          }
        }
      })
    }
    onResult(e => {
      if (e?.data?.stockItem) {
        setPageTitle(
          e.data.stockItem.name + ' - ' + e.data.stockItem.service.name,
        )
      }
    })

    return {
      push,
      result,
      error,
      loading,
      progressbar,
      widthPercentage,
      deleteItemWithConfirmation,
    }
  },
})
</script>

<template>
  <Modal max-width="max-w-xl" @close="push('/admin/inventory')">
    <template v-slot:title>
      <div class="flex w-full flex-row items-center justify-between">
        <h2 class="pr4 mr-2 w-full">
          <span class="text-xl font-bold">
            {{ result?.stockItem.name }}
          </span>
          <span class="text-base">
            - {{ result?.stockItem.service.name }}
          </span>
        </h2>
        <button
          v-if="result?.stockItem"
          class="bg-danger-surface hover:bg-danger-light active:bg-danger-light mr-2 self-end rounded-full p-2 transition-colors duration-100 ease-in-out"
          @click="deleteItemWithConfirmation(result?.stockItem.id)"
        >
          <trash :size="20" />
        </button>
        <button
          class="bg-primary-surface hover:bg-primary-surface/80 active:bg-primary-surface/60 mr-2 self-end rounded-full p-2"
          @click="push('/admin/inventory/' + result?.stockItem.id + '/edit')"
        >
          <Edit2 :size="20" />
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

        <!--        <div v-if='success' ></div>-->
      </div>
    </template>
    <template v-slot:actions>
      <!--      todo: link to broken-->
      <StyledButton :px="2" :py="1" button-type="danger"
        >Report broken / missing item</StyledButton
      >
    </template>
  </Modal>
</template>

<style scoped></style>
