import { watch } from 'vue'
import { useRoute } from 'vue-router'

export default function useAutoSyncTitle() {
  const route = useRoute()

  watch(
    () => route.meta.title as string,
    title => {
      document.title = title
    },
  )
}
