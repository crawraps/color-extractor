import { HSLPixel, hslToRgb, RGBPixel, RGBPixelString, rgbToHsl } from '@/shared/utils'
import { Action } from './types'

async function extractPixels(file: File, includeRange = [1, 254]): Promise<RGBPixel[]> {
  const bitmap = await createImageBitmap(file)
  const { width, height } = bitmap

  const canvas = new OffscreenCanvas(width, height)
  const ctx = canvas.getContext('2d')

  if (!ctx) throw new Error('Could not get canvas context')

  ctx.drawImage(bitmap, 0, 0)
  bitmap.close()

  const imageData = ctx.getImageData(0, 0, width, height)
  const pixels = new Set<RGBPixelString>()

  for (let i = 0; i < imageData.data.length; i += 4) {
    const r = imageData.data[i]
    const g = imageData.data[i + 1]
    const b = imageData.data[i + 2]

    const rgb = [r, g, b]

    if (rgb.every(val => val < includeRange[0] && val > includeRange[1])) {
      continue
    }

    pixels.add(rgb.join(',') as RGBPixelString)
  }

  return Array.from(pixels).map(pixel => pixel.split(',').map(Number) as RGBPixel)
}

function sortPixels(pixels: HSLPixel[], ind = 0): HSLPixel[] {
  return [...pixels].sort((a, b) => a[ind] - b[ind])
}

function blendLightness(pixels: HSLPixel[]): HSLPixel[] {
  return pixels.reduce((acc, currentPixel) => {
    if (acc.length === 0) {
      return [currentPixel]
    }

    if (Math.abs(acc.at(-1)![2] - currentPixel[2]) < 0.02) {
      return [...acc]
    } else {
      return [...acc, currentPixel]
    }
  }, [] as HSLPixel[])
}

function groupByHue(pixels: HSLPixel[]): HSLPixel[][] {
  return Object.values(
    Object.groupBy(pixels, ([h]) => {
      return Math.round(h * 90)
    }),
  )
}

const cachedPixels: RGBPixel[] = []

const handleMessage = async (ev: MessageEvent<Action>) => {
  if (!ev.data.payload && !cachedPixels.length) throw new Error('No image to process')
  if (!ev.data.payload?.type.includes('image')) throw new Error('Invalid file type')

  let pixels: RGBPixel[]

  if (ev.data.payload) {
    pixels = await extractPixels(ev.data.payload)
  } else {
    pixels = cachedPixels
  }

  switch (ev.data.type) {
    case 'raw-colors': {
      postMessage(pixels)
      break
    }
    case 'sorted-colors': {
      const hslPixels = pixels.map(rgbToHsl)
      const sorted = sortPixels(hslPixels)
      postMessage(sorted.map(hslToRgb))
      break
    }
    case 'grouped': {
      const hslPixels = pixels.map(rgbToHsl)
      const sortedPixels = sortPixels(sortPixels(hslPixels), 2)
      const blended = blendLightness(sortedPixels)
      const grouped = groupByHue(blended)

      postMessage(grouped.map(it => it.map(hslToRgb)))
      break
    }
    default: {
      throw new Error('Unknown action')
    }
  }
}

onmessage = (ev: MessageEvent<Action>) => {
  handleMessage(ev).catch(postMessage)
}
