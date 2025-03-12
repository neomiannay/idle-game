import { createContext, useContext, useEffect, useState } from 'react'

import { AnimationPlaybackControls, MotionValue, ValueAnimationTransition, animate, useScroll } from 'motion/react'
import useRefState from 'hooks/useRefState'
import promise from 'helpers/promise'

import { useViewportContext } from './ViewportProvider'
import { BaseProviderProps } from './GlobalProvider'

export type ScrollContextType = {
  scroll: MotionValue<number>
  setScroll: (value: MotionValue<number>) => void
  scrollProgress: MotionValue<number>
  setScrollProgress: (value: MotionValue<number>) => void

  resetScroll: () => void
  scrollTo: (targetOrElement: number | HTMLElement, options?: ValueAnimationTransition, container?: Element | null) => AnimationPlaybackControls & { finished: Promise<any> } | undefined

  scrollLocked: boolean
  lockScroll: (value: boolean) => void
  // scrollDOMLocked: boolean
  // lockDOMScroll: (value: boolean) => void
}

export const ScrollContext = createContext<ScrollContextType>({} as ScrollContextType)

export const ScrollProvider = ({ children }: BaseProviderProps) => {
  const { scrollY, scrollYProgress } = useScroll()
  const [scroll, setScroll] = useState<MotionValue<number>>(scrollY)
  const [scrollProgress, setScrollProgress] = useState<MotionValue<number>>(scrollYProgress)
  const [scrollLocked, lockScroll, lockRef] = useRefState<boolean>(false)
  const { offsetTop } = useViewportContext()

  const scrollTo = (
    targetOrElement: number | HTMLElement,
    {
      duration = 0.5,
      ease = 'easeOut',
      ...animationProps
    } : ValueAnimationTransition = {},
    container?: Element | null
  ) => {
    container = container || document.scrollingElement
    if (!container) return

    const to = typeof targetOrElement === 'number' ? targetOrElement : targetOrElement.getBoundingClientRect().top + container.scrollTop
    const deffered = promise.defer()
    const animation = animate(container.scrollTop, to, {
      duration,
      ease,
      ...animationProps,
      onUpdate: latest => {
        container.scrollTop = latest
      },
      onComplete: deffered.resolve
    })
    return {
      ...animation,
      finished: deffered.promise
    }
  }

  // useEffect(() => {
  //   if (scrollDOMLocked) {
  //     if (document.documentElement.classList.contains('no-scroll')) return
  //     fakeScroll.set(document.documentElement.scrollTop)
  //     document.documentElement.classList.add('no-scroll')
  //     document.body.scrollTop = fakeScroll.get()
  //     setScroll(fakeScroll)
  //   } else {
  //     if (!document.documentElement.classList.contains('no-scroll')) return
  //     const scrollTop = document.body.scrollTop
  //     document.documentElement.classList.remove('no-scroll')
  //     document.documentElement.scrollTop = scrollTop
  //     setScroll(scrollY)
  //   }
  // }, [scrollDOMLocked])

  useEffect(() => {
    const preventDefault = (e: Event) => {
      const preventParent = (e.target as HTMLElement).closest('.scrolling-wrapper') as HTMLElement
      if (lockRef.current && !preventParent) e.preventDefault()
    }

    document.scrollingElement?.classList.add('scrolling-element')
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    window.addEventListener('touchmove', preventDefault, { passive: false })
    window.addEventListener('mousewheel', preventDefault, { passive: false })
    window.addEventListener('wheel', preventDefault, { passive: false })
    window.addEventListener('DOMMouseScroll', preventDefault, { passive: false })
  }, [])

  const resetScroll = () => {
    if (!document.scrollingElement) return
    const newScroll = Math.min(document.scrollingElement.scrollTop, offsetTop.height.get())
    document.scrollingElement.scrollTop = newScroll
  }

  return (
    <ScrollContext.Provider value={{
      scrollLocked,
      lockScroll,
      scroll,
      setScroll,
      scrollProgress,
      setScrollProgress,
      scrollTo,
      resetScroll
    }}
    >
      { children }
    </ScrollContext.Provider>
  )
}

export const useScrollContext = () => {
  const context = useContext(ScrollContext)
  if (!context) throw Error('useScrollContext must be used inside a `ScrollContext`')
  return context
}
