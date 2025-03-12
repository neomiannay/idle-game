import { useRef } from 'react'

function useAsRef<V> (item: V) {
  const ref = useRef(item)
  ref.current = item
  return ref
}

export default useAsRef
