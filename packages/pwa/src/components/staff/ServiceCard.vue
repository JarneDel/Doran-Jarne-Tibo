<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Service } from '@/graphql/staff.query.ts'

export default defineComponent({
  name: 'ServiceCard',
  props: {
    data: {
      type: Object as PropType<Service>,
      required: true,
    },
  },
})
</script>

<template>
  <div class="b-1 p2 border-black">
    <h3>
      {{ data.name }}
    </h3>
    <!--    todo: collegues that are working-->
    <div></div>
  </div>
</template>

<style scoped></style>
