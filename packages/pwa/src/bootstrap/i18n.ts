import { createI18n, type I18nOptions } from 'vue-i18n'

export const DEFAULT_LOCALE = 'en'

export const SUPPORTED_LOCALES: Record<string, string> = {
  en: 'English',
  nl: 'Nederlands',
  zh: 'Chinese',
  es: 'Spaans',
}

export const i18nOptions: I18nOptions = {
  locale: DEFAULT_LOCALE,
  fallbackLocale: DEFAULT_LOCALE,
  legacy: false,
}

export const i18n = createI18n(i18nOptions)
