import { RGBPixel } from "@/shared/utils"
import { Action } from "../lib/types"

const imageProcessor = new Worker(new URL('../lib/image-processor.ts', import.meta.url), {
  type: 'module',
})

function handleWorkerMessage(action: Action): Promise<any> {
  return new Promise((resolve, reject) => {
    imageProcessor.onmessage = ({ data }) => {
      if (data instanceof Error) {
        reject(data)
      }

      resolve(data)
    }

    imageProcessor.onerror = reject

    imageProcessor.postMessage(action)
  })
}

export async function extractColors(file?: File): Promise<RGBPixel[]> {
  return await handleWorkerMessage({ type: 'raw-colors', payload: file })
}

export async function extractSortedColors(file?: File): Promise<RGBPixel[]> {
  return await handleWorkerMessage({ type: 'sorted-colors', payload: file })
}

export async function extractGroupedColors(file?: File): Promise<RGBPixel[][]> {
  return await handleWorkerMessage({ type: 'grouped', payload: file })
}
