<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { openDates } from '@/composables/useVacation.ts'
import { ChevronDown } from 'lucide-vue-next'

export default defineComponent({
  name: 'ExpandPendingRequests',
  components: { ChevronDown },
  props: {
    data: {
      type: Array as PropType<openDates[]>,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      isOpen: false,
      setHeight: false,
      // height: '76px',
    }
  },
  computed: {
    height: function () {
      console.log(this.data.length)
      let length = this.data.length
      if (length > 5) length = 5
      return length * 26 + 26 + 'px'
    },
    containerHeight: function () {
      return this.data.length * 26 + 26 + 12 + 'px'
    },
  },
})
</script>

<template>
  <button
    :class="{
      rounded: !isOpen,
      'rounded-t': isOpen,
    }"
    class="b-2 b-primary-light hover:border-primary flex w-full items-center justify-between bg-white px-4 py-1.5 outline-none transition-colors focus-visible:border-black"
    @click="isOpen = !isOpen"
  >
    <div>
      {{ title }}
    </div>
    <ChevronDown
      :class="{
        'rotate-180': isOpen,
      }"
      class="transition-transform"
    />
  </button>
  <div class="mt0.5">
    <Transition
      @afterEnter="setHeight = true"
      @before-leave="setHeight = false"
    >
      <div
        v-show="isOpen"
        :class="{
          height: setHeight,
        }"
        class="b-primary-light overflow-scroll rounded-b border-2"
      >
        <div class="py0.5 px2 grid grid-cols-3">
          <div>from</div>
          <div>to</div>
          <div>duration</div>
        </div>

        <div v-for="opendate of data" class="py0.5 px2 grid grid-cols-3">
          <div>
            {{ opendate.startDate }}
          </div>
          <div>
            {{ opendate.endDate }}
          </div>
          <div>
            {{ opendate.dayCount }} day{{ opendate.dayCount > 1 ? 's' : '' }}
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition:
    opacity 0.2s ease-in-out,
    height 0.2s ease-in-out;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  height: 0;
}

.v-enter-to,
.v-leave-from {
  height: v-bind(height);
}

.height {
  height: v-bind(containerHeight);
}
</style>
