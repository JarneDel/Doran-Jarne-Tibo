<script lang="ts">
import { ref } from 'vue'
import { type AuthError } from 'firebase/auth'

import useFirebase from '@/composables/useFirebase'
const { logout } = useFirebase()

export default{
    setup(){
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
<button @click="handleLogout" >logout</button>
</template>

<style scoped>

</style>
