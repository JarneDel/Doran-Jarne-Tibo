<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import StyledInputText from '@/components/generic/StyledInputText.vue'
import { useMutation, useQuery } from '@vue/apollo-composable'
import { ALL_SERVICES } from '@/graphql/service.query.ts'
import StyledLink from '@/components/generic/StyledLink.vue'
import StyledButton from '@/components/generic/StyledButton.vue'
import { CREATE_STOCK } from '@/graphql/stock.query.ts'
import Error from '@/components/Error.vue'
import { CreateStockInput } from '@/interface/stock.interface.ts'

// todo: error handling

export default defineComponent({
  name: 'New.vue',
  components: { Error, StyledButton, StyledLink, StyledInputText },
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
    } = useQuery(ALL_SERVICES)

    const { mutate, onError } = useMutation(CREATE_STOCK)
    onError(e => {
      errors.value.push(e.message)
    })

    const createNewItem = async () => {
      if (service.value == '') {
        errors.value.push('Please select a service')
        console.log(errors)
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
      errorMessages: errors,
    }
  },
})
</script>

<template>
  <Error
    v-for="(error, index) of errorMessages"
    :key="index"
    :is-shown="errorMessages[index] !== ''"
    :msg="error"
    @update:is-shown="errorMessages[index] = ''"
  />

  <form
    class="mx-auto mt-12 flex h-min w-full max-w-lg flex-col overflow-hidden rounded-xl border bg-white p-4 shadow-md dark:bg-gray-800"
    @submit.prevent="createNewItem"
  >
    <h2 class="font-500 mb-1 text-xl">{{ $t('item.new.title') }}</h2>
    <div class="text-sm text-gray-800">
      Want to add to an existing item?
      <styled-link to="/admin/inventory/edit">Edit an item</styled-link>
    </div>
    <styled-input-text
      v-model="name"
      :label="$t('inventory.name')"
      class="my-1"
      name="name"
      required
    />
    <styled-input-text
      v-model="description"
      :label="$t('inventory.description')"
      class="my-1"
      name="description"
    />
    <styled-input-text
      v-model="idealAmountInStock"
      :label="$t('item.new.ideal')"
      class="my-1"
      :max="250"
      :min="0"
      name="idealAmountInStock"
      step="1"
      type="number"
    />

    <styled-input-text
      v-model="inStock"
      :label="$t('item.new.inStock')"
      class="my-1"
      :max="250"
      :min="0"
      name="inStock"
      step="1"
      type="number"
    />

    <label for="service">{{ $t('item.new.services') }}</label>

    <div>
      <select
        id="service"
        v-model="service"
        class="b-2 b-primary-light hover:border-primary focus:border-primary-dark focus-visible:border-primary-dark w-full rounded bg-white px-4 py-1.5 outline-none transition-colors"
        name="service"
      >
        <option value="">empty</option>
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

    <StyledLink to="/admin/service/new"
      >{{ $t('inventory.service.new') }}
    </StyledLink>

    <div class="flex justify-end py-3">
      <StyledButton :px="2" :py="1" type="submit"
        >{{ $t('item.new.submit') }}
      </StyledButton>
    </div>
  </form>
</template>

<style scoped></style>
