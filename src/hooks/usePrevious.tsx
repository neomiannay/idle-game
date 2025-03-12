import { useMemo, useRef } from 'react'

function usePrevious<V> (item: V) {
  const previous = useRef<V>()
  const ref = useRef(item)

  return useMemo(() => {
    previous.current = ref.current
    ref.current = item
    return previous.current
  }, [item])
}

export default usePrevious
