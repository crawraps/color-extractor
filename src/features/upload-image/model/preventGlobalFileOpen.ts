import { onMounted, onUnmounted } from 'vue'

export default function() {
  const handler = (ev: Event) => {
    ev.preventDefault()
  }

  onMounted(() => {
    document.body.addEventListener('drop', handler)
  })

  onUnmounted(() => {
    document.body.removeEventListener('drop', handler)
  })
}
