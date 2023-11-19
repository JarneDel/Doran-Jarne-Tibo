import { useI18n } from 'vue-i18n'
import { useStorage } from '@vueuse/core'

export default () => {
  const { locale, setLocaleMessage } = useI18n()
  const storageLocale = useStorage('locale', 'en')

  const loadMessages = async (locale: string) => {
    return await import(`../locales/${locale}.json`).then(m => {
      return m.default[locale]
    })
  }

  const setLocale = async (targetLocale: string) => {
    const messages = await loadMessages(targetLocale)
    setLocaleMessage(targetLocale, messages)
    storageLocale.value = targetLocale
    locale.value = targetLocale
  }

  return {
    locale,
    setLocale,
    loadMessages,
  }
}
