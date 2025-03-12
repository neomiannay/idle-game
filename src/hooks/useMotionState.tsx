import { MotionValue, useMotionValueEvent, useTransform } from 'motion/react'
import { isEqual } from 'lodash-es'

import useRefState from './useRefState'

type Callback<A, B> = (a:B) => A

const useMotionState = <A, B>(motionValue:MotionValue<B>, callback:Callback<A, B> = (a:B):A => a as any, deepCompare = false) => {
  const [state, setState, stateRef] = useRefState<A>(() => callback(motionValue.get()))
  useMotionValueEvent(useTransform(motionValue, callback), 'change', (v) => {
    if (deepCompare && isEqual(stateRef.current, v)) return
    if (stateRef.current === v) return
    setState(v)
  })
  return state
}

export default useMotionState
