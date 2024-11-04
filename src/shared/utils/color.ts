export type RGBPixel = [number, number, number]
export type RGBPixelString = `${number},${number},${number}`

export type HSLPixel = [number, number, number]

export type HEXColor = `#${string}`

export function rgbToHsl([r, g, b]: RGBPixel): HSLPixel {
  r /= 255
  g /= 255
  b /= 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)

  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }

    h /= 6
  }

  return [h, s, l]
}

export function hslToRgb([h, s, l]: HSLPixel): RGBPixel {
  h *= 6

  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs((h % 2) - 1))
  let rgb

  if (isNaN(h)) rgb = [0, 0, 0]
  else if (h <= 1) rgb = [c, x, 0]
  else if (h <= 2) rgb = [x, c, 0]
  else if (h <= 3) rgb = [0, c, x]
  else if (h <= 4) rgb = [0, x, c]
  else if (h <= 5) rgb = [x, 0, c]
  else if (h <= 6) rgb = [c, 0, x]
  const m = l - c * 0.5

  return rgb?.map(val => Math.round(255 * (val + m))) as RGBPixel

}

export function rgbToHex(pixel: RGBPixel): HEXColor {
  return `#${pixel.map(c => c.toString(16).padStart(2, '0')).join('')}`
}

export function hexToRgb(hex: HEXColor): RGBPixel {
  const [r, g, b] = hex
    .slice(1)
    .match(/.{2}/g)!
    .map(c => parseInt(c, 16))
  return [r, g, b]
}
