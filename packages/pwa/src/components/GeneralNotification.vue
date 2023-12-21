<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Bell } from 'lucide-vue-next'

export interface Message {
  msg: string
  shown: boolean
  id: number
  url: string
}

export default defineComponent({
  name: 'GeneralNotification',
  components: { Bell },
  props: {
    messages: {
      type: Array as PropType<Message[]>,
      required: true,
    },
  },
})
</script>

<template>
  <template>
    <template v-for="message of messages">
      <teleport to="#error">
        <transition appear name="slide">
          <div v-show="message.shown">
            <RouterLink
              :to="message.url"
              class="moving-line bg-primary relative mb-4 flex flex-row gap-2 rounded border-0 px-6 py-4 text-white"
            >
              <Bell class="animate-bell"></Bell>
              <span class="mr-8 inline-block align-middle">{{
                message.msg
              }}</span>
              <button
                class="absolute right-0 top-0 mr-6 mt-4 bg-transparent text-2xl font-semibold leading-none outline-none focus:outline-none"
                @click="message.shown = false"
              >
                <span>×</span>
              </button>
            </RouterLink>
          </div>
        </transition>
      </teleport>
    </template>
  </template>
</template>

<style scoped></style>
