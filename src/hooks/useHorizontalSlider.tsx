import { useRef, useEffect, MutableRefObject } from 'react'

import { MotionValue, useMotionValue, useTransform } from 'motion/react'
import { animate } from 'motion'
import easing from 'src/helpers/easing'

import { useResizeObserver } from './useResizeObserver'
import useMotionState from './useMotionState'
interface UseHorizontalSliderOptions {
  offset?: number;
}

interface UseHorizontalSliderResult {
  nextPage: () => void;
  previousPage: () => void;
  start: boolean;
  end: boolean;
  goToItem: (index: number) => void;
  move: (to: number) => void;
  scrollLength: MotionValue<number>;
  scrollAvailable: MotionValue<number>;
  scrollX: MotionValue<number>;
  scrollProgress: MotionValue<number>;
  scrollXInverse: MotionValue<number>;
}

const useHorizontalSlider = (
  ref: MutableRefObject<HTMLElement | null>,
  { offset = 1 }: UseHorizontalSliderOptions = {}
): UseHorizontalSliderResult => {
  const animation = useRef<any>()

  const scrollX = useMotionValue(0)
  const bounds = useMotionValue<number[]>([])

  const total = useMotionValue(0)
  const pageSize = useMotionValue(0)
  const scrollLength = useMotionValue(1)

  const scrollAvailable = useTransform([scrollLength, pageSize], () => (scrollLength.get() - pageSize.get()) || 1)
  const scrollXInverse = useTransform([scrollX, scrollAvailable], () => scrollX.get() - scrollAvailable.get())
  const scrollProgress = useTransform([scrollX, scrollAvailable], () => scrollX.get() / scrollAvailable.get())

  const reset = () => {
    ref.current?.classList.remove('animating')
  }

  const updateSliderIndex = (direction: number) => () => {
    const inner = ref.current

    if (!inner) return

    const from = inner.scrollLeft
    const to = from + pageSize.get() * direction

    const closest = bounds.get()
      .filter((bound) => {
        if (direction > 0) return bound <= to
        return bound >= to
      })
      .sort((a, b) => {
        const distanceA = Math.abs(a - to)
        const distanceB = Math.abs(b - to)
        return distanceA - distanceB
      })?.[0]

    move(closest)
  }

  const goToItem = (index: number) => {
    const bound = bounds.get()[index]
    move(bound)
  }

  const move = (to: number) => {
    if (!ref.current) return
    if (animation.current) animation.current.stop()

    ref.current.classList.add('animating')

    const clamped = Math.min(scrollAvailable.get(), Math.max(0, to))
    const from = ref.current.scrollLeft

    animation.current = animate(from, clamped, {
      duration: 0.5,
      ease: easing.quadEaseOut,
      onUpdate: (latest: number) => {
        if (!ref.current) return
        ref.current.scrollLeft = latest
      },
      onComplete: reset
    })
  }

  const start = useMotionState(scrollX, (value) => value <= offset)
  const end = useMotionState(scrollXInverse, (value) => value <= offset)

  const onScroll = () => {
    if (!ref.current) return
    scrollX.set(ref.current.scrollLeft)
  }

  useResizeObserver(ref, () => {
    if (!ref.current) return
    total.set(ref.current.children.length)
    pageSize.set(ref.current.offsetWidth)
    scrollLength.set(ref.current.scrollWidth)

    const computedStyle = window.getComputedStyle(ref.current)
    const offset = !isNaN(parseFloat(computedStyle.scrollPaddingLeft))
      ? parseFloat(computedStyle.scrollPaddingLeft)
      : 0

    bounds.set(Array.from(ref.current.children).map((child) => {
      return (child as HTMLElement).offsetLeft - offset
    }))

    onScroll()
  })

  useEffect(() => {
    const inner = ref.current
    const interrupt = () => {
      animation.current?.stop()
      reset()
    }

    inner?.addEventListener('scroll', onScroll)
    inner?.addEventListener('mousewheel', interrupt)
    inner?.addEventListener('touchmove', interrupt)
    onScroll()
    return () => {
      inner?.removeEventListener('scroll', onScroll)
      inner?.removeEventListener('mousewheel', interrupt)
      inner?.removeEventListener('touchmove', interrupt)
    }
  }, [ref])

  return {
    nextPage: updateSliderIndex(1),
    previousPage: updateSliderIndex(-1),
    start,
    end,
    goToItem,
    move,
    // scrollStart,
    scrollAvailable,
    scrollLength,
    scrollX,
    scrollXInverse,
    scrollProgress
  }
}

// export const HorizontalSliderWrapper = styled.div`
//   display: flex;
//   overflow-x: auto;
//   position: relative;
//   ${hiddenScrollbarCSS}
//   scroll-snap-type: x mandatory;

//   &.animating {
//     scroll-snap-type: none;
//   }

//   .no-firefox & > * {
//     scroll-snap-align: start;
//     flex-shrink: 0;
//   }
// `

export default useHorizontalSlider
