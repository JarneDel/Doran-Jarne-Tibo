<script lang="ts">
import { defineComponent } from 'vue'
import StyledButton from '@/components/generic/StyledButton.vue'
import StyledInputText from '@/components/generic/StyledInputText.vue'
import { useQuery, useMutation } from '@vue/apollo-composable'
import { ref } from '@vue/reactivity'
import {
  GET_RESERVATIONS,
  GET_RESERVATIONS_BY_DATE_AND_USER,CANCEL_RESERVATION
} from '@/graphql/reservations.query'
import { Reservation } from '@/interface/reservation'

export default defineComponent({
  components: { StyledButton, StyledInputText },
  computed: {},
  setup() {
    const { mutate: cancelReservation } = useMutation(CANCEL_RESERVATION)
    const reservations = ref<Reservation[]>([])
    const reservationSeach = ref<Boolean>(false)
    const reservationDate = ref<string>(new Date().toISOString().substr(0, 10))
    new Promise<void>(resolve => {
      reservationSeach.value = false
      const { onResult } = useQuery<any>(GET_RESERVATIONS)
      onResult(result => {
        reservations.value = result.data.getReservationsByUser
        // console.log(reservations.value)
        resolve()
      })
    })
    const onDateChange = () => {
      reservationSeach.value = true
      new Promise<void>(resolve => {
        const { onResult } = useQuery<any>(GET_RESERVATIONS_BY_DATE_AND_USER, {
          date: reservationDate.value,
        })
        onResult(result => {
          reservations.value = result.data.GetReservationsByDateAndUser
          console.log(reservations.value)
          resolve()
        })
      })
    }
    const getAllReservations=()=>{
      new Promise<void>(resolve => {
        reservationSeach.value = false
        const { onResult } = useQuery<any>(GET_RESERVATIONS)
        onResult(result => {
          reservations.value = result.data.getReservationsByUser
          // console.log(reservations.value)
          resolve()
        })
      })
    }
    
    const cancelReservationById=async (id:string)=>{
      const result = await cancelReservation({id:id})
      console.log(result)
      //delete reservation from list
      reservations.value = reservations.value.filter(reservation => reservation.id !== id)
    }

    return { reservations, reservationDate, onDateChange, reservationSeach, getAllReservations,cancelReservationById }
  },
})
</script>

<template>
  <div class="m-4">
    <div class="mb-4 flex items-center justify-between">
      <div class=" flex gap-4 items-center">
        <div>
          <h1 class="text-xl font-bold">Reservation</h1>
          <styled-input-text
            v-model="reservationDate"
            :label="$t('reservation.date')"
            class="w-fit"
            required
            type="date"
            @change="onDateChange()"
          />
        </div>
        <div v-if="reservationSeach">
          <StyledButton @click="getAllReservations()">{{ $t('reservation.showAll') }}</StyledButton>
        </div>
      </div>
      <StyledButton class="h-fit"
        ><router-link to="reservation/add">{{
          $t('navigation.addreservation')
        }}</router-link></StyledButton
      >
    </div>
    <div
      class="grid gap-4 lg:grid-cols-3 2xl:grid-cols-4"
    >
      <div v-for="reservation in reservations">
        <div
          class="flex h-full flex-col justify-between rounded-md border bg-white p-4 shadow-sm"
        >
          <div>
            <div class="flex gap-4">
              <p>
                <span>{{ new Date(reservation.date).getDate() }}</span
                >/<span>{{ new Date(reservation.date).getMonth() + 1 }}</span
                >/<span>{{ new Date(reservation.date).getFullYear() }}</span>
              </p>
              <p>{{ reservation.startTime }}</p>
              <p>{{ reservation.endTime }}</p>
            </div>
            <div class="mt-4 flex flex-wrap gap-x-4 gap-y-2">
              <p
                v-for="room in reservation.rooms"
                class="bg-secondary w-fit rounded-full px-4"
              >
                {{ room.name }}
              </p>
            </div>
            <div class="mt-4 flex flex-wrap gap-x-4 gap-y-2">
              <p
                v-for="material in reservation.reservedMaterials"
                class="bg-secondary w-fit rounded-full px-4"
              >
                {{ material.amountReserved }} x {{ material.name }}
              </p>
            </div>
          </div>
          <div class="mt-4 flex items-center justify-between">
            <p class="text-lg font-bold">
              € {{ reservation.price.toFixed(2) }}
            </p>
            <StyledButton @click="cancelReservationById(reservation.id)">{{ $t('reservation.cansle') }}</StyledButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>