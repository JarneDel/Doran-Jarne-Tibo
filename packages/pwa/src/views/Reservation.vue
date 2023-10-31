<script lang="ts">
import { defineComponent, ref } from 'vue'
import StyledInputText from '@/components/generic/StyledInputText.vue'
import StyledButton from '@/components/generic/StyledButton.vue'
import { GET_AVAILABLE_ROOMS } from '@/graphql/room.query'
import { useQuery } from '@vue/apollo-composable'
import {Room} from '@/interface/roomInterface'
export default defineComponent({
  setup() {
    const checkboxStatus = ref({})
    const reservation = ref({
      date: new Date().toISOString().substr(0, 10),
      beginTime: '08:00',
      endTime: '18:00',
      timeDivrent: 10,
    })
    const availableRooms = ref<Room[]>([])
    const wantedRoom = ref([])
    const price = ref(0)
    const addRoom = (room:Room) => {
      if (checkboxStatus.value[room.name]) {
        wantedRoom.value.splice(wantedRoom.value.indexOf(room), 1)
        price.value -= room.pricePerHour * reservation.value.timeDivrent
      } else {
        wantedRoom.value.push(room) 
        price.value += room.pricePerHour * reservation.value.timeDivrent
      }
      console.log(wantedRoom.value)
    }
    const check = async () => {
      const { onResult } = useQuery<any>(GET_AVAILABLE_ROOMS, {
        date: reservation.value.date,
        startTime: reservation.value.beginTime,
        endTime: reservation.value.endTime,
      })
      onResult(result => {
        console.log(result.data.getAvailableRooms)
        availableRooms.value = result.data.getAvailableRooms
        availableRooms.value.forEach(room => {
          checkboxStatus.value[room.name] = false
        })
        console.log({test:checkboxStatus.value})
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
      let beginTime = new Date(0, 0, 0, parseInt(begin[0]), parseInt(begin[1]), 0)
      let endTime = new Date(0, 0, 0, parseInt(end[0]), parseInt(end[1]), 0)
      let diff = endTime.getTime() - beginTime.getTime()
      let hours = Math.floor(diff / 1000 / 60 / 60)
      diff -= hours * 1000 * 60 * 60
      let minutes = Math.floor(diff / 1000 / 60)
      reservation.value.timeDivrent = (hours * 60 + minutes) / 60
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
      let beginTime = new Date(0, 0, 0, parseInt(begin[0]), parseInt(begin[1]), 0)
      let endTime = new Date(0, 0, 0, parseInt(end[0]), parseInt(end[1]), 0)
      let diff = endTime.getTime() - beginTime.getTime()
      let hours = Math.floor(diff / 1000 / 60 / 60)
      diff -= hours * 1000 * 60 * 60
      let minutes = Math.floor(diff / 1000 / 60)
      reservation.value.timeDivrent = (hours * 60 + minutes) / 60
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
    }
  },
  components: { StyledInputText, StyledButton },
})
</script>

<template>
  <div>
    <h1 class="m-4 text-xl font-bold">{{ $t('reservation.title') }}</h1>
    <p class="ml-4 text-lg">
      {{ $t('reservation.subtitle') }}
    </p>
    <div class="flex justify-between">
      <div class="m-4 flex items-end gap-2">
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
        <StyledButton type="button" class="h-fit" @click="check">
          {{ $t('reservation.check') }}
        </StyledButton>
      </div>
      <div class="flex items-center gap-2">
        <p class="text-xl">€ {{ price }}</p>
        <StyledButton type="button" class="h-fit" @click="console.log('🌈')">
          {{ $t('reservation.reserve') }}
        </StyledButton>
      </div>
    </div>
    <div class="mx-4" v-if="availableRooms">
      <p class="text-lg">beschikbare ruimtes</p>
      <div class="grid grid-cols-4 grid-rows-[repeat(4,1fr)] gap-4">
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
              <p class="font-bold">€ {{ room.pricePerHour }}</p>
            </div>
          </div>
        </label>
      </div>
    </div>
  </div>
</template>
