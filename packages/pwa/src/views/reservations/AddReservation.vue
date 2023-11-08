<script lang="ts">
import { defineComponent, ref } from 'vue'
import StyledInputText from '@/components/generic/StyledInputText.vue'
import StyledButton from '@/components/generic/StyledButton.vue'
import {
  AVAILABLEMATERAILS,
  GET_AVAILABLE_ROOMS,
  CREATERESEVATION,
} from '@/graphql/reservations.query'
import { useMutation, useQuery } from '@vue/apollo-composable'
import { Room } from '@/interface/roomInterface'
import { material } from '@/interface/materialInterface'
import { Plus, Minus } from 'lucide-vue-next'
import useUser from '@/composables/useUser'

export default defineComponent({
  setup() {
    const { customUser } = useUser()
    const checkboxStatus = ref<any>({})
    const checkboxStatusMaterials = ref<any>({})
    const { mutate: addReservarion } = useMutation(CREATERESEVATION)
    const reservation = ref({
      date: new Date().toISOString().substr(0, 10),
      beginTime: '08:00',
      endTime: '18:00',
      timeDivrent: 10,
    })
    const availableRooms = ref<Room[]>([])
    const availableMaterials = ref<material[]>([])
    const wantedRoom = ref<Room[]>([])
    const wantedMaterials = ref<material[]>([])
    const price = ref(0)
    const AddReservation = () => {
      let materials: material[] = []
      wantedMaterials.value.forEach(material => {
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
          amountReserved: checkboxStatusMaterials.value[material.name].amount,
          wantedAmount: material.wantedAmount,
          isComplete: material.isComplete,
          description: material.description,
        }
        materials.push(listedmaterial)
      })
      let roomlist: Room[] = []
      wantedRoom.value.forEach(room => {
        let sportsist: any = []
        room.sports.forEach(sportt => {
          let sport: any = {
            id: '',
            name: '',
            createdAt: new Date(),
            updatedAt: new Date(),
          }
          console.log(sportt)
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
      addReservarion({
        date: reservation.value.date,
        startTime: reservation.value.beginTime,
        endTime: reservation.value.endTime,
        groupId: customUser.value?.userByUid.id,
        price: price.value,
        material: materials,
        rooms: roomlist,
      })
    }
    const Material = (material: material, plus: boolean) => {
      //add material
      if (plus) {
        if (
          checkboxStatusMaterials.value[material.name].amount ==
          material.totalAmount
        )
          return
        if (wantedMaterials.value.includes(material))
          wantedMaterials.value.splice(
            wantedMaterials.value.indexOf(material),
            1,
          )
        checkboxStatusMaterials.value[material.name].amount++
        wantedMaterials.value.push(material)
        price.value += material.price * reservation.value.timeDivrent
      } else {
        if (checkboxStatusMaterials.value[material.name].amount == 0) return
        //remove material
        checkboxStatusMaterials.value[material.name].amount--
        wantedMaterials.value.splice(wantedMaterials.value.indexOf(material), 1)
        if (checkboxStatusMaterials.value[material.name].amount != 0)
          wantedMaterials.value.push(material)
        price.value -= material.price * reservation.value.timeDivrent
      }
    }
    const checkMaterials = () => {
      return new Promise<void>(resolve => {
        let sportId: string[] = []
        wantedRoom.value.forEach((room: Room) => {
          room.sports.forEach((sport: any) => {
            if (!sportId.includes(sport.id)) sportId.push(sport.id)
          })
        })
        const { onResult } = useQuery<any>(AVAILABLEMATERAILS, {
          date: reservation.value.date,
          startTime: reservation.value.beginTime,
          endTime: reservation.value.endTime,
          sportId: sportId,
        })
        onResult(result => {
          availableMaterials.value = result.data.GetAvailableloanableMaterials
          availableMaterials.value.forEach(material => {
            checkboxStatusMaterials.value[material.name] = {
              amount: 0,
              checked: false,
            }
          })
          resolve()
        })
      })
    }
    const addRoom = (room: Room) => {
      if (checkboxStatus.value[room.name]) {
        wantedRoom.value.splice(wantedRoom.value.indexOf(room), 1)
        price.value -= room.pricePerHour * reservation.value.timeDivrent
      } else {
        wantedRoom.value.push(room)
        price.value += room.pricePerHour * reservation.value.timeDivrent
      }
      checkMaterials()
    }
    const check = async () => {
      return new Promise<void>(resolve => {
        const { onResult } = useQuery<any>(GET_AVAILABLE_ROOMS, {
          date: reservation.value.date,
          startTime: reservation.value.beginTime,
          endTime: reservation.value.endTime,
        })
        onResult(result => {
          availableRooms.value = result.data.getAvailableRooms
          wantedRoom.value = []
          price.value = 0
          availableRooms.value.forEach(room => {
            checkboxStatus.value[room.name] = false
          })
          resolve()
        })
      })
    }
    const checkEndTime = () => {
      if (
        parseInt(reservation.value.endTime.substring(0, 2)) < 8 ||
        parseInt(reservation.value.endTime.substring(0, 2)) > 18
      ) {
        reservation.value.endTime = '18:00'
      } else if (reservation.value.beginTime > reservation.value.endTime) {
        reservation.value.endTime = reservation.value.beginTime
      }
      //time difrentce
      let begin = reservation.value.beginTime.split(':')
      let end = reservation.value.endTime.split(':')
      let beginTime = new Date(
        0,
        0,
        0,
        parseInt(begin[0]),
        parseInt(begin[1]),
        0,
      )
      let endTime = new Date(0, 0, 0, parseInt(end[0]), parseInt(end[1]), 0)
      let diff = endTime.getTime() - beginTime.getTime()
      let hours = Math.floor(diff / 1000 / 60 / 60)
      diff -= hours * 1000 * 60 * 60
      let minutes = Math.floor(diff / 1000 / 60)
      reservation.value.timeDivrent = (hours * 60 + minutes) / 60
      check()
    }
    const checkStartTime = () => {
      if (
        parseInt(reservation.value.beginTime.substring(0, 2)) < 8 ||
        parseInt(reservation.value.beginTime.substring(0, 2)) > 18
      ) {
        reservation.value.beginTime = '08:00'
      } else if (reservation.value.endTime < reservation.value.beginTime) {
        reservation.value.beginTime = reservation.value.endTime
      }
      //time difrentce
      let begin = reservation.value.beginTime.split(':')
      let end = reservation.value.endTime.split(':')
      let beginTime = new Date(
        0,
        0,
        0,
        parseInt(begin[0]),
        parseInt(begin[1]),
        0,
      )
      let endTime = new Date(0, 0, 0, parseInt(end[0]), parseInt(end[1]), 0)
      let diff = endTime.getTime() - beginTime.getTime()
      let hours = Math.floor(diff / 1000 / 60 / 60)
      diff -= hours * 1000 * 60 * 60
      let minutes = Math.floor(diff / 1000 / 60)
      reservation.value.timeDivrent = (hours * 60 + minutes) / 60
      check()
    }
    const checkDate = () => {
      if (reservation.value.date < new Date().toISOString().substr(0, 10)) {
        reservation.value.date = new Date().toISOString().substr(0, 10)
      }
    }
    return {
      reservation,
      check,
      checkDate,
      checkEndTime,
      checkStartTime,
      availableRooms,
      addRoom,
      price,
      checkboxStatus,
      availableMaterials,
      checkboxStatusMaterials,
      Material,
      AddReservation,
    }
  },
  components: { StyledInputText, StyledButton, Plus, Minus },
})
</script>

<template>
  <div>
    <h1 class="m-4 text-xl font-bold">{{ $t('reservation.title') }}</h1>
    <p class="ml-4 text-lg">
      {{ $t('reservation.subtitle') }}
    </p>
    <div class="justify-between lg:flex">
      <div class="m-4 items-end gap-2 md:flex">
        <styled-input-text
          v-model="reservation.date"
          :label="$t('reservation.date')"
          class="w-fit"
          required
          type="date"
          @change="checkDate"
        />
        <styled-input-text
          v-model="reservation.beginTime"
          :label="$t('reservation.begin')"
          class="w-fit"
          required
          type="time"
          @change="checkStartTime"
        />
        <styled-input-text
          v-model="reservation.endTime"
          :label="$t('reservation.end')"
          class="w-fit"
          required
          type="time"
          @change="checkEndTime"
        />
        <StyledButton type="button" class="mt-2 h-fit" @click="check">
          {{ $t('reservation.check') }}
        </StyledButton>
      </div>
      <div class="ml-4 flex items-center gap-2 lg:mr-0">
        <p class="text-xl">€ {{ price }}</p>
        <StyledButton type="button" class="h-fit" @click="AddReservation()">
          {{ $t('reservation.reserve') }}
        </StyledButton>
      </div>
    </div>
    <div class="mx-4" v-if="availableRooms.length > 0">
      <p class="text-lg">beschikbare ruimtes</p>
      <div class="grid auto-rows-fr gap-4 lg:grid-cols-3 2xl:grid-cols-4">
        <label class="h-full" v-for="room in availableRooms">
          <!-- if the checkbox is checked it neets to aadd dhe room if not checked remooved -->
          <input
            type="checkbox"
            @click="addRoom(room)"
            class="peer hidden"
            v-model="checkboxStatus[room.name]"
          />
          <div
            class="peer-checked:border-primary h-full rounded-md border bg-white p-4 shadow-sm transition-all duration-300 peer-checked:shadow-lg"
          >
            <div class="flex h-full flex-col justify-between gap-2">
              <p class="text-lg font-medium">{{ room.name }}</p>
              <div v-if="room.sports.length > 0">
                <!-- <p>Sporten :</p> -->
                <div class="flex gap-2">
                  <p
                    v-for="sport in room.sports"
                    class="bg-secondary mt-1 rounded-full px-4"
                  >
                    {{ sport.name }}
                  </p>
                </div>
              </div>
              <p class="font-bold">€ {{ room.pricePerHour }}/h</p>
            </div>
          </div>
        </label>
      </div>
    </div>
    <div class="mx-4" v-if="availableMaterials.length > 0">
      <p class="text-lg">beschikbare materialen</p>
      <div
        class="grid grid-rows-[repeat(4,1fr)] gap-4 lg:grid-cols-3 2xl:grid-cols-4"
      >
        <label class="h-full" v-for="material in availableMaterials">
          <!-- if the checkbox is checked it neets to aadd dhe room if not checked remooved -->
          <div
            class="flex h-full items-center justify-between rounded-md border bg-white p-4 shadow-sm"
          >
            <div class="flex h-full flex-col justify-between gap-2">
              <p class="text-lg font-medium">{{ material.name }}</p>
              <div v-if="material.sports.length > 0">
                <!-- <p>Sporten :</p> -->
                <div class="flex gap-2">
                  <p
                    v-for="sport in material.sports"
                    class="bg-secondary mt-1 rounded-full px-4"
                  >
                    {{ sport.name }}
                  </p>
                </div>
              </div>
              <p class="font-bold">€ {{ material.price }}/h</p>
            </div>
            <div class="flex">
              <StyledButton>
                <Minus @click="Material(material, false)" />
              </StyledButton>
              <p>
                {{ checkboxStatusMaterials[material.name].amount }}/{{
                  material.totalAmount
                }}
              </p>
              <StyledButton>
                <Plus @click="Material(material, true)" />
              </StyledButton>
            </div>
          </div>
        </label>
      </div>
    </div>
  </div>
</template>
