<script lang="ts">
import { defineComponent } from 'vue'
import { SUPPORTED_LOCALES } from 'pwa/src/bootstrap/i18n.ts'
import UseLanguage from '@/composables/useLanguage.ts'

export default defineComponent({
  name: 'ChangeLanguage',
  computed: {
    SUPPORTED_LOCALES() {
      return SUPPORTED_LOCALES
    },
  },
  setup() {
    const { setLocale: setLanguage, locale } = UseLanguage()

    const setLocale = (event: Event) => {
      const target = event.target as HTMLSelectElement
      console.log(target.value)
      setLanguage(target.value)
    }

    return {
      setLocale,
      locale,
    }
  },
})
</script>

<template>
  <select id="language" :value="locale" name="language" @change="setLocale">
    <option
      v-for="locale in Object.keys(SUPPORTED_LOCALES)"
      :key="locale"
      :value="locale"
    >
      {{ SUPPORTED_LOCALES[locale] }}
    </option>
  </select>
</template>

<style scoped></style>
