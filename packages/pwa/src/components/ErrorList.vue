<script lang="ts">
import { defineComponent, PropType, watch } from 'vue'
import Error from '@/components/Error.vue'

export default defineComponent({
  name: 'ErrorList',
  components: { Error },
  props: {
    errorMessages: {
      type: Array as PropType<string[]>,
      required: true,
    },
  },
  setup(props) {
    watch(
      () => props.errorMessages,
      () => {
        // Remove empty strings
        const notEmpty = props.errorMessages.filter(err => !!err)
        if (notEmpty.length == 0) {
          props.errorMessages.length = 0
        }
      },
      {
        deep: true,
      },
    )

    return {}
  },
})
</script>

<template>
  <Error
    v-for="(err, index) of errorMessages"
    :key="index"
    :is-shown="!!err"
    :msg="err"
    @update:is-shown="errorMessages[index] = ''"
  />
</template>

<style scoped></style>
