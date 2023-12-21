<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import Modal from '@/components/modal/Modal.vue'
import { useRouter } from 'vue-router'
import { useMutation, useQuery } from '@vue/apollo-composable'
import {
  getUpdatedStockItem,
  ONE_STOCK,
  UPDATE_STOCK,
} from '@/graphql/stock.query.ts'
import StyledInputText from '@/components/generic/StyledInputText.vue'
import { ALL_SERVICES } from '@/graphql/service.query.ts'
import StyledButton from '@/components/generic/StyledButton.vue'
import useA11y from '@/composables/useA11y.ts'
import { IOneStockItem, StockItem } from '@/interface/stock.interface.ts'

export default defineComponent({
  name: 'Edit',
  components: { StyledButton, StyledInputText, Modal },
  setup() {
    const { push, currentRoute } = useRouter()
    const id = currentRoute.value.params.id as string
    const { setPageTitle } = useA11y()
    const { result, onResult } = useQuery(ONE_STOCK, { id })
    const { result: services } = useQuery(ALL_SERVICES)
    const { mutate: mutateUpdateItem } = useMutation(UPDATE_STOCK)

    const hasChanged = ref<boolean>(false)
    const oldResult = ref<IOneStockItem>()
    const editableStockItem = ref<StockItem>()

    onResult(param => {
      editableStockItem.value = JSON.parse(
        JSON.stringify(param.data.stockItem),
      ) as StockItem

      oldResult.value = JSON.parse(JSON.stringify(param.data)) as IOneStockItem
      setPageTitle(
        'Edit ' +
          param.data.stockItem.name +
          ' - ' +
          param.data.stockItem.service.name,
      )
    })

    const compare = (val?: StockItem, oldValue?: StockItem): boolean => {
      if (!val) return false
      if (!oldValue) return false
      return (
        val.amountInStock !== oldValue.amountInStock ||
        val.idealStock !== oldValue.idealStock ||
        val.name !== oldValue.name ||
        val.description !== oldValue.description ||
        val.service.id !== oldValue.service.id
      )
    }

    watch(
      editableStockItem,
      value => {
        if (!oldResult.value) return
        hasChanged.value = compare(value, oldResult.value.stockItem)
      },
      { deep: true },
    )

    const submit = () => {
      if (!editableStockItem.value) return
      mutateUpdateItem({
        updateStockInput: getUpdatedStockItem(editableStockItem.value!, {}),
      }).then(() => {
        push(`/admin/inventory/${id}`)
      })
    }

    return {
      push,
      submit,
      result,
      services,
      hasChanged,
      id,
      editableStockItem,
    }
  },
})
</script>

<template>
  <!--  Todo: popup to discard changes-->
  <Modal min-width="min-w-md      " @close="push(`/admin/inventory/${id}`)">
    <template v-slot:title>
      <h2 v-if="editableStockItem" class="mr-2 w-full">
        <!--        <span>{{ $t('edit.edit') }}</span>-->
        <span class="text-lg font-bold">
          {{ editableStockItem.name }}
        </span>
        <span class="text-base"> - {{ editableStockItem.service.name }} </span>
      </h2>
    </template>
    <template v-slot:default>
      <form v-if="editableStockItem" @submit.prevent="submit">
        <StyledInputText
          v-model="editableStockItem.name"
          :label="$t('inventory.name')"
        />
        <label
          :title="$t('inventory.description')"
          class="mt-2 block"
          for="description"
        >
          <span>{{ $t('inventory.description') }}</span></label
        >
        <textarea
          id="description"
          v-model="editableStockItem.description"
          class="b-2 b-primary-light hover:border-primary focus:border-primary-dark focus-visible:border-primary-dark w-full rounded bg-white px-4 py-1.5 outline-none transition-colors"
        ></textarea>

        <StyledInputText
          v-model="editableStockItem.amountInStock"
          :label="$t('inventory.amount')"
          :min="0"
          type="number"
        />
        <StyledInputText
          v-model="editableStockItem.idealStock"
          :label="$t('inventory.idealStock')"
          :min="0"
          type="number"
        />
        <label class="mt-2">
          <span>{{ $t('inventory.service') }}</span>
          <select
            v-if="services && result"
            id=""
            :value="editableStockItem.service.id"
            class="b-2 b-primary-light hover:border-primary focus:border-primary-dark focus-visible:border-primary-dark w-full rounded bg-white px-4 py-1.5 outline-none transition-colors"
            name=""
          >
            <option
              v-for="service in services.services"
              :key="service.id"
              :value="service.id"
            >
              {{ service.name }}
            </option>
          </select>
        </label>
        <div class="flex justify-end">
          <StyledButton
            :disabled="!hasChanged"
            button-type="secondary"
            class="mt4"
            type="submit"
          >
            {{ $t('item.edit.modify') }}
          </StyledButton>
        </div>
      </form>
    </template>
  </Modal>
</template>

<style scoped></style>
