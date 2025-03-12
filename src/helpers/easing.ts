import { mapValues } from 'lodash-es'
import { cubicBezier } from 'motion'

const linear = [0, 0, 1, 1] as [number, number, number, number]

const principle = [0.25, 0.1, 0.25, 1] as [number, number, number, number]
const principleIn = [0.42, 0.1, 1, 1] as [number, number, number, number]
const principleOut = [0, 0, 0.58, 1] as [number, number, number, number]

const quadEaseIn = [0.55, 0.085, 0.68, 0.53] as [number, number, number, number]
const cubicEaseIn = [0.55, 0.055, 0.675, 0.19] as [number, number, number, number]
const quartEaseIn = [0.895, 0.03, 0.685, 0.22] as [number, number, number, number]
const quintEaseIn = [0.755, 0.05, 0.855, 0.06] as [number, number, number, number]
const sineEaseIn = [0.47, 0, 0.745, 0.715] as [number, number, number, number]
const expoEaseIn = [0.95, 0.05, 0.795, 0.035] as [number, number, number, number]
const circEaseIn = [0.6, 0.04, 0.98, 0.335] as [number, number, number, number]

const quadEaseOut = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number]
const cubicEaseOut = [0.215, 0.61, 0.355, 1] as [number, number, number, number]
const quartEaseOut = [0.165, 0.84, 0.44, 1] as [number, number, number, number]
const quintEaseOut = [0.23, 1, 0.32, 1] as [number, number, number, number]
const sineEaseOut = [0.39, 0.575, 0.565, 1] as [number, number, number, number]
const expoEaseOut = [0.19, 1, 0.22, 1] as [number, number, number, number]
const circEaseOut = [0.075, 0.82, 0.165, 1] as [number, number, number, number]

const quadEaseInOut = [0.455, 0.03, 0.515, 0.955] as [number, number, number, number]
const cubicEaseInOut = [0.645, 0.045, 0.355, 1] as [number, number, number, number]
const quartEaseInOut = [0.77, 0, 0.175, 1] as [number, number, number, number]
const quintEaseInOut = [0.86, 0, 0.07, 1] as [number, number, number, number]
const sineEaseInOut = [0.445, 0.05, 0.55, 0.95] as [number, number, number, number]
const expoEaseInOut = [1, 0, 0, 1] as [number, number, number, number]
const circEaseInOut = [0.785, 0.135, 0.15, 0.86] as [number, number, number, number]

const bezier = {
  linear,

  principle,
  principleIn,
  principleOut,

  quadEaseIn,
  cubicEaseIn,
  quartEaseIn,
  quintEaseIn,
  sineEaseIn,
  expoEaseIn,
  circEaseIn,

  quadEaseOut,
  cubicEaseOut,
  quartEaseOut,
  quintEaseOut,
  sineEaseOut,
  expoEaseOut,
  circEaseOut,

  quadEaseInOut,
  cubicEaseInOut,
  quartEaseInOut,
  quintEaseInOut,
  sineEaseInOut,
  expoEaseInOut,
  circEaseInOut
}

const easing = mapValues(bezier, array => cubicBezier(...array))

export default easing
export { bezier }
