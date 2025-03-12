import { RefObject, useEffect } from 'react'

function useResizeObserver (ref: RefObject<HTMLElement>, callback: (entries?: ResizeObserverEntry[]) => void, options = {}) {
  useEffect(() => {
    // Create an observer instance linked to the callback function
    if (ref.current) {
      const observer = new ResizeObserver(callback)
      // Start observing the target node for configured mutations
      observer.observe(ref.current, options)
      return () => {
        observer.disconnect()
      }
    } else {
      callback()
    }
  }, [callback, JSON.stringify(options), ref.current])
}

export { useResizeObserver }
