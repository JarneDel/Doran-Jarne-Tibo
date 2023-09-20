<script setup lang="ts">
 const email = ref('');
</script>

<template>
<form>
  <h1>Login</h1>
    <label for="email">Email</label>
    <input type="email" id="email" name="email" v-model="email">
    <label for="password">Password</label>
    <input type="password" id="password" name="password" v-model="password">

</form>
</template>

<style scoped>

</style>
