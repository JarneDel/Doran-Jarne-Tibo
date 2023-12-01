<script lang="ts">
import { defineComponent } from 'vue'
import StyledButton from '@/components/generic/StyledButton.vue'
import StyledInputText from '@/components/generic/StyledInputText.vue'
import { useQuery, useMutation } from '@vue/apollo-composable'
import { ref } from '@vue/reactivity'
import {
  GET_RESERVATIONS,
  GET_RESERVATIONS_BY_DATE_AND_USER,
  CANCEL_RESERVATION,
} from '@/graphql/reservations.query'
import { Reservation } from '@/interface/reservation'
import { Pencil } from 'lucide-vue-next'
import StyledLable from '@/components/generic/StyledLable.vue'

export default defineComponent({
  components: { StyledButton, StyledInputText, Pencil, StyledLable },
  computed: {},
  setup() {
    const { mutate: cancelReservation } = useMutation(CANCEL_RESERVATION)
    const reservations = ref<Reservation[]>([])
    const reservationSeach = ref<Boolean>(false)
    const reservationDate = ref<string>(new Date().toISOString().substr(0, 10))
    new Promise<void>(resolve => {
      reservationSeach.value = false
      const { onResult } = useQuery<any>(
        GET_RESERVATIONS,
        {},
        {
          fetchPolicy: 'no-cache',
        },
      )
      onResult(result => {
        if (result.loading) return
        reservations.value = result.data.getReservationsByUser
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
          if (result.loading) return
          reservations.value = result.data.GetReservationsByDateAndUser
          resolve()
        })
      })
    }
    const getAllReservations = () => {
      new Promise<void>(resolve => {
        reservationSeach.value = false
        const { onResult } = useQuery<any>(GET_RESERVATIONS)
        onResult(result => {
          if (result.loading) return
          reservations.value = result.data.getReservationsByUser
          resolve()
        })
      })
    }

    const cancelReservationById = async (id: string) => {
      await cancelReservation({ id: id })
      //delete reservation from list
      reservations.value = reservations.value.filter(
        reservation => reservation.id !== id,
      )
    }

    return {
      reservations,
      reservationDate,
      onDateChange,
      reservationSeach,
      getAllReservations,
      cancelReservationById,
    }
  },
})
</script>

<template>
  <div class="m-4">
    <div class="mx-auto max-w-7xl">
      <div class="mb-4 flex items-center justify-between">
        <div class="flex items-end gap-4">
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
            <StyledButton @click="getAllReservations()">{{
              $t('reservation.showAll')
            }}</StyledButton>
          </div>
        </div>
        <router-link to="reservation/add">
          <StyledButton class="h-fit">{{
            $t('navigation.addreservation')
          }}</StyledButton></router-link
        >
      </div>
      <div class="grid gap-4 lg:grid-cols-3 2xl:grid-cols-4">
        <div v-for="reservation in reservations">
          <div
            class="flex h-full flex-col justify-between rounded-md border bg-white p-4 shadow-sm"
          >
            <div>
              <div class="flex justify-between">
                <div class="flex gap-4 text-lg">
                  <p>
                    <span>{{ new Date(reservation.date).getDate() }}</span
                    >/<span>{{
                      new Date(reservation.date).getMonth() + 1
                    }}</span
                    >/<span>{{
                      new Date(reservation.date).getFullYear()
                    }}</span>
                  </p>
                  <p>{{ reservation.startTime }}</p>
                  <p>{{ reservation.endTime }}</p>
                </div>
                <router-link
                  class="flex h-9 w-9 items-center justify-center rounded-full bg-gray-300"
                  :to="'reservation/edit/' + reservation.id"
                  v-if="
                    reservation.date > new Date().toISOString().substr(0, 10)
                  "
                >
                  <Pencil />
                </router-link>
              </div>
              <div class="mt-4 flex flex-wrap gap-x-4 gap-y-2">
                <StyledLable
                  v-for="room in reservation.rooms"
                  type="room"
                >
                  {{ room.name }}
                </StyledLable>
              </div>
              <div class="mt-4 flex flex-wrap gap-x-4 gap-y-2">
                <StyledLable type="material" v-for="material in reservation.reservedMaterials">
                  {{ material.amountReserved }} x
                  {{ material.name }}
                </StyledLable>
              </div>
            </div>
            <div class="mt-4 flex items-center justify-between">
              <p class="text-lg font-bold">
                € {{ reservation.price.toFixed(2) }}
              </p>
              <StyledButton
                @click="cancelReservationById(reservation.id)"
                v-if="reservation.date > new Date().toISOString().substr(0, 10)"
                >{{ $t('reservation.cansle') }}</StyledButton
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
