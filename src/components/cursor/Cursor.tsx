import { memo, RefObject, useEffect, useRef, useCallback } from 'react'

import useMouseValue from 'hooks/useMouseValue'
import { useL10n } from 'provider/L10nProvider'
import { useSpring, useMotionValue, useAnimationFrame } from 'motion/react'

import styles from './Cursor.module.scss'

interface CursorProps {
  title: string;
  disabled: boolean;
  parent: RefObject<HTMLElement>;
}

const Cursor = ({ title, disabled, parent }: CursorProps) => {
  const mouse = useMouseValue({ absolute: true, ref: parent })
  const l10n = useL10n()
  const ttl = l10n(title)
  const ref = useRef<HTMLDivElement>(null)

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

  const animateCursor = useCallback((to: number, onFinish?: () => void) => {
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
    if (!parent.current) return

    const handleMouseMove = () => {
      if (!hasStart.current.x || !hasStart.current.x || insideRef.current) return

      insideRef.current = true
      animateCursor(1, () => {
        activeRef.current = true
        if (ref.current) ref.current.style.opacity = '1'
      })
    }

    const handleMouseLeave = () => {
      insideRef.current = false

      animateCursor(0, () => {
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
  }, [parent, animateCursor])

  useAnimationFrame(() => {
    if (!hasStart.current.x || !hasStart.current.y || !ref.current || disabled)
      return

    const mouseX = Math.round(mouse.x.get())
    const mouseY = Math.round(mouse.y.get())
    const springXValue = Math.round(springX.get())
    const springYValue = Math.round(springY.get())

    const hasMouseChanged = mouseX !== springXValue || mouseY !== springYValue
    unchangedRef.current = hasMouseChanged ? 0 : unchangedRef.current + 1

    ref.current.style.top = `${springYValue}px`
    ref.current.style.left = `${springXValue}px`
  })

  return (
    <div ref={ ref } className={ styles.wrapper } style={{ opacity: 0 }}>
      <span>{ ttl }</span>
    </div>
  )
}

export default memo(Cursor)
