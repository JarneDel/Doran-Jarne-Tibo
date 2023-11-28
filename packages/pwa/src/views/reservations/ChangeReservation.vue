<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import StyledInputText from '@/components/generic/StyledInputText.vue'
import StyledButton from '@/components/generic/StyledButton.vue'
import {
  AVAILABLEMATERAILS,
  GET_AVAILABLE_ROOMS,
  UPDATE_RESEVATION,
  GET_ONE_RESERVATION,
} from '@/graphql/reservations.query'
import { useMutation, useQuery } from '@vue/apollo-composable'
import { Room } from '@/interface/roomInterface'
import { material } from '@/interface/materialInterface'
import { Plus, Minus, X } from 'lucide-vue-next'
import useUser from '@/composables/useUser'
import { useRouter } from 'vue-router'
import { Reservation } from '@/interface/reservation'

export default defineComponent({
  setup() {
    const reservations = ref<Reservation>()
    const detail = ref<boolean>(false)
    const { push, currentRoute } = useRouter()
    const id = computed(() => currentRoute.value.params.id)
    const { customUser } = useUser()
    const checkboxStatus = ref<any>({})
    const checkboxStatusMaterials = ref<any>({})
    const { mutate: updateReservation } = useMutation(UPDATE_RESEVATION)
    const availableRooms = ref<Room[]>([])
    const availableMaterials = ref<material[]>([])
    const wantedRoom = ref<Room[]>([])
    const wantedMaterials = ref<material[]>([])
    const price = ref(0)
    const PriceWhitDiscount = ref(0)
    const discount = ref<number>(0)
    if (customUser.value?.userByUid.score) {
      if (customUser.value?.userByUid.score > 50) {
        discount.value = (customUser.value?.userByUid.score - 50) / 100
      }
      if (customUser.value?.userByUid.score < 50) {
        discount.value = ((50 - customUser.value?.userByUid.score) / 100) * -1
      }
    }
    const timeDivrent = () => {
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
    }
    const calculatePrice = () => {
      price.value = 0
      PriceWhitDiscount.value = 0
      wantedRoom.value.forEach(room => {
        price.value += room.pricePerHour * reservation.value.timeDivrent
      })
      wantedMaterials.value.forEach(material => {
        price.value +=
          material.price *
          checkboxStatusMaterials.value[material.name].amount *
          reservation.value.timeDivrent
      })
      PriceWhitDiscount.value = price.value * discount.value + price.value
    }
    const date = new Date()
    const reservation = ref({
      date: date.toISOString().substr(0, 10),
      beginTime: '08:00',
      endTime: '18:00',
      timeDivrent: 10,
    })
    new Promise<void>(resolve => {
      const { onResult } = useQuery<any>(GET_ONE_RESERVATION, { id: id.value })
      onResult(result => {
        if (result.loading) return
        reservations.value = result.data.GetReservatiounById
        if (reservations.value) {
          price.value = reservations.value.price
          const date = new Date(reservations.value?.date)
          reservation.value.date = date.toISOString().substr(0, 10)
          reservation.value.beginTime = reservations.value?.startTime
          reservation.value.endTime = reservations.value?.endTime
        }
        timeDivrent()
        check()
        resolve()
      })
    })
    const changeReservation = () => {
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
      updateReservation({
        date: reservation.value.date,
        startTime: reservation.value.beginTime,
        endTime: reservation.value.endTime,
        groupId: customUser.value?.userByUid.id,
        price: price.value,
        material: materials,
        rooms: roomlist,
        id: id.value,
        canceld: false,
      }).then(() => {
        push('/reservation')
      })
    }
    const Material = (material: material, plus: boolean) => {
      if (plus) {
        if (
          checkboxStatusMaterials.value[material.name].amount ==
          material.totalAmount
        )
          return
        checkboxStatusMaterials.value[material.name].amount++
      } else {
        if (checkboxStatusMaterials.value[material.name].amount == 0) return
        //remove material
        checkboxStatusMaterials.value[material.name].amount--
      }
      const listIds: string[] = []
      wantedMaterials.value.forEach(material => {
        listIds.push(material.id)
      })
      if (checkboxStatusMaterials.value[material.name].amount == 0)
        wantedMaterials.value.splice(wantedMaterials.value.indexOf(material), 1)
      else {
        if (!listIds.includes(material.id)) wantedMaterials.value.push(material)
      }
      calculatePrice()
    }
    const checkMaterials = () => {
      let sportId: string[] = []
      wantedRoom.value.forEach((room: Room) => {
        room.sports.forEach((sport: any) => {
          if (!sportId.includes(sport.id)) sportId.push(sport.id)
        })
      })
      availableMaterials.value = []
      wantedMaterials.value = []
      checkboxStatusMaterials.value = {}
      return new Promise<void>(resolve => {
        const { onResult } = useQuery<any>(
          AVAILABLEMATERAILS,
          {
            date: reservation.value.date,
            startTime: reservation.value.beginTime,
            endTime: reservation.value.endTime,
            sportId: sportId,
            reservationId: reservations.value?.id,
          },
          {
            fetchPolicy: 'no-cache',
          },
        )
        onResult(result => {
          if (result.loading) return
          availableMaterials.value = result.data.GetAvailableloanableMaterials
          if (reservations.value?.date.substr(0, 10) == reservation.value.date)
            reservations.value?.reservedMaterials.forEach(material => {
              wantedMaterials.value.push(material)
            })
          const listIds: string[] = []
          wantedMaterials.value.forEach(material => {
            listIds.push(material.id)
          })
          availableMaterials.value.forEach(material => {
            if (!listIds.includes(material.id))
              checkboxStatusMaterials.value[material.name] = {
                amount: 0,
              }
            else
              checkboxStatusMaterials.value[material.name] = {
                amount: reservations.value?.reservedMaterials.find(
                  wanted => wanted.id == material.id,
                )?.amountReserved,
              }
          })
          calculatePrice()
          resolve()
        })
      })
    }
    const addRoom = (room: Room) => {
      if (checkboxStatus.value[room.name]) {
        wantedRoom.value.splice(wantedRoom.value.indexOf(room), 1)
        checkboxStatus.value[room.name] = false
        if (wantedRoom.value.length == 0) {
          wantedMaterials.value = []
          availableMaterials.value = []
        }
      } else {
        wantedRoom.value.push(room)
      }
      calculatePrice()
      checkMaterials()
    }
    const check = async () => {
      if (availableRooms.value.length > 0) {
        availableRooms.value = []
        checkboxStatus.value = {}
        wantedRoom.value = []
      }
      return new Promise<void>(resolve => {
        const { onResult } = useQuery<any>(
          GET_AVAILABLE_ROOMS,
          {
            date: reservation.value.date,
            startTime: reservation.value.beginTime,
            endTime: reservation.value.endTime,
            reservationId: reservations.value?.id,
          },
          {
            fetchPolicy: 'no-cache',
          },
        )
        onResult(result => {
          wantedRoom.value = []
          if (
            reservations.value?.date.substr(0, 10) == reservation.value?.date
          ) {
            if (result.loading) return
            reservations.value?.rooms.forEach(room => {
              wantedRoom.value.push(room)
            })
          }
          if (result.loading) return
          availableRooms.value = result.data.getAvailableRooms
          const listwantedRooms: string[] = []
          wantedRoom.value.forEach(room => {
            listwantedRooms.push(room.id)
          })
          price.value = 0
          availableRooms.value.forEach(room => {
            if (listwantedRooms.includes(room.id))
              checkboxStatus.value[room.name] = true
            else checkboxStatus.value[room.name] = false
          })
          checkMaterials()
          // }
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
      timeDivrent()
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
      timeDivrent()
      check()
    }
    const checkDate = () => {
      if (reservation.value.date < new Date().toISOString().substr(0, 10)) {
        reservation.value.date = new Date().toISOString().substr(0, 10)
      }
      check()
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
      changeReservation,
      PriceWhitDiscount,
      wantedRoom,
      wantedMaterials,
      discount,
      detail,
    }
  },
  components: { StyledInputText, StyledButton, Plus, Minus, X },
})
</script>

<template>
  <div class="m-4">
    <div class="mx-auto max-w-7xl">
      <h1 class="my-4 text-xl font-bold">{{ $t('reservation.title') }}</h1>
      <p v-if="!detail" class="text-lg">
        {{ $t('reservation.subtitle') }}
      </p>
      <div v-if="!detail" class="justify-between lg:flex">
        <div class="my-4 items-end gap-2 md:flex">
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
        </div>
        <div class="ml-4 flex items-center gap-2 lg:mr-0">
          <p class="text-xl">€ {{ PriceWhitDiscount.toFixed(2) }}</p>
          <StyledButton type="button" class="h-fit" @click="detail = !detail">
            {{ $t('navigation.addreservation') }}
          </StyledButton>
        </div>
      </div>
      <div v-if="!detail">
        <div class="" v-if="availableRooms.length > 0">
          <p class="text-xl font-medium">beschikbare ruimtes</p>
          <div
            class="mb-4 mt-2 grid auto-rows-fr gap-4 lg:grid-cols-3 2xl:grid-cols-4"
          >
            <label
              class="focus-within:ring-secondary h-full rounded-md ring-4 ring-transparent"
              v-for="room in availableRooms"
            >
              <!-- if the checkbox is checked it neets to aadd dhe room if not checked remooved -->
              <input
                type="checkbox"
                @click="addRoom(room)"
                class="peer sr-only"
                v-model="checkboxStatus[room.name]"
              />
              <div
                class="h-full rounded-md border bg-white p-4 shadow-sm transition-all duration-300 peer-checked:border-2 peer-checked:border-black peer-checked:shadow-lg"
              >
                <div class="flex h-full flex-col justify-between gap-2">
                  <p class="text-lg font-medium">{{ room.name }}</p>
                  <div v-if="room.sports.length > 0">
                    <!-- <p>Sporten :</p> -->
                    <div class="flex flex-wrap gap-2">
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
        <div class="" v-if="availableMaterials.length > 0">
          <p class="text-xl font-medium">beschikbare materialen</p>
          <div
            class="mb-4 mt-2 grid auto-rows-fr gap-4 lg:grid-cols-3 2xl:grid-cols-4"
          >
            <div
              class="h-full"
              :key="material.id"
              v-for="material in availableMaterials"
            >
              <!-- if the checkbox is checked it neets to aadd dhe room if not checked remooved -->
              <div
                class="flex h-full items-center justify-between rounded-md border bg-white p-4 shadow-sm"
              >
                <div class="flex h-full flex-col justify-between gap-2">
                  <p class="text-lg font-medium">{{ material.name }}</p>
                  <div v-if="material.sports.length > 0">
                    <!-- <p>Sporten :</p> -->
                    <div class="flex flex-wrap gap-2">
                      <p
                        :key="sport.id"
                        v-for="sport in material.sports"
                        class="bg-secondary mt-1 rounded-full px-4"
                      >
                        {{ sport.name }}
                      </p>
                    </div>
                  </div>
                  <p class="font-bold">€ {{ material.price }}/h</p>
                </div>
                <div class="flex items-center gap-1">
                  <StyledButton @click="() => Material(material, false)">
                    <Minus />
                  </StyledButton>
                  <p class="text-lg font-medium">
                    {{ checkboxStatusMaterials[material.name].amount }}/{{
                      material.totalAmount
                    }}
                  </p>
                  <StyledButton @click="() => Material(material, true)">
                    <Plus />
                  </StyledButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="w-85 mx-auto rounded-md bg-white p-8 shadow-md">
        <div class="flex justify-between">
          <h1 class="mb-2 text-lg font-medium">Samenvating:</h1>
          <x class="hover:text-red-500" @click="detail = !detail" />
        </div>
        <div class="mb-2">
          <div class="flex justify-between">
            <p>Datum:</p>
            <p>{{ reservation.date }}</p>
          </div>
          <div class="flex justify-between">
            <p>Begin tijd:</p>
            <p>{{ reservation.beginTime }}</p>
          </div>
          <div class="flex justify-between">
            <p>Eind tijd:</p>
            <p>{{ reservation.endTime }}</p>
          </div>
          <div class="flex justify-between">
            <p>Tijd verschil:</p>
            <p>{{ reservation.timeDivrent.toFixed(2) }} uur</p>
          </div>
        </div>
        <div class="mb-2">
          <div v-for="room in wantedRoom" class="">
            <div class="flex justify-between">
              <p>{{ room.name }}</p>
              <div class="flex items-center gap-2">
                <p>€{{ room.pricePerHour.toFixed(2) }}/h</p>
                <button @click="addRoom(room)">
                  <X :size="20" class="hover:text-red-500" />
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="mb-2">
          <div v-for="material in wantedMaterials">
            <div class="flex justify-between">
              <p>{{ material.name }}</p>
              <div class="flex gap-2">
                <p>€{{ material.price.toFixed(2) }}/h</p>
                <button @click="() => Material(material, true)">
                  <Plus :size="20" class="hover:text-red-500" />
                </button>
                <p>{{ checkboxStatusMaterials[material.name].amount }}</p>
                <button @click="() => Material(material, false)">
                  <Minus :size="20" class="hover:text-red-500" />
                </button>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div class="flex justify-between">
            <p>Sub totaal:</p>
            <p>€{{ price.toFixed(2) }}</p>
          </div>
          <div class="flex justify-between">
            <p>Group score:</p>
            <p>{{ Math.round(discount * -100) }}%</p>
          </div>
          <div class="flex justify-between">
            <p>Totaal:</p>
            <p>€{{ PriceWhitDiscount.toFixed(2) }}</p>
          </div>
          <div class="flex justify-end">
            <StyledButton
              type="button"
              class="mt-2 h-fit"
              @click="changeReservation()"
            >
              {{ $t('navigation.addreservation') }}
            </StyledButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
