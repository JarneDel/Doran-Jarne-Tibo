<script lang="ts">
import { defineComponent } from 'vue'
import {Medal} from 'lucide-vue-next'
import StyledButton from '@/components/generic/StyledButton.vue';

export default defineComponent(
  {
    components: { Medal, StyledButton },
    setup() {
      return {
        Medal
      }
    }
  }
)
</script>

<template>
  <div class="flex items-center justify-center h-screen bg-gray-100">
    <div class="p-8 bg-white shadow-md rounded-md">
      <div class="text-center">
        <div class="w-16 mx-auto mb-4 animate-bounce text-yellow-500"><Medal class="w-16 h-16"/></div>
        <h1 class="text-4xl font-bold text-gray-800 mb-2">403 - Geen toegang</h1>
        <p class="text-lg text-gray-600 mb-6">Sorry, je hebt geen toestemming voor deze medaille!</p>
        <router-link to="/" class="text-base transition duration-300 ease-in-out"><StyledButton>Terug naar de overwinning</StyledButton></router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  .animate-pulse {
    animation: pulse 1s infinite;
  }
  </style>