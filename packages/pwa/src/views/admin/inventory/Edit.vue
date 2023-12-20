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
import { IOneStockItem } from '@/interface/stock.interface.ts'

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
    onResult(param => {
      oldResult.value = JSON.parse(JSON.stringify(param.data))
      setPageTitle(
        'Edit ' +
          param.data.stockItem.name +
          ' - ' +
          param.data.stockItem.service.name,
      )
    })
    const compare = (
      val?: IOneStockItem,
      oldValue?: IOneStockItem,
    ): boolean => {
      if (!val?.stockItem) return false
      if (!oldValue?.stockItem) return false
      return (
        val.stockItem.amountInStock !== oldValue.stockItem.amountInStock ||
        val.stockItem.idealStock !== oldValue.stockItem.idealStock ||
        val.stockItem.name !== oldValue.stockItem.name ||
        val.stockItem.description !== oldValue.stockItem.description ||
        val.stockItem.service.id !== oldValue.stockItem.service.id
      )
    }

    watch(
      result,
      value => {
        hasChanged.value = compare(value, oldResult.value)
      },
      { deep: true },
    )

    const submit = () => {
      mutateUpdateItem({
        updateStockInput: getUpdatedStockItem(result.value?.stockItem!, {}),
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
    }
  },
})
</script>

<template>
  <!--  Todo: popup to discard changes-->
  <Modal min-width="min-w-md      " @close="push(`/admin/inventory/${id}`)">
    <template v-slot:title>
      <h2 v-if="result?.stockItem" class="mr-2 w-full">
        <!--        <span>{{ $t('edit.edit') }}</span>-->
        <span class="text-lg font-bold">
          {{ result.stockItem.name }}
        </span>
        <span class="text-base"> - {{ result.stockItem.service.name }} </span>
      </h2>
    </template>
    <template v-slot:default>
      <form v-if="result?.stockItem" @submit.prevent="submit">
        <StyledInputText
          v-model="result.stockItem.name"
          :label="$t('inventory.name')"
        />
        <label
          :title="$t('inventory.description')"
          class="mt-2 block"
          for="description"
        >
          <span>{{ $t('inventory.description') }}</span></label>
          <textarea
            id="description"
            v-model="result.stockItem.description"
            class="b-2 b-primary-light hover:border-primary focus:border-primary-dark focus-visible:border-primary-dark w-full rounded bg-white px-4 py-1.5 outline-none transition-colors"
          ></textarea>
        
        <StyledInputText
          v-model="result.stockItem.amountInStock"
          :label="$t('inventory.amount')"
          :min="0"
          type="number"
        />
        <StyledInputText
          v-model="result.stockItem.idealStock"
          :label="$t('inventory.idealStock')"
          :min="0"
          type="number"
        />
        <label class="mt-2">
          <span>{{ $t('inventory.service') }}</span>
          <select
            v-if="services && result"
            id=""
            :value="result.stockItem.service.id"
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
