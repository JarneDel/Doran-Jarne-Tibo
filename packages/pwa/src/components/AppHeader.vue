<script lang="ts">
import { defineComponent } from 'vue'
import StyledButton from '@/components/generic/StyledButton.vue'

export default defineComponent({
  setup() {
    return {}
  },
  components: {StyledButton},
})
</script>

<template>
  <div
    class="flex items-center justify-between bg-white fill-slate-700 p-2 shadow-md"
  >
    <router-link to="/" class="flex items-center justify-center gap-2">
      <svg
        class="m-1"
        width="40"
        height="40"
        viewBox="0 0 43 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M21.2778 24.1856C25.3623 24.2859 29.2826 25.5052 32.6694 27.6385C26.5333 34.3164 17.8248 38.9468 8.95329 39.9472C7.08529 38.5728 5.44114 36.8933 4.0885 34.9789C10.6256 33.9224 16.5936 30.3584 20.7232 24.9167L21.2778 24.1856Z"
          fill="#F5CB5C"
        />
        <path
          d="M39.1697 33.8038C35.3996 39.934 28.779 44 21.2415 44C18.5179 44 15.9139 43.4692 13.5209 42.5016C21.8114 40.5852 29.6157 35.8892 35.2932 29.566C36.7384 30.7956 38.0435 32.2152 39.1697 33.8038Z"
          fill="#F5CB5C"
        />
        <path
          d="M41.6845 20.5879L41.6887 20.5923L42.4755 21.4121C42.4804 21.6074 42.4829 21.8034 42.4829 21.9999C42.4829 25.0529 41.8825 27.9606 40.7974 30.6033C36.0345 24.6588 28.968 21.0917 21.4139 20.8882C19.6534 17.7105 18.7566 14.1565 18.752 10.5845C27.3643 10.7578 35.5852 14.339 41.6845 20.5879Z"
          fill="#F0B719"
        />
        <path
          d="M19.0021 7.28939C19.2527 5.66547 19.6918 4.06091 20.3222 2.51013L21.3427 0C31.0791 0.0471243 39.2677 6.87875 41.7277 16.165C35.3788 10.6456 27.361 7.50182 19.0021 7.28939Z"
          fill="#F0B719"
        />
        <path
          d="M18.218 22.8776C16.2467 25.4753 13.7961 27.5876 11.0453 29.1236C7.69367 20.7546 7.46671 11.5776 10.3644 3.09916C12.5989 1.71676 15.0991 0.747387 17.7669 0.292755L17.386 1.22961C14.5846 8.12031 15.0431 15.9272 18.5793 22.4015L18.218 22.8776Z"
          fill="#FAE7B2"
        />
        <path
          d="M6.07209 6.59977C2.31602 10.568 0 16.0039 0 21.9999C0 25.5582 0.815631 28.9192 2.26383 31.8934C4.28989 31.6888 6.2649 31.2123 8.14201 30.4871C5.0512 22.8267 4.36527 14.5298 6.08422 6.58694L6.07209 6.59977Z"
          fill="#FAE7B2"
        />
      </svg>

      <h1 class="text-primary-text text-xl font-bold">
        {{ $t('navigation.title') }}
      </h1>
    </router-link>
    <div class="flex justify-center gap-8">
      <div class="flex gap-4 justify-center">
        <div class="hover:font-bold">
          <router-link to="/">{{ $t('navigation.home') }}</router-link>
        </div>
        <div class="hover:font-bold">
          <router-link to="/repair">{{ $t('navigation.repair') }}</router-link>
        </div>
        <div class="hover:font-bold">
          <router-link to="/admin">{{ $t('navigation.admin') }}</router-link>
        </div>
        <div class="hover:font-bold">
          <router-link to="/reservation">{{
            $t('navigation.reservation')
          }}</router-link>
        </div>
      </div>
      <StyledButton><p>Profile</p></StyledButton>
    </div>
  </div>
</template>

<style scoped></style>
