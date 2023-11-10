<script lang="ts">
import { defineComponent } from 'vue'
import StyledButton from '@/components/generic/StyledButton.vue'
import { useQuery } from '@vue/apollo-composable'
import { ref } from '@vue/reactivity'
import { GET_RESERVATIONS } from '@/graphql/reservations.query'
import { Reservation } from '@/interface/reservation'

export default defineComponent({
  components: { StyledButton },
  computed: {},
  setup() {
    const reservations = ref<Reservation[]>([])
    new Promise<void>(resolve => {
      const { onResult } = useQuery<any>(GET_RESERVATIONS)
      onResult(result => {
        reservations.value = result.data.getReservationsByUser
        console.log(reservations.value)
        resolve()
      })
    })

    return { reservations }
  },
})
</script>

<template>
  <h1>Reservation</h1>
  <StyledButton
    ><router-link to="reservation/add">{{
      $t('navigation.addreservation')
    }}</router-link></StyledButton
  >
  <div
    class="grid grid-rows-[repeat(4,1fr)] gap-4 lg:grid-cols-3 2xl:grid-cols-4"
  >
    <div v-for="reservation in reservations">
      <div
        class=" h-full items-center justify-between rounded-md border bg-white p-4 shadow-sm"
      >
        <div class="flex gap-4">
          <p>
            <span>{{ new Date(reservation.date).getDay() }}</span
            >/<span>{{ new Date(reservation.date).getMonth() + 1 }}</span
            >/<span>{{ new Date(reservation.date).getFullYear() }}</span>
          </p>
          <p>{{ reservation.startTime }}</p>
          <p>{{ reservation.endTime }}</p>
        </div>
        <p
          v-for="room in reservation.rooms"
          class="bg-secondary mt-1 rounded-full px-4 w-fit"
        >
          {{ room.name }}
        </p>
        <p
          v-for="material in reservation.reservedMaterials"
          class="bg-secondary mt-1 rounded-full px-4 w-fit"
        >
          {{material.amountReserved}} x {{ material.name }}
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
