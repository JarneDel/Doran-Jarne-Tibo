import { useI18n } from 'vue-i18n'

export default () => {
  const { locale, setLocaleMessage } = useI18n()

  const loadMessages = async (locale: string) => {
    return await import(`../locales/${locale}.json`).then(m => {
      console.log(m.default[locale])
      return m.default[locale]
    })
  }

  const setLocale = async (targetLocale: string) => {
    const messages = await loadMessages(targetLocale)
    setLocaleMessage(targetLocale, messages)
    locale.value = targetLocale
  }

  return {
    locale,
    setLocale,
    loadMessages,
  }
}
