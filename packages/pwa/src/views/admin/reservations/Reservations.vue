<script lang="ts">
// Interfaces
interface Room {
  id: string
  name: string
  sports: Sport[]
  pricePerHour: number
  type: string
  createdAt?: string
  updatedAt?: string
}
interface IRooms {
  GetAllRooms: [Room]
  GetAllGyms: [Room]
  GetAllWorkRooms: [Room]
  GetAllChangingRooms: [Room]
  GetAllSwimmingPools: [Room]
  GetAllDivePools: [Room]
}

interface Sport {
  id: string
  name: string
}

interface IReservations {
  GetReservationsByRoomAndDay: [Reservation]
}

interface group {
  id: string
  UID: string
  locale: string
  role: string
}

interface reserved_materials {
  id: string
  name: string
  totalAmount: number
  wantedAmount: number
  price: number
  sports: Sport[]
  isComplete: boolean
  description: string
  amountReserved: number
}

interface Reservation {
  id: string
  date: string
  startTime: string
  endTime: string
  group: group
  reserved_materials: reserved_materials[]
  rooms: Room[]
  price: number
  isCancelled: boolean
  createdAt: string
  updatedAt: string
}

// Imports
import { useQuery } from '@vue/apollo-composable'
import {
  ALL_ROOMS,
  ALL_GYMS,
  ALL_WORK_ROOMS,
  ALL_CHANGING_ROOMS,
  ALL_SWIMMING_POOLS,
  ALL_DIVE_POOLS,
} from '../../../graphql/room.query'
import { GET_RESERVATIONS_BY_ROOM_AND_DATE } from '../../../graphql/reservations.query'
import { computed, defineComponent, ref, watch } from 'vue'
import UseFirebase from '../../../composables/useFirebase'
import Modal from '@/components/modal/Modal.vue'
import { useRouter } from 'vue-router'
import DoubleClickEdit from '@/components/generic/DoubleClickEdit.vue'
import useLastRoute from '@/composables/useLastRoute'

// Export default
export default defineComponent({
  components: {
    Modal,
    DoubleClickEdit,
  },
  setup() {
    // Router
    const { push, replace, currentRoute } = useRouter()
    // Firebase
    const { firebaseUser } = UseFirebase()
    const idToken = ref()
    const getIdToken = async () => {
      idToken.value = await firebaseUser.value?.getIdToken()
    }
    getIdToken()

    //All rooms
    const {
      loading: loadingRooms,
      result: resultRooms,
      error: errorRooms,
    } = useQuery<IRooms>(
      ALL_ROOMS,
      {},
      {
        fetchPolicy: 'no-cache',
      },
    )

    const fetchReservationsByRoomAndDate = async (
      roomId: string,
      date: string,
    ) => {
      const { loading, result, error } = useQuery<IReservations>(
        GET_RESERVATIONS_BY_ROOM_AND_DATE,
        {
          roomId,
          date,
        },
        {
          fetchPolicy: 'no-cache',
        },
      )

      return {
        loading,
        result,
        error,
      }
    }

    // Define an array to store reservations for each room
    const roomReservations = ref<any>([])

    // Loop through each room and fetch reservations
    const fetchReservations = async () => {
      roomReservations.value = []
      if (resultRooms.value === undefined) return
      for (const room of resultRooms.value.GetAllRooms) {
        const roomRes = await fetchReservationsByRoomAndDate(
          room.id,
          date.value,
        )
        roomReservations.value.push({ room, reservations: roomRes.result })
      }
    }

    // All reservations by room and date
    const {
      loading: loadingReservations,
      result: resultReservations,
      error: errorReservations,
    } = useQuery<IReservations>(
      GET_RESERVATIONS_BY_ROOM_AND_DATE,
      {
        roomId: '6546ae005d025709fbf1d827',
        date: '2024-01-01T00:00:00.000+00:00',
      },
      {
        fetchPolicy: 'no-cache',
      },
    )
    const {
      loading: loadingGyms,
      result: resultGyms,
      error: errorGyms,
      refetch: refetchGyms,
    } = useQuery<IRooms>(
      ALL_GYMS,
      {},
      {
        fetchPolicy: 'no-cache',
      },
    )
    const {
      loading: loadingWorkRooms,
      result: resultWorkRooms,
      error: errorWorkRooms,
      refetch: refetchWorkRooms,
    } = useQuery<IRooms>(
      ALL_WORK_ROOMS,
      {},
      {
        fetchPolicy: 'no-cache',
      },
    )
    const {
      loading: loadingChangingRooms,
      result: resultChangingRooms,
      error: errorChangingRooms,
      refetch: refetchChangingRooms,
    } = useQuery<IRooms>(
      ALL_CHANGING_ROOMS,
      {},
      {
        fetchPolicy: 'no-cache',
      },
    )
    const {
      loading: loadingSwimmingPools,
      result: resultSwimmingPools,
      error: errorSwimmingPools,
      refetch: refetchSwimmingPools,
    } = useQuery<IRooms>(
      ALL_SWIMMING_POOLS,
      {},
      {
        fetchPolicy: 'no-cache',
      },
    )
    const {
      loading: loadingDivePools,
      result: resultDivePools,
      error: errorDivePools,
      refetch: refetchDivePools,
    } = useQuery<IRooms>(
      ALL_DIVE_POOLS,
      {},
      {
        fetchPolicy: 'no-cache',
      },
    )

    watch(
      resultRooms,
      value => {
        if (value !== undefined) fetchReservations()
      },
      { immediate: true },
    )

    const { lastRoute } = useLastRoute()

    watch(
      lastRoute,
      value => {
        if (value.startsWith('/admin/reservations/id/')) {
          console.log('lastRoute changed')
          fetchReservations()
        }
      },
      { immediate: true },
    )

    const fetchWithFilters = () => {
      if (typeSelector.value == 0) {
        refetchGyms()
      } else if (typeSelector.value == 1) {
        refetchWorkRooms()
      } else if (typeSelector.value == 2) {
        refetchChangingRooms()
      } else if (typeSelector.value == 3) {
        refetchSwimmingPools()
      } else if (typeSelector.value == 4) {
        refetchDivePools()
      }
    }

    // Selector type of room
    let typeSelector = ref(0)
    let typeSelectorName = ref('Sportzaal')
    const type = computed(() => currentRoute.value.params.type)
    if (type.value !== undefined) typeSelector.value = Number(type.value)
    else push('/admin/reservations/type/0')
    watch(
      typeSelector,
      value => {
        if (typeSelector.value == 0) typeSelectorName.value = 'Sportzaal'
        else if (typeSelector.value == 1) typeSelectorName.value = 'Werkruimte'
        else if (typeSelector.value == 2) typeSelectorName.value = 'Kleedruimte'
        else if (typeSelector.value == 3) typeSelectorName.value = 'Zwembad'
        else if (typeSelector.value == 4) typeSelectorName.value = 'Duikput'
      },
      { immediate: true },
    )

    // Reservation width
    // Day start and end hour
    const dayStartHour = 8
    const dayEndHour = 20
    // Calculate reservation width
    const calculateReservationWidth = (reservation: any) => {
      const totalMinutesInDay = (dayEndHour - dayStartHour) * 60

      const startHour = parseInt(reservation.startTime.split(':')[0])
      const startMinute = parseInt(reservation.startTime.split(':')[1])
      const endHour = parseInt(reservation.endTime.split(':')[0])
      const endMinute = parseInt(reservation.endTime.split(':')[1])

      const startTimeInMinutes = startHour * 60 + startMinute
      const endTimeInMinutes = endHour * 60 + endMinute

      const widthPercentage =
        ((endTimeInMinutes - startTimeInMinutes) / totalMinutesInDay) * 100
      const leftPercentage =
        ((startTimeInMinutes - dayStartHour * 60) / totalMinutesInDay) * 100

      return `width: ${widthPercentage}%; left: ${leftPercentage}%;`
    }

    const handleReservationDetail = (reservation: any) => {
      push(`/admin/reservations/id/${reservation.id}`)
    }

    // Date
    let today = new Date()

    const handleDateChange = (event: any) => {
      date.value = event.target.value
      fetchReservations()
    }

    const date = ref(today.toISOString().substring(0, 10))
    const redLinePosition = ref(0)

    const calculateRedLinePosition = () => {
      const totalMinutesInDay = (dayEndHour - dayStartHour) * 60
      const currentTime = new Date()
      const currentHour = currentTime.getHours()
      const currentMinute = currentTime.getMinutes()
      const currentTimeInMinutes = currentHour * 60 + currentMinute
      const leftPercentage =
        ((currentTimeInMinutes - dayStartHour * 60) / totalMinutesInDay) * 100
      if (leftPercentage > 100) redLinePosition.value = 100
      else if (leftPercentage < 0) redLinePosition.value = 0
      else redLinePosition.value = leftPercentage
      //Call back this function every minute
      setTimeout(() => {
        calculateRedLinePosition()
      }, 60000)
    }
    // Call calculateRedLinePosition on load
    calculateRedLinePosition()

    return {
      idToken,
      resultReservations,
      loadingReservations,
      errorReservations,
      resultRooms,
      loadingRooms,
      errorRooms,
      resultGyms,
      loadingGyms,
      errorGyms,
      resultWorkRooms,
      loadingWorkRooms,
      errorWorkRooms,
      resultChangingRooms,
      loadingChangingRooms,
      errorChangingRooms,
      resultSwimmingPools,
      loadingSwimmingPools,
      errorSwimmingPools,
      resultDivePools,
      loadingDivePools,
      errorDivePools,
      typeSelector,
      typeSelectorName,
      push,
      replace,
      currentRoute,
      fetchWithFilters,
      calculateReservationWidth,
      calculateRedLinePosition,
      redLinePosition,
      dayStartHour,
      dayEndHour,
      date,
      roomReservations,
      handleDateChange,
      handleReservationDetail,
    }
  },
})
</script>

<template>
  <div class="m-8">
    <div
      class="flex flex-col items-center justify-center whitespace-nowrap md:flex-row"
    >
      <button
        @click="replace('/admin/reservations/type/0'), (typeSelector = 0)"
        :class="{
          'bg-secondary ': typeSelector === 0,
          'bg-primary-light': typeSelector !== 0,
        }"
        class="w-full p-2 transition-colors duration-100 hover:text-white md:w-auto md:min-w-[120px] md:rounded-l-md"
      >
        {{ $t('rooms.gyms') }}
      </button>
      <button
        @click="replace('/admin/reservations/type/1'), (typeSelector = 1)"
        :class="{
          'bg-secondary ': typeSelector === 1,
          'bg-primary-light': typeSelector !== 1,
        }"
        class="w-full p-2 transition-colors duration-100 hover:text-white md:w-auto md:min-w-[120px]"
      >
        {{ $t('rooms.workRooms') }}
      </button>
      <button
        @click="replace('/admin/reservations/type/2'), (typeSelector = 2)"
        :class="{
          'bg-secondary ': typeSelector === 2,
          'bg-primary-light': typeSelector !== 2,
        }"
        class="w-full p-2 transition-colors duration-100 hover:text-white md:w-auto md:min-w-[120px]"
      >
        {{ $t('rooms.dressingRooms') }}
      </button>
      <button
        @click="replace('/admin/reservations/type/3'), (typeSelector = 3)"
        :class="{
          'bg-secondary ': typeSelector === 3,
          'bg-primary-light': typeSelector !== 3,
        }"
        class="w-full p-2 transition-colors duration-100 hover:text-white md:w-auto md:min-w-[120px]"
      >
        {{ $t('rooms.swimmingPools') }}
      </button>
      <button
        @click="replace('/admin/reservations/type/4'), (typeSelector = 4)"
        :class="{
          'bg-secondary ': typeSelector === 4,
          'bg-primary-light': typeSelector !== 4,
        }"
        class="w-full p-2 transition-colors duration-100 hover:text-white md:w-auto md:min-w-[120px] md:rounded-r-md"
      >
        {{ $t('rooms.divingWells') }}
      </button>
    </div>
    <div class="flex gap-2 py-4 md:py-8">
      <label for="start">Filter date:</label>

      <input
        class="border-primary-light text-primary-text focus:outline-primary-dark rounded-sm border-2"
        type="date"
        id="start"
        :value="date"
        @change="handleDateChange"
      />
    </div>
    <div class="flex flex-col gap-20">
      <div>
        <div v-for="roomAndReservation in roomReservations">
          <div v-if="roomAndReservation.room.type == typeSelectorName">
            <h2 class="text-primary-text text-xl font-bold">
              {{ roomAndReservation.room.name }}
            </h2>
            <div
              class="text-primary-text flex justify-between text-xl font-medium"
            >
              <h3>{{ dayStartHour }}u</h3>
              <h3>{{ dayEndHour }}u</h3>
            </div>
            <div class="relative h-24 w-full rounded-md bg-white p-2">
              <button
                class="bg-primary-medium absolute h-20 overflow-hidden rounded-sm p-1.5 text-white"
                v-for="reservation in roomAndReservation.reservations
                  ?.GetReservationsByRoomAndDay"
                :style="calculateReservationWidth(reservation)"
                @click="handleReservationDetail(reservation)"
              >
                <div>
                  {{ reservation.startTime }} - {{ reservation.endTime }}
                </div>
              </button>
              <div class="absolute" :style="`left: ${redLinePosition}%`">
                <div
                  class="border-b-3 border-r-3 border-red relative -ml-0.5 -mt-4 h-2 w-2 rotate-45 bg-transparent"
                ></div>
                <div class="bg-red relative h-24 w-1"></div>
                <div
                  class="border-t-3 border-l-3 border-red relative -mb-2 -ml-0.5 h-2 w-2 rotate-45 bg-transparent"
                ></div>
              </div>
            </div>
          </div>
        </div>
        <!-- <div class="relative w-full h-24 bg-white p-2 rounded-md">
          <div
            class="absolute bg-primary-medium text-white h-20 overflow-hidden rounded-sm p-1.5"
            v-for="reservation in resultReservations?.GetReservationsByRoomAndDay"
            :style="calculateReservationWidth(reservation)"
          >
            <div>{{ reservation.startTime }} - {{ reservation.endTime }}</div>
          </div>
          <div class="absolute" :style="`left: ${redLinePosition}%`">
            <div
              class="relative bg-transparent border-b-3 border-r-3 rotate-45 border-red w-2 h-2 -ml-0.5 -mt-4"
            ></div>
            <div class="relative bg-red w-1 h-24"></div>
            <div
              class="relative bg-transparent border-t-3 border-l-3 rotate-45 border-red w-2 h-2 -ml-0.5 -mb-2"
            ></div>
          </div>
        </div> -->
      </div>
      <RouterView />
    </div>
  </div>
</template>

<style scoped></style>
