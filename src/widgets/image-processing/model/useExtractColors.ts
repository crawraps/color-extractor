import { extractGroupedColors } from '@/features/extract-colors'
import { HEXColor, rgbToHex } from '@/shared/utils'
import { ref } from 'vue'

type State = 'idle' | 'loading' | 'error'
type Props = {
  minLoadingTime?: number
  onUploadStart?: () => void
  onUploadSuccess?: (layers: HEXColor[][]) => void
  onUploadError?: () => void
  onUploadEnd?: (layers: HEXColor[][]) => void
}

const useExtractColors = (props?: Props) => {
  const state = ref<State>('idle')
  const layers = ref<HEXColor[][]>([['#434343'], ['#555555'], ['#6d6d6d'], ['#8c8c8c'], ['#b0b0b0']])
  const error = ref<string | null>(null)

  let timestamp: number

  const handleUpload = async (file?: File) => {
    try {
      state.value = 'loading'
      timestamp = performance.now()

      props?.onUploadStart?.()

      const pixels = await extractGroupedColors(file)
      const hexPixels = pixels.map(t => t.map(rgbToHex))

      const stale = performance.now() - timestamp
      if (props?.minLoadingTime && stale < props.minLoadingTime) {
        await new Promise(resolve => setTimeout(resolve, props.minLoadingTime! - stale))
      }

      layers.value = hexPixels
      props?.onUploadSuccess?.(layers.value)
      state.value = 'idle'
    } catch (err) {
      if (err instanceof Error) error.value = err.message

      state.value = 'error'
      props?.onUploadError?.()
    } finally {
      props?.onUploadEnd?.(layers.value)
    }
  }

  return {
    layers,
    state,
    handleUpload,
    error,
  }
}

export default useExtractColors
