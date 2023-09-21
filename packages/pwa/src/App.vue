<script  lang="ts">

  import { defineComponent } from 'vue'

  import Layout from '@/layout/Layout.vue';
  export default defineComponent({ components: { Layout } })
</script>

<template>
  <Layout>
    <RouterView/>
  </Layout>
</template>

<style scoped>
</style>

