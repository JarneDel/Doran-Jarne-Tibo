<script lang="ts">
import { defineComponent } from 'vue';

interface Day {
  name: string;
  hours: string;
  EnglishName?: string;
}

export default defineComponent({
  props: {
    title: String,
    openingText: String,
    openingHours: {
      type: Array as () => Day[],
    },
  },
  computed: {
    currentDay(): string {
      const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
      return today.charAt(0).toUpperCase() + today.slice(1); // Capitalize the first letter
    },
    open(): boolean {
      const currentTime = new Date();
      if (!this.openingHours) return false;
      const currentDayOpeningHours = this.openingHours.find(
        (day) => day.EnglishName === this.currentDay
      );

      if (currentDayOpeningHours) {
        if (currentDayOpeningHours.hours === 'Closed') return false;
        const [openHour, openMinute] = currentDayOpeningHours.hours
          .split('-')[0]
          .split(':')
          .map(Number);
        const openTime = new Date(currentTime).setHours(
          openHour,
          openMinute,
          0,
          0
        );

        const [closeHour, closeMinute] = currentDayOpeningHours.hours
          .split('-')[1]
          .split(':')
          .map(Number);
        const closeTime = new Date(currentTime).setHours(
          closeHour,
          closeMinute,
          0,
          0
        );

        return (
          currentTime.getTime() >= openTime &&
          currentTime.getTime() <= closeTime
        );
      }

      return false;
    },
  },
});
</script>

<template>
  <div
    class="flex flex-col items-center p-2 md:p-4 w-full h-80 bg-white max-w-xs shadow-md rounded-md text-primary-text"
  >
    <h3 class="text-xl fontblack text-primary-text mb-2">{{ title }}</h3>
    <h4 v-if="open" class="text-lg font-bold mb-2">
      {{ $t('home.currentlyOpen') }}
    </h4>
    <h4 v-if="!open" class="text-lg font-bold mb-2">
      {{ $t('home.currentlyClosed') }}
    </h4>
    <ul class="w-full leading-8 font-medium max-w-3xs">
      <li class="w-full" v-for="(day, index) in openingHours" :key="index">
        <div
          class="flex w-full justify-between"
          :class="{
            'font-bold text-primary-dark': day.EnglishName === currentDay,
          }"
        >
          <h5>{{ day.name }}:</h5>
          <p>{{ day.hours }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>
