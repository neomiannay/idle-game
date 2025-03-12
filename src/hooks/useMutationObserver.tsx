import { RefObject, useEffect } from 'react'

function useMutationObserver (ref: RefObject<HTMLElement>, callback: () => void, options = {}) {
  useEffect(() => {
    // Create an observer instance linked to the callback function
    if (ref.current) {
      const observer = new MutationObserver(callback)

      // Start observing the target node for configured mutations
      observer.observe(ref.current, options)
      return () => {
        observer.disconnect()
      }
    }
  }, [callback, options, ref.current])
}

export { useMutationObserver }
