import { createMemoryHistory, createRouter } from 'vue-router'
import GenerationPage from '@/pages/generation'
import type { Route } from './types'

const routes: Route[] = [
  { path: '/', component: GenerationPage, meta: { title: 'Extract colors' } },
]

export default createRouter({
  history: createMemoryHistory(),
  routes,
})

export * from './types'
