<script lang="ts">

  import {  provide } from 'vue'

  import { DefaultApolloClient } from '@vue/apollo-composable'

  import Layout from '@/layout/Layout.vue';
  import useGraphql from './composables/useGraphql';
  export default{
     components: { Layout },
  setup() {
    const { apolloClient } = useGraphql();
    provide(DefaultApolloClient, apolloClient);
    return {};
  },}
</script>

<template>
  <Layout>
    <RouterView />
  </Layout>
</template>

<style scoped></style>
