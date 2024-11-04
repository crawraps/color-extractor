import { onUnmounted } from 'vue'

type HandleEvent = (event: { clientX: number; clientY: number }, exp?: boolean) => void

export function handleEvent(handle: HandleEvent, event?: 'mouse' | 'drag') {
  const dragHandler = (event: DragEvent) => {
    event.preventDefault()

    if (event.dataTransfer?.types.includes('Files')) {
      handle(event)
    }
  }

  const reset = () => {
    handle({ clientX: 0, clientY: 0 })
  }

  switch (event) {
    case 'mouse':
      window.addEventListener('mousemove', handle)
      break
    case 'drag':
      window.addEventListener('dragover', dragHandler)
      window.addEventListener('dragend', reset)
      window.addEventListener('drop', reset)
      break
    default:
      return
  }

  onUnmounted(() => {
    window.removeEventListener('mousemove', handle)
    window.removeEventListener('dragover', dragHandler)
    window.removeEventListener('dragend', reset)
    window.removeEventListener('drop', reset)
  })
}
