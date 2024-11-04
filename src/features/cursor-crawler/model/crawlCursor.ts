import { Ref } from 'vue'
import anime from 'animejs'
import { ANIMATION_STEP_DIVISOR, ANIMATION_STOP_THRESHOLD } from './constants'
import { Vector, stretchingFunc, getLength, sum, negative, multiply } from './utils'

interface Props {
  boundingRadius?: number
  stretchStrength?: number
  animationThreshold?: number
  animationTimeout?: number
}

export type Crawler = {
  updateCoords: (event: { clientX: number; clientY: number }) => void
  updatePosition: (pos: Vector) => void
}

export function useCrawlCursor(
  target: Ref<HTMLElement | null>,
  { boundingRadius = 300, stretchStrength = 0.5, animationThreshold = 150, animationTimeout = 2000 }: Props,
): Crawler {
  let targetPosition: Vector = [0, 0]
  let isAnimating = false

  function updateCoords(event: { clientX: number; clientY: number }) {
    const rect = target?.value?.getBoundingClientRect()

    if (rect) {
      const x = event.clientX - rect.left - rect.width / 2
      const y = event.clientY - rect.top - rect.height / 2
      const length = Math.sqrt(x ** 2 + y ** 2)

      const newVector: Vector = length > boundingRadius ? [0, 0] : [x / boundingRadius, y / boundingRadius]
      updatePosition(newVector)
    }
  }

  function updatePosition(pos: Vector) {
    const deltaVector: Vector = [pos[0] - targetPosition[0], pos[1] - targetPosition[1]]

    if (getLength(deltaVector, boundingRadius) > animationThreshold && !isAnimating) {
      window.requestAnimationFrame(animationStep.bind(null, targetPosition, null))
    } else {
      drawElement(targetPosition)
    }

    targetPosition = pos
  }

  function stopAnimating() {
    isAnimating = false
    drawElement(targetPosition)
  }

  let start: number
  function animationStep(elementPosition: Vector, stepLength: number | null, timestamp: number) {
    const deltaVector = sum(targetPosition, negative(elementPosition))
    const deltaLength = getLength(deltaVector, boundingRadius)

    if (deltaLength < ANIMATION_STOP_THRESHOLD) {
      stopAnimating()
      return
    }

    if (!isAnimating) {
      start = timestamp
      isAnimating = true

      stepLength = getLength(sum(targetPosition, negative(elementPosition))) / ANIMATION_STEP_DIVISOR
    }

    const elapsed = timestamp - start

    if (elapsed > animationTimeout) {
      stopAnimating()
      return
    }

    if (elapsed > 0) {
      const stepMultiplier = stepLength! * Math.floor(elapsed / 10)
      const step = multiply(deltaVector, stepMultiplier)
      elementPosition = sum(elementPosition, step)
    }

    drawElement(elementPosition)
    window.requestAnimationFrame(animationStep.bind(null, elementPosition, stepLength))
  }

  function drawElement(pos: Vector) {
    const getCoord = (coord: number, _: HTMLElement, ind: number, layers: number) => {
      const multiplier = ind / layers * boundingRadius * stretchStrength
      return stretchingFunc(coord) * multiplier
    }

    anime({
      targets: target.value!.children,
      translateX: getCoord.bind(null, pos[0]),
      translateY: getCoord.bind(null, pos[1]),
      duration: 0,
    })
  }

  return { updateCoords, updatePosition }
}
