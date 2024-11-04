export type Vector = [number, number]

export function stretchingFunc(x: number): number {
  const res = -Math.exp(-Math.abs(4 * x)) + 1

  if (Math.abs(x) > 1) return x
  if (x === 0) return 0
  if (x < 0) return -res
  if (x > 0) return res
  return res
}

export function getLength(v: Vector, scale = 1): number {
  return Math.sqrt((v[0] * scale) ** 2 + (v[1] * scale) ** 2)
}

export function sum(v1: Vector, v2: Vector): Vector {
  return [v1[0] + v2[0], v1[1] + v2[1]]
}

export function negative(v: Vector): Vector {
  return [-v[0], -v[1]]
}

export function multiply(v: Vector, scale: number): Vector {
  return [v[0] * scale, v[1] * scale]
}
