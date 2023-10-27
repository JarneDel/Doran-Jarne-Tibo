<script lang="ts">
import { defineComponent, ref } from 'vue'
import StyledInputText from '@/components/generic/StyledInputText.vue'
import StyledButton from '@/components/generic/StyledButton.vue'
export default defineComponent({
  setup() {
    const date = new Date().toLocaleTimeString().substr(0, 5)
    console.log(date)
    const reservation = ref({
      date: new Date().toISOString().substr(0, 10),
      beginTime: new Date().toLocaleTimeString().substr(0, 5),
      endTime: new Date().toLocaleTimeString().substr(0, 5),
    })
    console.log(reservation.value.date)
    return { reservation }
  },
  components: { StyledInputText, StyledButton },
})
</script>

<template>
  <div>
    <h1 class="m-4 text-xl font-bold">{{$t('reservation.title')}}</h1>
    <p class="ml-4 text-lg">
      {{$t('reservation.subtitle')}}
    </p>
    <div class="m-4 flex gap-2 items-end">
      <styled-input-text
        v-model="reservation.date"
        :label="$t('reservation.date')"
        class="w-fit"
        required
        type="date"
      />
      <styled-input-text
        v-model="reservation.beginTime"
        :label="$t('reservation.begin')"
        class="w-fit"
        required
        type="time"
      />
      <styled-input-text
        v-model="reservation.endTime"
        :label="$t('reservation.end')"
        class="w-fit"
        required
        type="time"
      />
      <StyledButton type="button" class="h-fit">
        {{$t('reservation.check')}}
        </StyledButton>
    </div>
  </div>
</template>
