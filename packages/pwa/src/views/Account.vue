<script lang="ts">
import { useQuery } from '@vue/apollo-composable'
import { ALL_GROUPS } from '@/graphql/group.query'
import { ALL_STOCK_AND_SERVICES } from '@/graphql/stock.query.ts'
import { defineComponent, ref } from 'vue'
import UseFirebase from '@/composables/useFirebase'
import { SUPPORTED_LOCALES } from '@/bootstrap/i18n.ts'
import UseLanguage from '@/composables/useLanguage.ts'
import ChangeLanguage from '@/components/ChangeLanguage.vue'
import ClipboardCopy from '@/components/generic/ClipboardCopy.vue'

interface Group {
  groups: [{ _id: string; name: string }]
}
interface Stock {
  stock: [{ _id: string; name: string }]
}

export default defineComponent({
  components: { ClipboardCopy, ChangeLanguage },
  computed: {
    SUPPORTED_LOCALES() {
      return SUPPORTED_LOCALES
    },
  },
  setup() {
    const { firebaseUser } = UseFirebase()
    const idToken = ref()
    const { setLocale: setLanguage } = UseLanguage()

    const getIdToken = async () => {
      idToken.value = `{
      "Authorization": "Bearer `+await firebaseUser.value?.getIdToken()+`"
    }`
    }
    const setLocale = (event: Event) => {
      const target = event.target as HTMLSelectElement
      console.log(target.value)
      setLanguage(target.value)
    }

    getIdToken()
    const { loading, result, error } = useQuery<Group>(ALL_GROUPS)
    const {
      loading: loadingStock,
      result: resultStock,
      error: errorStock,
    } = useQuery<Stock>(ALL_STOCK_AND_SERVICES)
    return {
      idToken,
      result,
      loading,
      error,
      resultStock,
      loadingStock,
      errorStock,
      setLocale,
      firebaseUser,
    }
  },
})
</script>

<template>
  <h2>
    {{
      $t('account.welcome', {
        user: firebaseUser?.email,
      })
    }}
  </h2>
  <div>
    <div class="flex w-max flex-row items-center justify-center gap-2">
      Copy Auth token
      <clipboard-copy v-if="idToken" :text="idToken"></clipboard-copy>
    </div>

    <div>
      <ul>
        <li v-for="group in result?.groups" :key="group._id">
          {{ group.name }}
        </li>
      </ul>
    </div>
    <div>
      <ul>
        <li v-for="stock in resultStock?.stock" :key="stock._id">
          {{ stock.name }}
        </li>
      </ul>
    </div>
    <div>loading</div>
    <ChangeLanguage />
    <label for="language"> </label>
  </div>
</template>

<style scoped></style>
