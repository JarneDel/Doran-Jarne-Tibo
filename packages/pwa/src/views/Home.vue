<script lang="ts">
import { ref } from 'vue'
import { type AuthError } from 'firebase/auth'

import useFirebase from '@/composables/useFirebase'

export default{
    setup(){
      const { logout } = useFirebase()

      const error = ref<AuthError | null>(null)
        const handleLogout = () => {
            logout()
            .then(() => {
                console.log('logged out')
            })
            .catch((err: AuthError) => {
                error.value = err
            })
        }
        return {
            error,
            handleLogout
        }
    }
}
</script>

<template>
    <div>
        <div>
            Locatie
        </div>
        <div>
            Openings uren
        </div>
        <div>
            Sluitings dagen
        </div>
    </div>
<button @click="handleLogout" >logout</button>
</template>
<style scoped>

</style>
