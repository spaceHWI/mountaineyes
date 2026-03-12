import type { MountainId } from '../data/feeds'
import { mountains } from '../data/feeds'
import type { Language } from '../i18n'

export const LANGUAGE_STORAGE_KEY = 'mountaineyes-language'

export const getInitialMountainId = (): MountainId => {
  if (typeof window === 'undefined') {
    return 'hallasan'
  }

  const mountainId = new URLSearchParams(window.location.search).get('mountain')
  const isValidMountain = mountains.some((mountain) => mountain.id === mountainId)

  return isValidMountain ? (mountainId as MountainId) : 'hallasan'
}

export const getInitialLanguage = (): Language => {
  if (typeof window === 'undefined') {
    return 'ko'
  }

  const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY)
  if (storedLanguage === 'ko' || storedLanguage === 'en') {
    return storedLanguage
  }

  return window.navigator.language.toLowerCase().startsWith('ko') ? 'ko' : 'en'
}
