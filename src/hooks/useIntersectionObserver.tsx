import { RefObject, useEffect, useState } from 'react'

type IntersectionObserverOptions = {
  threshold?: number | number[],
  root?: HTMLElement | null,
  rootCallback?: () => HTMLElement | null,
  rootMargin?: string,
  freezeOnceVisible?: boolean
}

function useIntersectionObserver (
  elementRef: RefObject<HTMLElement>,
  {
    threshold = 0,
    root = null,
    rootMargin = '0%',
    rootCallback,
    freezeOnceVisible = false
  }: IntersectionObserverOptions = {}
) {
  const [isIntersecting, setIsIntersecting] = useState<boolean>()

  const frozen = isIntersecting && freezeOnceVisible

  const updateEntry = ([entry]: IntersectionObserverEntry[]) => {
    setIsIntersecting(entry.isIntersecting)
  }

  useEffect(() => {
    const node = elementRef?.current // DOM Ref
    const hasIOSupport = !!window.IntersectionObserver

    if (!hasIOSupport || frozen || !node) return

    const observerParams = { threshold, root, rootMargin }
    if (rootCallback) observerParams.root = rootCallback()
    const observer = new IntersectionObserver(updateEntry, observerParams as any)

    observer.observe(node)

    return () => observer.disconnect()
  }, [elementRef, JSON.stringify(threshold), root, rootMargin, frozen])

  return isIntersecting
}

export default useIntersectionObserver
