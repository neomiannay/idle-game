import { useMemo } from 'react'

import { mapValues } from 'lodash-es'
import { useIsPresent } from 'motion/react'

import useTimings from './useTimings'

const useFramerTimings = (timings : Record<string, number>, [initial, animate, exit] = ['initial', 'animate', 'exit']) => {
  const [states, start, reset] = useTimings(timings, true) // eslint-disable-line no-unused-vars
  const isPresent = useIsPresent()

  const variants = useMemo(() => {
    if (!isPresent) return mapValues(timings, () => exit)
    if (states) return mapValues(states, (state) => state ? animate : initial)
  }, [states, isPresent])

  return [variants, reset]
}

export default useFramerTimings
