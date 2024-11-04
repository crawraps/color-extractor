import { defineStore } from 'pinia'
import type { CurrentTheme, PreferencesState } from './types'

export const usePreferencesStore = defineStore('preferences', {
  state: () => ({
    theme: 'light',
  }) as PreferencesState,
  getters: {
    currentTheme(state): CurrentTheme {
      if (state.theme === 'system') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      }
      return state.theme
    },
  },
})

export type PreferencesStore = ReturnType<typeof usePreferencesStore>
export * from './types'
