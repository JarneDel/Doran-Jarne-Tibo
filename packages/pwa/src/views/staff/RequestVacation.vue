<script lang="ts">
import { defineComponent } from 'vue'
import { useMutation } from '@vue/apollo-composable'
import {
  CREATE_VACATION_REQUEST,
  CreateVacationRequest,
  CreateVacationRequestInput,
} from '@/graphql/vacation.request.query.ts'
import StyledButton from '@/components/generic/StyledButton.vue'
// import { useMutation } from '@vue/apollo-composable'

export default defineComponent({
  name: 'RequestVacation',
  components: { StyledButton },
  data() {
    return {
      startDate: '',
      endDate: '',
      errorMessages: [] as string[],
    }
  },
  methods: {
    submit() {
      console.log('submitting')
      this.createRequest(this.startDate, this.endDate)
    },
    createRequest(startDate: string, endDate: string) {
      const startDateAsDate = new Date(startDate)
      const endDateAsDate = new Date(endDate)
      this.mutate({
        input: {
          startDate: startDateAsDate,
          endDate: endDateAsDate,
        },
      })
    },
  },
  computed: {
    disabled() {
      return !this.startDate || !this.endDate
    },
  },
  watch: {
    error() {
      if (!this.error) return ''
      this.errorMessages = []
      const error = this.error
      if (error.message === 'Bad Request Exception') {
        try {
          const original = error.graphQLErrors[0].extensions
            .originalError as any
          if (!original || !original.message) return console.log('no message')
          const originalError = original.message as string[]
          originalError.forEach((message: string) => {
            this.errorMessages.push(message)
          })
        } catch (e) {
          this.errorMessages.push('Unknown error')
        }
      } else {
        this.errorMessages.push(this.error.message || 'Unknown error')
      }
    },
  },

  setup() {
    const { mutate, error } = useMutation<
      CreateVacationRequest,
      CreateVacationRequestInput
    >(CREATE_VACATION_REQUEST)

    return { error, mutate }
  },
})
</script>

<template>
  <div>
    <h2>Request Vacation</h2>
    <div class="test-danger" v-for="error of errorMessages">
      {{ error }}
    </div>

    <form @submit.prevent="submit">
      <label for="startDate">Start Date</label>
      <input
        id="startDate"
        v-model="startDate"
        class="form-control"
        type="date"
      />

      <label for="endDate">End Date</label>
      <input id="endDate" v-model="endDate" class="form-control" type="date" />

      <styled-button type="submit" :disabled="disabled"
        >Request Vacation
      </styled-button>
    </form>
  </div>
</template>

<style scoped></style>
