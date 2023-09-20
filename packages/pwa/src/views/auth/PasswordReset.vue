<script lang="ts">
import {LucideArrowLeft} from "lucide-vue-next";
import {useRouter} from 'vue-router'
import {defineComponent, ref} from "vue";
import useFirebase from "@/composables/useFirebase.ts";

export default defineComponent({
  components: {
    LucideArrowLeft
  },
  setup() {
    const {go} = useRouter()
    const {passwordReset} = useFirebase()

    const email = ref('')

    const reset = () => {
      console.log('reset')
      if (!email.value) {
        // todo: show error
        return
      }
      passwordReset(email.value)
    }


    return {
      email,
      reset,
      go
    }
  }
})

</script>

<template>
  <h2 class="font-title mb-4 text-lg">
    <a @click="go(-1)">
      <lucide-arrow-left class="hover:text-primary-500 inline"/>
    </a>
    Reset your password
  </h2>
  <form @submit.prevent="reset">
    <label for="email"></label>
    <input type="email" placeholder="Email" required id="email" name="email" v-model="email"/>
  </form>
</template>

<style scoped>

</style>
