<script lang="ts">
//interfaces
interface ISport {
  GetAllSports: [
    {
      id: string
      name: string
      createdAt: Date
      updatedAt: Date
    },
  ]
}

//imports
import { ALL_SPORTS } from '@/graphql/sport.query.ts'
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import StyledInputText from '@/components/generic/StyledInputText.vue'
import { useMutation, useQuery } from '@vue/apollo-composable'
import StyledLink from '@/components/generic/StyledLink.vue'
import StyledButton from '@/components/generic/StyledButton.vue'
import {
  CREATE_LOANABLE_MATERIAL,
  createLoanableMaterialInput,
  ICreateLoanableMaterial,
} from '@/graphql/loanableMaterials.query.ts'
import Error from '@/components/Error.vue'

// todo: error handling

export default defineComponent({
  components: { Error, StyledButton, StyledLink, StyledInputText },
  setup() {
    // refs
    const name = ref<string>('')
    const description = ref<string>('')
    const totalAmount = ref<number>(0)
    const wantedAmount = ref<number>(0)
    const price = ref<number>(0)
    const sportIds = ref<string[]>([])
    const errorMessages = ref<string[]>([])

    const { push } = useRouter()

    const { mutate } = useMutation<ICreateLoanableMaterial>(
      CREATE_LOANABLE_MATERIAL,
    )

    // ALL_SPORTS
    const {
      error: errorSports,
      loading: loadingSports,
      result: resultSports,
    } = useQuery<ISport>(ALL_SPORTS, {}, { fetchPolicy: 'cache-and-network' })

    const createNewItem = async () => {
      if (name.value == '') {
        errorMessages.value.push('Please give a name')
        return
      }
      if (totalAmount.value == 0) {
        errorMessages.value.push('Please give a total amount')
        return
      }
      if (wantedAmount.value == 0) {
        errorMessages.value.push('Please give a wanted amount')
        return
      }
      if (price.value == 0) {
        errorMessages.value.push('Please give a price')
        return
      }
      if (sportIds.value.length == 0) {
        errorMessages.value.push('Please select at least one sport')
        return
      }

      const params: createLoanableMaterialInput = {
        name: name.value,
        description: description.value ?? '',
        totalAmount: Number(totalAmount.value),
        wantedAmount: Number(wantedAmount.value),
        price: Number(price.value),
        SportId: sportIds.value,
        isComplete: true,
      }

      mutate({
        createLoanableMaterialInput: params,
      })
        .then(e => {
          console.log('success')
          console.log({ e })
          if (!e) return
          push('/admin/sport-equipment/id/' + e.data?.createLoanableMaterial.id)
          return e
        })
        .catch(e => {
          console.log('error')
          console.log({ e })
          const originalError = e.graphQLErrors[0].extensions
            .originalError as any
          if (!originalError || !originalError.message)
            return console.log('no message')

          console.log({ originalError })
          originalError.message.forEach((message: string) => {
            errorMessages.value.push(message)
          })
        })
    }
    return {
      push,
      createNewItem,
      name,
      description,
      totalAmount,
      wantedAmount,
      price,
      sportIds,
      errorMessages,
      resultSports,
      loadingSports,
      errorSports,
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
  <div class="flex min-h-full flex-col items-center justify-center p-8">
    <div class="rounded-2 w-full max-w-md bg-white p-8 shadow-md">
      <form
        class="mx-auto flex max-w-lg flex-col gap-1"
        @submit.prevent="createNewItem"
      >
        <h2 class="text-primary-text text-xl font-bold">
          {{ $t('item.new.title') }}
        </h2>
        <styled-input-text
          v-model="name"
          :label="$t('inventory.name')"
          :maxlength="40"
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
          v-model="wantedAmount"
          :label="$t('item.new.ideal')"
          type="number"
          class="my-1"
          name="wantedAmount"
        />

        <styled-input-text
          v-model="totalAmount"
          :label="$t('item.new.inStock')"
          type="number"
          class="my-1"
          name="totalAmount"
        />

        <styled-input-text
          v-model="price"
          :label="$t('inventory.pricePerHour') + '(€)'"
          type="number"
          class="my-1"
          name="price"
        />

        <div>
          <h4 class="text-primary-text font-medium">
            {{ $t('item.new.forWhatSport') }}
          </h4>
          <div class="grid grid-cols-1 sm:grid-cols-2">
            <div
              v-for="sport in resultSports?.GetAllSports"
              :key="sport.id"
              class="flex items-center gap-2"
            >
              <input
                type="checkbox"
                :id="sport.id"
                :name="sport.id"
                @change="
                  sportIds.includes(sport.id)
                    ? sportIds.splice(sportIds.indexOf(sport.id), 1)
                    : sportIds.push(sport.id)
                "
              />
              <label :for="sport.id" class="select-none">{{
                sport.name
              }}</label>
            </div>
          </div>
        </div>

        <div class="flex justify-end py-3">
          <StyledButton :px="2" :py="1" type="submit"
            >{{ $t('item.new.submit') }}
          </StyledButton>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped></style>
