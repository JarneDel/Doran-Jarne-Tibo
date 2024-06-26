<script lang="ts">
// Interfaces
interface Sports {
  GetAllSports: [
    {
      id: string
      name: string
      createdAt: string
      updatedAt: string
    },
  ]
}

// Imports
import { useQuery, useMutation } from '@vue/apollo-composable'
import { ALL_SPORTS } from '@/graphql/sport.query'
import { useRouter } from 'vue-router'
import { CREATE_ROOM, createRoomInput, ICreateRoom } from '@/graphql/room.query'
import { defineComponent, ref, computed } from 'vue'
import StyledInputText from '@/components/generic/StyledInputText.vue'
import UseFirebase from '../../../composables/useFirebase'
import Error from '@/components/Error.vue'

// Export default
export default defineComponent({
  name: 'CreateRoom',
  components: {
    StyledInputText,
    Error,
  },

  setup: function () {
    const { firebaseUser } = UseFirebase()
    const idToken = ref()
    const getIdToken = async () => {
      idToken.value = await firebaseUser.value?.getIdToken()
    }
    getIdToken()
    const { push, currentRoute } = useRouter()

    const errorMessages = ref<string[]>([])

    // Room type from url
    const type = computed(() => currentRoute.value.params.type)

    // All sports
    const { loading, result, error } = useQuery<Sports>(ALL_SPORTS)
    // CREATE ROOM
    const { mutate } = useMutation<ICreateRoom>(CREATE_ROOM)
    let typeSelector = ref(-1)
    if (type.value == '0') typeSelector.value = 0
    else if (type.value == '1') typeSelector.value = 1
    else if (type.value == '2') typeSelector.value = 2
    else if (type.value == '3') typeSelector.value = 3
    else if (type.value == '4') typeSelector.value = 4

    const typeSelectorChange = (e: Event) => {
      const target = e.target as HTMLSelectElement
      const value = Number(target.value)
      push(`/admin/rooms/create/type/${value}`)
      typeSelector.value = value
    }

    const handleSubmit = async (e: Event) => {
      //prevent default submit behaviour
      e.preventDefault()

      //get all form data
      const formData = new FormData(e.target as HTMLFormElement)
      const data = Object.fromEntries(formData.entries())
      let Price = 0
      const { title, price } = data
      if (price) Price = Number(price)
      const sportsIds = []
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          const element = data[key]
          if (element === 'on') {
            sportsIds.push(key)
          }
        }
      }
      let type = ''
      if (typeSelector.value == 0) {
        type = 'Sportzaal'
      } else if (typeSelector.value == 1) {
        type = 'Werkruimte'
      } else if (typeSelector.value == 2) {
        type = 'Kleedruimte'
      } else if (typeSelector.value == 3) {
        type = 'Zwembad'
      } else if (typeSelector.value == 4) {
        type = 'Duikput'
      }

      const params: createRoomInput = {
        name: title.toString(),
        pricePerHour: Price,
        SportId: sportsIds,
        type: type,
      }

      //Create a new room in the database
      const res = await mutate({
        createRoomInput: params,
      })
        .then(e => {
          console.log('success')
          console.log({ e })
          if (!e) return
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
      console.info(res)

      //redirect to the room page based on created room type
      if (res?.data?.createRoom.id) {
        // await push('/admin/rooms/');
        if (res?.data.createRoom.type == 'Sportzaal') {
          await push('/admin/rooms/type/0/')
        } else if (res?.data.createRoom.type == 'Werkruimte') {
          await push('/admin/rooms/type/1')
        } else if (res?.data.createRoom.type == 'Kleedruimte') {
          await push('/admin/rooms/type/2')
        } else if (res?.data.createRoom.type == 'Zwembad') {
          await push('/admin/rooms/type/3')
        } else if (res?.data.createRoom.type == 'Duikput') {
          await push('/admin/rooms/type/4')
        }
      }
    }

    return {
      idToken,
      loading,
      result,
      error,
      typeSelector,
      typeSelectorChange,
      handleSubmit,
      errorMessages,
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
  <div class="flex min-h-full flex-col items-center justify-center">
    <div class="rounded-2 w-full max-w-md bg-white p-8 shadow-md">
      <form @submit.prevent="handleSubmit" class="flex max-w-md flex-col gap-4">
        <div class="flex flex-col gap-1">
          <label for="roomType" class="text-primary-text font-bold">{{
            $t('rooms.chooseARoomType')
          }}</label>
          <select
            id="roomType"
            class="b-2 b-primary-light hover:border-primary focus:border-primary-dark focus-visible:border-primary-dark w-full rounded bg-white px-4 py-1.5 outline-none transition-colors"
            name="service"
            v-model="typeSelector"
            @change="typeSelectorChange"
          >
            <option value="-1" disabled selected>Selecteer een type</option>
            <option value="0">Sportzalen</option>
            <option value="1">WerkRuimtes</option>
            <option value="2">Kleedkamers</option>
            <option value="3">Zwembaden</option>
            <option value="4">Duikputten</option>
          </select>
        </div>
        <div v-if="typeSelector >= 0">
          <StyledInputText label="Title" name="title" />
        </div>
        <h4 class="text-primary-text font-medium">
          {{ $t('rooms.selectTheCorrectSports') }}
        </h4>
        <div
          class="grid grid-cols-1 gap-1 sm:grid-cols-2 md:grid-cols-3"
          v-if="typeSelector == 0 || typeSelector == 3 || typeSelector == 4"
        >
          <div
            v-for="sport in result?.GetAllSports"
            :key="sport.id"
            class="flex items-center gap-2"
          >
            <input type="checkbox" :name="sport.id" :id="sport.id" />
            <label :for="sport.id" class="select-none">{{ sport.name }}</label>
          </div>
        </div>
        <div
          v-if="typeSelector != -1 && typeSelector != 1"
          class="flex flex-col"
        >
          <StyledInputText
            type="number"
            id="pricePerHour"
            :label="$t('inventory.pricePerHour')"
            :min="0"
          >
          </StyledInputText>
        </div>
        <div v-if="typeSelector >= 0">
          <button
            type="submit"
            class="bg-secondary text-primary-text rounded px-4 py-2 font-bold"
          >
            {{ $t('rooms.createARoom') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped></style>
