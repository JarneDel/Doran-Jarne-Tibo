<script lang="ts">
import { defineComponent } from 'vue'
import { Medal } from 'lucide-vue-next'
import StyledButton from '@/components/generic/StyledButton.vue'

export default defineComponent({
  components: { Medal, StyledButton },
  setup() {
    return {
      Medal,
    }
  },
})
</script>

<template>
  <div class="flex h-screen items-center justify-center bg-gray-100">
    <div class="rounded-md bg-white p-8 shadow-md">
      <div class="text-center">
        <div class="mx-auto mb-4 w-16 animate-bounce text-yellow-500">
          <Medal class="h-16 w-16" />
        </div>
        <h1 class="mb-2 text-4xl font-bold text-gray-800">
          {{$t('403.title')}}
        </h1>
        <p class="mb-6 text-lg text-gray-600">
          {{$t('403.subtitle')}}
        </p>
        <StyledButton
          class="text-base transition duration-300 ease-in-out"
          @click="$router.back()"
          >
          {{$t('403.button')}}
        </StyledButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 1s infinite;
}
</style>
