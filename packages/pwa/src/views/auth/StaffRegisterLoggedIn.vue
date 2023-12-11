<script lang="ts">
import { defineComponent } from 'vue'
import useFirebase from '@/composables/useFirebase.ts'
import StyledLink from '@/components/generic/StyledLink.vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'StaffRegisterLoggedIn',
  components: { StyledLink },
  setup() {
    const { firebaseUser } = useFirebase()
    const { replace, currentRoute } = useRouter()
    if (!firebaseUser.value) {
      replace('/staff-register/' + currentRoute.value.query.id)
    }
    return { firebaseUser }
  },
})
</script>

<template>
  <div>You are already logged in as {{ firebaseUser?.email }}.</div>
  <styled-link :to="`/logout?redirect=/staff-register/${$route.query.id}`"
    >Logout
  </styled-link>
</template>

<style scoped></style>
