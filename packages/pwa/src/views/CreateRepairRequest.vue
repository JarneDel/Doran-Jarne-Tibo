<script lang="ts">
import { defineComponent, ref } from 'vue'
import { material, RepairRequest } from '@/interface/repairRequestInterface'
import useUser from '@/composables/useUser'
import StyledInputText from '@/components/generic/StyledInputText.vue'
import { useMutation, useQuery } from '@vue/apollo-composable'
import { ALL_ROOMS } from '@/graphql/room.query'
import { Room } from '@/interface/roomInterface'
import { ALL_LOANABLE_MATERIALS } from '@/graphql/loanableMaterials.query'
import StyledButton from '@/components/generic/StyledButton.vue'
import { CREATE_REPAIR_REQUEST } from '@/graphql/repairRequests.query'
import Error from '@/components/Error.vue'

export default defineComponent({
  setup() {
    const errorMessages = ref<string[]>([])
    const { mutate: createRepairRequest } = useMutation(CREATE_REPAIR_REQUEST)
    const { customUser } = useUser()
    const repair = ref<RepairRequest>({
      id: '',
      title: '',
      requestUser: {
        id: '',
        UID: '',
        locale: '',
        role: '',
        name: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
      },
      description: '',
      urgency: 1,
      room: [],
      loanableMaterial: [],
      isRepaired: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    if (customUser.value) {
      repair.value.requestUser = {
        id: customUser.value.id,
        UID: customUser.value.UID,
        locale: customUser.value.locale,
        role: customUser.value.role,
        name: customUser.value.name,
        firstName: customUser.value.firstName,
        lastName: customUser.value.lastName,
        email: customUser.value.email,
        phone: customUser.value.phone,
      }
    }
    const rooms = ref<Room[]>([])
    const loanableMaterials = ref<material[]>([])
    const { onResult } = useQuery(ALL_ROOMS)
    onResult(result => {
      if (result.data) {
        rooms.value = result.data.GetAllRooms
        if (customUser.value?.role === 'GROUP')
          rooms.value = rooms.value.filter(room => room.type !== 'Werkruimte')
        console.log(rooms.value)
      }
    })
    const { onResult: resultMMaterials } = useQuery(ALL_LOANABLE_MATERIALS)
    resultMMaterials(result => {
      if (result.data) {
        loanableMaterials.value = result.data.GetAllLoanableMaterials
      }
    })
    const handleSubmit = () => {
      let materials: material[] = []

      if (repair.value.loanableMaterial.length > 0) {
        materials = []
        repair.value.loanableMaterial.forEach(material => {
          let sportsist: any = []
          material.sports.forEach(sportt => {
            let sport: any = {
              id: '',
              name: '',
              createdAt: new Date(),
              updatedAt: new Date(),
            }
            sport.id = sportt.id
            sport.name = sportt.name
            sport.createdAt = sportt.createdAt
            sport.updatedAt = sportt.updatedAt
            sportsist.push(sport)
          })
          let listedmaterial: material = {
            id: material.id,
            name: material.name,
            price: material.price,
            sports: sportsist,
            totalAmount: material.totalAmount,
            wantedAmount: material.wantedAmount,
            isComplete: material.isComplete,
            description: material.description,
            amountReserved: 0,
            createdAt: material.createdAt,
            updatedAt: material.updatedAt,
          }
          materials.push(listedmaterial)
        })
      }
      let roomlist: Room[] = []
      if (repair.value.room.length > 0) {
        roomlist = []
        repair.value.room.forEach(room => {
          let sportsist: any = []
          room.sports.forEach(sportt => {
            let sport: any = {
              id: '',
              name: '',
              createdAt: new Date(),
              updatedAt: new Date(),
            }
            sport.id = sportt.id
            sport.name = sportt.name
            sport.createdAt = sportt.createdAt
            sport.updatedAt = sportt.updatedAt
            sportsist.push(sport)
          })
          // @ts-ignore
          let listedroom: Room = {
            id: room.id,
            name: room.name,
            pricePerHour: room.pricePerHour,
            sports: sportsist,
            type: room.type,
          }
          roomlist.push(listedroom)
        })
      }
      createRepairRequest({
        requestUserId: repair.value.requestUser.id,
        room: roomlist,
        loanableMaterial: materials,
        title: repair.value.title,
        description: repair.value.description,
      })
        .then(() => {
          location.reload()
        })
        .catch(e => {
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
      repair,
      rooms,
      loanableMaterials,
      handleSubmit,
      errorMessages,
    }
  },
  components: { StyledInputText, StyledButton, Error },
})
</script>

<template>
  <Error
    v-for="(error, index) of errorMessages"
    :key="index"
    :is-shown="errorMessages[index] !== ''"
    :msg="error"
    :translate="true"
    @update:is-shown="errorMessages[index] = ''"
  />
  <div class="flex h-full w-full items-center justify-center">
    <form
      class="my-4 w-1/3 rounded-md bg-white p-8 shadow-md"
      @submit.prevent="handleSubmit"
    >
      <h1 class="mb-2 text-xl font-medium">
        {{ $t('repairRequest.repairRequests') }}
      </h1>
      <styled-input-text
        v-model="repair.title"
        :label="$t('repairRequest.title')"
        class="my-1"
        required
        type="text"
      />
      <styled-input-text
        v-model="repair.description"
        :label="$t('repairRequest.description')"
        class="my-1"
        required
        type="text"
      />
      <div class="c-primary-text my-1 flex">
        <div class="w-1/2">
          <h2 class="text-lg font-medium">{{ $t('nav.rooms') }}</h2>
          <div v-for="room in rooms" class="mb-1">
            <input
              :id="room.id"
              :value="room"
              type="checkbox"
              @change="
                () => {
                  if (repair.room.includes(room)) {
                    repair.room.splice(repair.room.indexOf(room), 1)
                  } else {
                    repair.room.push(room)
                  }
                  console.log(repair.room)
                }
              "
            />
            <label :for="room.id" class="ml-2 text-lg">{{ room.name }}</label>
          </div>
        </div>
        <div class="w-1/2">
          <h2 class="text-lg font-medium">
            {{ $t('repairRequest.materials') }}
          </h2>
          <div v-for="material in loanableMaterials" class="mb-1">
            <input
              :id="material.id"
              :value="material"
              type="checkbox"
              @change="
                () => {
                  if (repair.loanableMaterial.includes(material)) {
                    repair.loanableMaterial.splice(
                      repair.loanableMaterial.indexOf(material),
                      1,
                    )
                  } else {
                    repair.loanableMaterial.push(material)
                  }
                  console.log(repair.loanableMaterial)
                }
              "
            />
            <label :for="material.id" class="ml-2 text-lg">{{
              material.name
            }}</label>
          </div>
        </div>
      </div>
      <StyledButton class="float-right mt-2 w-fit text-lg" type="submit">
        {{ $t('common.save') }}
      </StyledButton>
    </form>
  </div>
</template>

<style scoped></style>
