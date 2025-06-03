import { RefObject, useEffect, useRef, useCallback } from 'react'

import useMouseValue from 'hooks/useMouseValue'
import { useL10n } from 'provider/L10nProvider'
import { useSpring, useMotionValue, useAnimationFrame } from 'motion/react'
import classNames from 'classnames'
import { clamp } from 'lodash-es'

import styles from './Tooltip.module.scss'

interface TooltipProps {
  title: string;
  disabled: boolean;
  parent?: RefObject<HTMLElement | null>;
  className?: string;
  contain?: boolean;
}

const Tooltip = ({
  title,
  disabled,
  parent,
  className,
  contain
}: TooltipProps) => {
  const mouse = useMouseValue({ absolute: true, ref: parent })
  const l10n = useL10n()
  const ttl = l10n(title)
  const ref = useRef<HTMLDivElement>(null)
  const isParentAbsolute = useRef(false)

  const options = {
    stiffness: 50,
    damping: 10,
    mass: 1
  }

  const springX = useSpring(useMotionValue(0), options)
  const springY = useSpring(useMotionValue(0), options)

  const activeRef = useRef(false)
  const insideRef = useRef(false)
  const animationRef = useRef<Animation | undefined>(undefined)
  const hasStart = useRef({ x: false, y: false })
  const unchangedRef = useRef(0)

  const handlePositionChange = useCallback(
    (axis: 'x' | 'y', value: number) => {
      const spring = axis === 'x' ? springX : springY
      if (!hasStart.current[axis] && !disabled) {
        hasStart.current[axis] = true
        spring.jump(value)
      } else {
        spring.set(value)
      }
    },
    [springX, springY]
  )

  useEffect(() => {
    mouse.x.on('change', (value) => handlePositionChange('x', value))
    mouse.y.on('change', (value) => handlePositionChange('y', value))
  }, [mouse.x, mouse.y, handlePositionChange])

  const animateTooltip = useCallback((to: number, onFinish?: () => void) => {
    if (animationRef.current) animationRef.current.cancel()
    if (!ref.current || disabled) return

    const opacity = parseFloat(getComputedStyle(ref.current).opacity) || 0
    animationRef.current = ref.current.animate([{ opacity }, { opacity: to }], {
      delay: opacity > to ? 500 : 200,
      duration: 250,
      easing: 'ease-in-out'
    })

    if (animationRef.current && onFinish)
      animationRef.current.onfinish = onFinish
  }, [])

  useEffect(() => {
    if (!parent?.current) return

    const handleMouseMove = () => {
      if (!hasStart.current.x || !hasStart.current.x || insideRef.current)
        return

      insideRef.current = true
      animateTooltip(1, () => {
        activeRef.current = true
        if (ref.current) ref.current.style.opacity = '1'
      })
    }

    const handleMouseLeave = () => {
      insideRef.current = false

      animateTooltip(0, () => {
        activeRef.current = false
        hasStart.current = { x: false, y: false }
        if (ref.current) ref.current.style.opacity = '0'
      })
    }

    const element = parent.current
    element.addEventListener('mousemove', handleMouseMove)
    element.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      element.removeEventListener('mousemove', handleMouseMove)
      element.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [parent, animateTooltip])

  useAnimationFrame(() => {
    if (!hasStart.current.x || !hasStart.current.y || !ref.current || disabled)
      return

    let parentRect: DOMRect | undefined
    if (parent?.current) parentRect = parent.current.getBoundingClientRect()

    const mouseX = Math.round(mouse.x.get())
    const mouseY = Math.round(mouse.y.get())
    let springXValue = Math.round(springX.get())
    let springYValue = Math.round(springY.get())

    if (parent?.current) {
      isParentAbsolute.current =
        getComputedStyle(parent.current).position === 'absolute'

      if (isParentAbsolute.current) {
        springXValue -= parentRect?.left || 0
        springYValue -= parentRect?.top || 0
      }
    }

    const hasMouseChanged = mouseX !== springXValue || mouseY !== springYValue
    unchangedRef.current = hasMouseChanged ? 0 : unchangedRef.current + 1

    ref.current.style.top = `${springYValue}px`
    ref.current.style.left = `${springXValue}px`

    if (contain && parent?.current) {
      const vWidth = parent?.current?.offsetWidth
      const vHeight = parent?.current?.offsetHeight

      const parentTop = parentRect?.top || 0
      const parentLeft = parentRect?.left || 0

      const width = ((mouseX - parentLeft) / vWidth) * 100
      const height = ((mouseY - parentTop) / vHeight) * 100

      if (width && height)
        ref.current.style.transform = `translate(${-clamp(width, 0, 100)}%, ${-clamp(height, 0, 100)}%)`
    }
  })

  return (
    <>
      { !disabled && (
        <div
          ref={ ref }
          className={ classNames(styles.wrapper, className) }
          style={{
            opacity: 0,
            transform: isParentAbsolute.current ? 'translateY(100%)' : undefined
          }}
        >
          <span>{ ttl }</span>
        </div>
      ) }
    </>
  )
}

export default Tooltip
