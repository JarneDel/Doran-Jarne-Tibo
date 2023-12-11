<script lang="ts">
import { defineComponent } from 'vue'
import { Trophy } from 'lucide-vue-next'
import StyledButton from '@/components/generic/StyledButton.vue'

export default defineComponent({
  components: { Trophy, StyledButton },
  setup() {
    return {
      Trophy,
    }
  },
})
</script>

<template>
  <div class="flex h-screen items-center justify-center bg-gray-100">
    <div class="rounded-md bg-white p-8 shadow-md">
      <div class="text-center">
        <div class="mx-auto mb-4 w-16 animate-bounce text-yellow-500">
          <Trophy class="h-16 w-16" />
        </div>

        <h1 class="mb-2 text-4xl font-bold text-gray-800">
          {{ $t('404.title') }}
        </h1>
        <p class="mb-6 text-lg text-gray-600">
          {{ $t('404.subtitle') }}
        </p>
        <router-link
          to="/"
          class="text-base transition duration-300 ease-in-out"
          ><StyledButton>{{ $t('403.404.button') }}</StyledButton></router-link
        >
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-20px);
  }
  60% {
    transform: translateY(-10px);
  }
}

.animate-bounce {
  animation: bounce 1.5s infinite;
}
</style>
