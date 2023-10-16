<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import StyledInputText from '@/components/generic/StyledInputText.vue'
import { useMutation, useQuery } from '@vue/apollo-composable'
import { ALL_SERVICES, IServices } from '@/graphql/service.query.ts'
import StyledLink from '@/components/generic/StyledLink.vue'
import StyledButton from '@/components/generic/StyledButton.vue'
import {
  CREATE_STOCK,
  CreateStockInput,
  ICreateStock,
} from '@/graphql/stock.query.ts'

// todo: error handling
// todo: fix issue: after creating a new item, the item is not shown in the list

export default defineComponent({
  name: 'New.vue',
  components: { StyledButton, StyledLink, StyledInputText },
  setup() {
    // refs
    const name = ref<string>('')
    const description = ref<string>('')
    const idealAmountInStock = ref<number>(0)
    const inStock = ref<number>(0)
    const service = ref<string>('')
    const errors = ref<string[]>([])

    const { push } = useRouter()
    const {
      result: services,
      loading: loadingServices,
      error: servicesError,
    } = useQuery<IServices>(ALL_SERVICES)

    const { mutate } = useMutation<ICreateStock>(CREATE_STOCK)

    const createNewItem = async (e: Event) => {
      if (service.value == '') {
        errors.value.push('Please select a service')

        return
      }

      const params: CreateStockInput = {
        name: name.value,
        description: description.value ?? '',
        idealStock: idealAmountInStock.value,
        amountInStock: inStock.value,
        needToOrderMore: false,
        serviceId: service.value,
      }
      const res = await mutate({
        createStockInput: params,
      })
      // todo: error handling, possible redirect to edit if name already exists
      if (res?.data?.createStock.id) {
        await push('/admin/inventory/' + res.data.createStock.id)
      }
    }
    return {
      push,
      createNewItem,
      services,
      loadingServices,
      servicesError,
      name,
      description,
      idealAmountInStock,
      inStock,
      service,
      errors,
    }
  },
})
</script>

<template>
  <form
    @submit.prevent="createNewItem"
    class="mx-auto mt-12 flex max-w-lg flex-col"
  >
    <h2 class="font-500 mb-1 text-xl">{{ $t('item.new.title') }}</h2>
    <div class="text-sm text-gray-800">
      Want to add to an existing item?
      <styled-link to="/admin/inventory/edit">Edit an item</styled-link>
    </div>
    <styled-input-text
      name="name"
      :label="$t('inventory.name')"
      class="my-1"
      v-model="name"
      required
    />
    <styled-input-text
      name="description"
      :label="$t('inventory.description')"
      v-model="description"
      class="my-1"
    />

    <label class="my-1" for="idealAmountInStock">
      <span>
        {{ $t('item.new.ideal') }}
      </span>
      <input
        id="idealAmountInStock"
        class="block w-16"
        max="200"
        min="0"
        name="idealAmountInStock"
        step="1"
        type="number"
        v-model="idealAmountInStock"
      />
    </label>

    <label for="inStock">
      <span>{{ $t('item.new.inStock') }}</span>
      <input
        id="inStock"
        class="block w-16"
        max="200"
        min="0"
        name="inStock"
        step="1"
        type="number"
        v-model="inStock"
    /></label>

    <label for="service">{{ $t('item.new.services') }}</label>

    <div>
      <select
        id="service"
        class="bg-primary-surface b-2 border-neutral-200 px-4"
        name="service"
        v-model="service"
        required
      >
        <option value="" disabled></option>
        <option
          v-for="service of services.services"
          v-if="services"
          :key="service.id"
          :value="service.id"
        >
          {{ service.name }}
        </option>
      </select>
    </div>
    <div class="flex justify-end py-3">
      <StyledButton :px="2" :py="1" type="submit"
        >{{ $t('item.new.submit') }}
      </StyledButton>
    </div>
  </form>
</template>

<style scoped></style>
