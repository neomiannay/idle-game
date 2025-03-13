import { createContext, useContext, useEffect, useMemo } from 'react'

import { debounce, each, mapValues, reduce } from 'lodash-es'
import { MotionValue, useMotionValue, useMotionValueEvent, useScroll, useTransform } from 'motion/react'
import useRefState from 'hooks/useRefState'
import useObjectMotionValue, { ObjectMotionValue } from 'hooks/useObjectMotionValue'
import useMotionState from 'hooks/useMotionState'

import { BaseProviderProps } from './GlobalProvider'

type ViewportSize = {
  width: number
  height: number
  innerHeight: number
  ratio: number
  placeholder: boolean
  headerHeight: number
  footerHeight: number
}

type ViewportMediaQueries = {
  phone: boolean,
  tablet: boolean,
  tabletPortrait: boolean,
  phonePortrait: boolean,
}

type ViewportContextType = {
  sizes: ObjectMotionValue<ViewportSize>
  mq: ViewportMediaQueries,
  setViewportReference: (ref: HTMLElement | null) => void
  offsetTop: {
    scroll: MotionValue<number>,
    height: MotionValue<number>
  }
}

export const ViewportContext = createContext<ViewportContextType | null>(null)

const mqSizes = {
  tabletMaxWidth: "1024",
  tabletPortraitMaxWidth: "900",
  phoneMaxWidth: "740",
  phonePortraitMaxWidth: "420",
}

let context: ViewportContextType | null = null

const mqReferences = reduce(mqSizes, (memo, size, k) => {
  const key = k.replace('MaxWidth', '')
  memo[key] = parseInt(size)
  return memo
}, {} as any)

export const ViewportProvider = ({ children }: BaseProviderProps) => {
  const [reference, setViewportReference, referenceRef] = useRefState<HTMLElement | null>(null)
  const sizes = useObjectMotionValue<ViewportSize>({
    width: 1440,
    height: 720,
    innerHeight: 720,
    ratio: 2,
    headerHeight: 60,
    placeholder: true,
    footerHeight: 0
  })

  const resize = () => {
    sizes.placeholder.set(false)

    const height = Math.min(window.screen.availHeight, window.innerHeight)
    const width = !referenceRef.current ? document.body.offsetWidth : referenceRef.current.offsetWidth
    // const isScrollResize = detect.iphone && Math.abs(height - sizes.innerHeight.get()) < 220 && width === sizes.width.get()

    sizes.height.set(height)
    sizes.width.set(width)
    sizes.ratio.set(width / height)
    // if (!isScrollResize) sizes.innerHeight.set(height)
  }

  useEffect(() => {
    const _resize = debounce(resize, 200)
    window.addEventListener('resize', _resize)
    return () => window.removeEventListener('resize', _resize)
  }, [])

  useEffect(() => {
    resize()
    setTimeout(resize, 1000)
  }, [reference])

  useMemo(() => {
    if (typeof window !== 'undefined') document.documentElement.style.setProperty('--vw', document.body.offsetWidth + 'px')
  }, [])

  const { scrollY } = useScroll()

  const offsetHeight = useMotionValue<number>(0)
  const offsetTop = {
    height: offsetHeight,
    scroll: useTransform<number, number>([offsetHeight, scrollY], ([h, s]) => {
      return Math.max(0, h - Math.max(0, s))
    })
  }

  // MAP CSS VARIABLES
  const cssMapping = {
    '--vh': sizes.height,
    '--vw': sizes.width,
    '--ivh': sizes.innerHeight,
    '--offset-top': offsetTop.scroll,
    '--offset-height': offsetTop.height,
    '--header-height': sizes.headerHeight,
    '--footer-height': sizes.footerHeight
  }

  each(cssMapping, (v, k) => {
    useMotionValueEvent(v, 'change', (value) => {
      if (value) document.documentElement.style.setProperty(k, value + 'px')
    })
  })

  const mq = useMotionState(sizes.width, (width: number) => mapValues(mqReferences, (size) => width < size) as ViewportMediaQueries, true)

  context = { mq, sizes, setViewportReference, offsetTop }

  return (
    <ViewportContext.Provider value={context}>
      {children}
    </ViewportContext.Provider>
  )
}

export const useViewportContext = () => {
  const context = useContext(ViewportContext)
  if (!context) throw Error('useViewportContext must be used inside a `ViewportContext`')
  return context
}

export const getViewportContext = () => {
  if (typeof window === 'undefined') throw Error('getViewportContext can\'t be used on server side')
  return context
}

export const isTabletPortrait = () => !!getViewportContext()?.mq.tabletPortrait
export const getSize = () => getViewportContext()?.sizes
