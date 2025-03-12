import { useMemo } from 'react'

import { MotionValue, useMotionValue } from 'motion/react'
import { each, isFunction, mapValues } from 'lodash-es'

type MappedMotionValue<T> = {
  [P in keyof T]: MotionValue<T[P]>;
};

export type ObjectMotionValue<Type> = MappedMotionValue<Type> & {
  set: (value: Type) => void;
  get: () => Type;
};

function useObjectMotionValue <A extends Record<string, any>> (initialValue : A | (() => A)) : ObjectMotionValue<A> {
  const memo = useMemo(() => isFunction(initialValue) ? initialValue() : initialValue, [])
  const object = mapValues(memo, (o) => useMotionValue(o))

  return {
    ...object,
    set: (value: A) => {
      each(object, (v, k) => {
        v.set(value[k])
      })
    },
    get: () => {
      return mapValues(object, (v) => v.get()) as A
    }
  } as ObjectMotionValue<A>
}

export default useObjectMotionValue
