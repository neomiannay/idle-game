import { useEffect, useRef } from 'react'

function useKeydown (keys: string[] = [], callback = () => {}) {
  const savedCallback = useRef<() => void>(callback)

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    const callback = (event: KeyboardEvent) => {
      if (keys.includes(event.key)) {
        event.preventDefault()
        savedCallback.current?.()
      }
    }
    document.addEventListener('keydown', callback)
    return () => document.removeEventListener('keydown', callback)
  }, [])
}

export default useKeydown
