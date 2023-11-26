<script lang="ts">
import { defineComponent, provide } from 'vue'

import { DefaultApolloClient } from '@vue/apollo-composable'

import Layout from '@/layout/Layout.vue'
import useGraphql from './composables/useGraphql'
import useLanguage from '@/composables/useLanguage.ts'
import useCustomUser from '@/composables/useUser.ts'
import { useStorage } from '@vueuse/core'

export default defineComponent({
  components: { Layout },
  setup() {
    const locale = useStorage('locale', 'en')
    const { apolloClient } = useGraphql()
    provide(DefaultApolloClient, apolloClient)
    const { setLocale } = useLanguage()
    const { customUser } = useCustomUser()
    if (customUser.value) {
      if (customUser.value) setLocale(customUser.value?.userByUid.locale)
    } else setLocale(locale.value)
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
