<script lang="ts">
// Vue
import { ref } from 'vue'
// Firebase
import { type AuthError } from 'firebase/auth'
// Composables
import useFirebase from '@/composables/useFirebase'

// Components
import OpeningsHoursCard from '@/components/OpeningsHoursCard.vue'
import GoogleMaps from '@/components/GoogleMaps.vue'

interface Day {
  name: string;
  hours: string;
  EnglishName?: string;
}

export default {
  components: {
    OpeningsHoursCard,
    GoogleMaps,
},
  setup() {
    const { logout } = useFirebase()

    const error = ref<AuthError | null>(null)

    const openingsHoursCafitaria = <Day[]>[
      {
        name:  `{{ $t('rooms.gyms') }}`,
        hours: '9:00 - 22:00',
        EnglishName: 'Monday',
      },
      {
        name: 'Tuesday',
        hours: '9:00 - 22:00',
        EnglishName: 'Tuesday',
      },
      {
        name: 'Wednesday',
        hours: '9:00 - 22:00',
        EnglishName: 'Wednesday',
      },
      {
        name: 'Thursday',
        hours: '9:00 - 22:00',
        EnglishName: 'Thursday',
      },
      {
        name: 'Friday',
        hours: '9:00 - 22:00',
        EnglishName: 'Friday',
      },
      {
        name: 'Saturday',
        hours: '9:00 - 22:00',
        EnglishName: 'Saturday',
      },
      {
        name: 'Sunday',
        hours: '9:00 - 22:00',
        EnglishName: 'Sunday',
      },
    ]

    const handleLogout = () => {
      logout()
        .then(() => {
          console.log('logged out')
        })
        .catch((err: AuthError) => {
          error.value = err
        })
    }


    return {
      error,
      handleLogout,
      openingsHoursCafitaria,
    }
  },
}
</script>

<template>
  <div>
    <div>
      <img
        class="h-64 w-full object-cover md:h-fit"
        src="../assets/sportcomplex.webp"
        alt="Afbeelding van het sportcomplex"
      />
      <div
        class="w-full flex items-end justify-end pr-12 -mt-104 pb-4 xl:pr-20 xl:-mt-120 xl:pb-20 2xl:-mt-140"
      >
        <div
          class="hidden lg:flex bg-white w-100 h-100 2xl:h-120 2xl:w-120 rounded-full text-center items-center justify-center overflow-hidden shadow-2xl"
        >
          <GoogleMaps />
        </div>
      </div>
    </div>
    <div
      style="
        background-image: url('public/backgroundPattern.webp');
        background-repeat: repeat;
      "
      class="p-4 md:p-8 flex flex-col items-center justify-center gap-4 md:gap-6 lg:gap-8 xl:gap-10 2xl:gap-20 lg:flex-row xl:p-12 2xl:p-20"
    >
      <OpeningsHoursCard
        :title="$t('home.cafetaria')"
        :openingHours="[
          {
            name: $t('day.monday'),
            hours: '08:00 - 22:00',
            EnglishName: 'Monday',
          },
          {
            name: $t('day.tuesday'),
            hours: '08:00 - 22:00',
            EnglishName: 'Tuesday',
          },
          {
            name: $t('day.wednesday'),
            hours: '08:00 - 22:00',
            EnglishName: 'Wednesday',
          },
          {
            name: $t('day.thursday'),
            hours: '08:00 - 22:00',
            EnglishName: 'Thursday',
          },
          {
            name: $t('day.friday'),
            hours: '08:00 - 24:00',
            EnglishName: 'Friday',
          },
          {
            name: $t('day.saturday'),
            hours: '10:00 - 24:00',
            EnglishName: 'Saturday',
          },
          {
            name: $t('day.sunday'),
            hours: '09:00 - 24:00',
            EnglishName: 'Sunday',
          },
        ]"
      />
      <OpeningsHoursCard
        :title="$t('home.publicSwimming')"
        openingText="Open nu: sluit om 22:00"
        :openingHours="[
          {
            name: $t('day.monday'),
            hours: '18:00 - 21:00',
            EnglishName: 'Monday',
          },
          {
            name: $t('day.tuesday'),
            hours: '18:00 - 21:00',
            EnglishName: 'Tuesday',
          },
          {
            name: $t('day.wednesday'),
            hours: '12:00 - 21:00',
            EnglishName: 'Wednesday',
          },
          {
            name: $t('day.thursday'),
            hours: '18:00 - 21:00',
            EnglishName: 'Thursday',
          },
          {
            name: $t('day.friday'),
            hours: '18:00 - 21:00',
            EnglishName: 'Friday',
          },
          {
            name: $t('day.saturday'),
            hours: '09:00 - 22:00',
            EnglishName: 'Saturday',
          },
          {
            name: $t('day.sunday'),
            hours: '09:00 - 22:00',
            EnglishName: 'Sunday',
          },
        ]"
      />
      <OpeningsHoursCard
        :title="$t('home.swimmingLaps')"
        openingText="Open nu: sluit om 22:00"
        :openingHours="[
          {
            name: $t('day.monday'),
            hours: '18:00 - 21:00',
            EnglishName: 'Monday',
          },
          {
            name: $t('day.tuesday'),
            hours: '18:00 - 21:00',
            EnglishName: 'Tuesday',
          },
          {
            name: $t('day.wednesday'),
            hours: '12:00 - 21:00',
            EnglishName: 'Wednesday',
          },
          {
            name: $t('day.thursday'),
            hours: '18:00 - 21:00',
            EnglishName: 'Thursday',
          },
          {
            name: $t('day.friday'),
            hours: '18:00 - 21:00',
            EnglishName: 'Friday',
          },
          {
            name: $t('day.saturday'),
            hours: '09:00 - 22:00',
            EnglishName: 'Saturday',
          },
          {
            name: $t('day.sunday'),
            hours: '09:00 - 22:00',
            EnglishName: 'Sunday',
          },
        ]"
      />
    </div>
  </div>
</template>
<style scoped></style>
