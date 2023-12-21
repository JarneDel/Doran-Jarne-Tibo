import { createI18n, type I18nOptions } from 'vue-i18n'

export const DEFAULT_LOCALE = 'nl'

export const SUPPORTED_LOCALES: Record<string, string> = {
  en: 'English',
  nl: 'Nederlands',
  zh: '中文',
  es: 'Español',
  fr: 'Francais',
  de: 'Duitsch',
}

export const i18nOptions: I18nOptions = {
  locale: DEFAULT_LOCALE,
  fallbackLocale: DEFAULT_LOCALE,
  legacy: false,
}

export const i18n = createI18n(i18nOptions)
