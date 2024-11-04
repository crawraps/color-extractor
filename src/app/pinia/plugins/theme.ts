import { PreferencesStore, Theme } from '@/shared/store'
import { PiniaPlugin, Store } from 'pinia'

function isPreferencesStore(store: Store): store is PreferencesStore {
  return store.$id === 'preferences'
}

const themeSideEffects: PiniaPlugin = ({ store }) => {
  if (isPreferencesStore(store)) {
    const theme = localStorage.getItem('theme') as Theme | null

    if (theme && store.theme !== theme) {
      store.theme = theme
    }

    document.body.setAttribute('theme', store.currentTheme)
    store.$subscribe(() => {
      document.body.setAttribute('theme', store.currentTheme)
      localStorage.setItem('theme', store.theme)
    })
  }
}

export default themeSideEffects
