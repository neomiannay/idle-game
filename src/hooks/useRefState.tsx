import { useState } from 'react'

import { isFunction } from 'lodash-es'

import useAsRef from './useAsRef'

function useRefState<V> (initialValue: V | (() => V)) {
  const [state, setState] = useState<V>(initialValue)
  const ref = useAsRef(state)

  const setStateRef = (value: V | ((prevState: V) => V)) => {
    setState(value)
    ref.current = isFunction(value) ? value(state) : value
  }

  return [state, setStateRef, ref] as const
}

export default useRefState
