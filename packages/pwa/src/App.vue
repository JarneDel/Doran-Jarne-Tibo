<script lang="ts">
import { defineComponent, provide } from 'vue'

import { DefaultApolloClient } from '@vue/apollo-composable'

import Layout from '@/layout/Layout.vue'
import useGraphql from './composables/useGraphql'
import useLanguage from '@/composables/useLanguage.ts'
import { SUPPORTED_LOCALES } from '@/bootstrap/i18n.ts'

export default defineComponent({
  components: { Layout },
  setup() {
    const { apolloClient } = useGraphql()
    provide(DefaultApolloClient, apolloClient)
    const { setLocale } = useLanguage()
    const { locale } = useLanguage()
    setLocale(Object.keys(SUPPORTED_LOCALES)[1])
    console.log(locale)
    return {}
  },
})
</script>

<template>
  <Layout>
    <RouterView />
  </Layout>
</template>

<style scoped></style>
