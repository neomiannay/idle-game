import { useEffect, useRef } from 'react'

const useRequestAnimationFrame = (callback: Function) => {
  const requestRef = useRef<number>(0)
  const previousTimeRef = useRef<number>(0)

  const animate = (time: number) => {
    if (previousTimeRef.current !== undefined) {
      const deltaTime = time - previousTimeRef.current
      callback(deltaTime)
    }
    previousTimeRef.current = time
    requestRef.current = requestAnimationFrame(animate)
  }

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(requestRef.current as number)
  }, [])
}

export default useRequestAnimationFrame
