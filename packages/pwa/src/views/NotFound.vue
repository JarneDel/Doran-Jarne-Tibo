<script lang="ts">
import { defineComponent } from 'vue'
import {Trophy} from 'lucide-vue-next'
import StyledButton from '@/components/generic/StyledButton.vue';

export default defineComponent(
  {
    components: { Trophy, StyledButton },
    setup() {
      return {
        Trophy
      }
    }
  }
)
</script>

<template>
  <div class="flex items-center justify-center h-screen bg-gray-100">
    <div class="p-8 bg-white shadow-md rounded-md">
      <div class="text-center">
        <div class="w-16 mx-auto mb-4 animate-bounce text-yellow-500"><Trophy class="w-16 h-16"/></div>
        
        <h1 class="text-4xl font-bold text-gray-800 mb-2">404 - Pagina niet gevonden</h1>
        <p class="text-lg text-gray-600 mb-6">Oeps, lijkt erop dat de beker buiten bereik is!</p>
        <router-link to="/" class="text-base transition duration-300 ease-in-out"><StyledButton>Terug naar de overwinning</StyledButton></router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
    40% { transform: translateY(-20px); }
    60% { transform: translateY(-10px); }
  }

  .animate-bounce {
    animation: bounce 1.5s infinite;
  }
</style>