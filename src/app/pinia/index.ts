import { createPinia } from 'pinia'
import themeSideEffects from './plugins/theme'

export default createPinia().use(themeSideEffects)
