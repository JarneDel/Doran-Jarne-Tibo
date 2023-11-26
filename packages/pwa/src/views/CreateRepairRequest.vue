<script lang="ts">
import { defineComponent } from 'vue'
import { ref } from 'vue'
import { RepairRequest, material } from '@/interface/repairRequestInterface'
import useUser from '@/composables/useUser'
import StyledInputText from '@/components/generic/StyledInputText.vue'
import { useMutation, useQuery } from '@vue/apollo-composable'
import { ALL_ROOMS } from '@/graphql/room.query'
import { Room } from '@/interface/roomInterface'
import { ALL_LOANABLE_MATERIALS } from '@/graphql/loanableMaterials.query'
import StyledButton from '@/components/generic/StyledButton.vue'
import { CREATE_REPAIR_REQUEST } from '@/graphql/repairRequests.query'

export default defineComponent({
  setup() {
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
        id: customUser.value.userByUid.id,
        UID: customUser.value.userByUid.uid,
        locale: customUser.value.userByUid.locale,
        role: customUser.value.userByUid.role,
        name: customUser.value.userByUid.name,
        firstName: customUser.value.userByUid.firstName,
        lastName: customUser.value.userByUid.lastName,
        email: customUser.value.userByUid.email,
        phone: customUser.value.userByUid.phone,
      }
    }
    const rooms = ref<Room[]>([])
    const loanableMaterials = ref<material[]>([])
    const { onResult } = useQuery(ALL_ROOMS)
    onResult(result => {
      if (result.data) {
        rooms.value = result.data.GetAllRooms
        if (customUser.value?.userByUid.role === 'GROUP')
          rooms.value = rooms.value.filter(room => room.type !== 'Werkruimte')
        console.log(rooms.value)
      }
    })
    const {onResult:resultMMaterials } = useQuery(ALL_LOANABLE_MATERIALS)
    resultMMaterials((result) => {
      if (result.data) {
        loanableMaterials.value = result.data.GetAllLoanableMaterials
      }
    })
    const handleSubmit = () => {
      let materials: material[] = []
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
        }
        materials.push(listedmaterial)
      })
      let roomlist: Room[] = []
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
      createRepairRequest({
        requestUserId: repair.value.requestUser.id,
        room: roomlist,
        loanableMaterial: materials,
        title: repair.value.title,
        description: repair.value.description,
      }).then(() => {
        location.reload()
      })
    }
    return {
      repair,
      rooms,
      loanableMaterials,
      handleSubmit
    }
  },
  components: { StyledInputText, StyledButton },
})
</script>

<template>
  <div class="flex h-full w-full items-center justify-center">
    <form class="w-1/3 rounded-md bg-white p-8 shadow-md" @submit.prevent="handleSubmit">
      <h1 class="my-2 text-xl font-medium">
        {{ $t('repairRequest.repairRequests') }}
      </h1>
      <styled-input-text
        v-model="repair.title"
        :label="$t('repairRequest.title')"
        class=" my-1"
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
      <div class="flex my-1 c-primary-text">
        <div class="w-1/2">
          <h2 class=" text-lg font-medium">{{ $t('nav.rooms') }}</h2>
          <div v-for="room in rooms" class="mb-1 ">
            <input
              type="checkbox"
              :value="room"
              :id="room.id"
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
          <h2 class=" text-lg font-medium">{{ $t('nav.rooms') }}</h2>
          <div v-for="material in loanableMaterials" class="mb-1">
            <input
              type="checkbox"
              :value="material"
              :id="material.id"
              @change="
                () => {
                  if (repair.loanableMaterial.includes(material)) {
                    repair.loanableMaterial.splice(repair.room.indexOf(material), 1)
                  } else {
                    repair.loanableMaterial.push(material)
                  }
                  console.log(repair.loanableMaterial)
                }
              "
            />
            <label :for="material.id" class="ml-2 text-lg">{{ material.name }}</label>
          </div>
        </div>
      </div>
      <StyledButton
        class="w-full mt-2 text-lg "
        type="submit"
      >
        {{$t('common.save')}}
      </StyledButton>
    </form>
  </div>
</template>

<style scoped></style>
