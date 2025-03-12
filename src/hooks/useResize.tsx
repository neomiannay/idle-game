import { useEffect, useRef } from 'react'

function useResize (callback: Function) {
  const savedCallback = useRef<Function>()

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    const callback = () => {
      savedCallback.current?.()
    }

    callback()
    window.addEventListener('resize', callback)
    return () => window.removeEventListener('resize', callback)
  }, [])
}

export default useResize
