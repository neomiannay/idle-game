import { castArray, first } from 'lodash-es'

const shortestAngle = (from: number, to: number, unit = Math.PI * 2) => {
  const difference = from - to
  const halfDistance = unit / 2
  return wrap(difference + halfDistance, 0, unit) - halfDistance
}

const wrap = (value: number, lower: number, upper: number) => {
  const distance = upper - lower
  const times = Math.floor((value - lower) / distance)
  return value - times * distance
}

const getFirstElement = <T>(array: T | T[]): T => first(castArray(array)) as T

const round = (number:number, precision:number) => Math.round(number * Math.pow(10, precision)) / Math.pow(10, precision)

const even = (number:number) => Math.ceil(number / 2) * 2

const scale = (method: string, containerW:number, containerH:number, contentW:number, contentH:number, safeZone = null) => {
  const scaleX = containerW / contentW
  const scaleY = containerH / contentH
  let scaleXSafe, scaleYSafe

  if (safeZone) {
    scaleXSafe = containerW / (contentW * safeZone)
    scaleYSafe = containerH / (contentH * safeZone)
  }

  switch (method) {
    case 'contain':
      return Math.min(scaleX, scaleY)

    case 'width':
      return scaleX

    case 'height':
      return scaleYSafe
        ? Math.max(Math.min(scaleX, scaleYSafe), scaleY)
        : scaleY

    case 'cover':
      return scaleYSafe && scaleXSafe
        ? Math.max(
          Math.min(scaleX, scaleYSafe),
          Math.min(scaleY, scaleXSafe)
        )
        : Math.max(scaleX, scaleY)
  }
}

const clamp = (value:number, min:number, max:number) => Math.min(max, Math.max(min, value))
const map = (value:number, start1:number, stop1:number, start2:number, stop2:number) => start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1))
const mapClamp = (value:number, start1:number, stop1:number, start2 = 0, stop2 = 1) => clamp(map(value, start1, stop1, start2, stop2), start2, stop2)

export default {
  shortestAngle,
  wrap,
  round,
  even,
  scale,
  clamp,
  map,
  mapClamp,
  getFirstElement
}
