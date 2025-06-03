import { RefObject, useEffect, useRef } from 'react'

import useMouseValue from 'hooks/useMouseValue'
import { useL10n } from 'provider/L10nProvider'
import { useSpring, useMotionValue, useAnimationFrame, motion, AnimatePresence } from 'motion/react'
import classNames from 'classnames'
import { clamp } from 'lodash-es'
import { baseVariants, tooltipAnimation } from 'core/animation'

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

  const insideRef = useRef(false)
  const hasStart = useRef({ x: false, y: false })
  const unchangedRef = useRef(0)

  const onPositionChange = (axis: 'x' | 'y', value: number) => {
    const spring = axis === 'x' ? springX : springY
    if (!hasStart.current[axis] && !disabled) {
      hasStart.current[axis] = true
      spring.jump(value)
    } else {
      spring.set(value)
    }
  }

  useEffect(() => {
    mouse.x.on('change', (value) => onPositionChange('x', value))
    mouse.y.on('change', (value) => onPositionChange('y', value))
  }, [mouse.x, mouse.y])

  useEffect(() => {
    if (!parent?.current) return

    const handleMouseMove = () => {
      insideRef.current = true
    }

    const handleMouseLeave = () => {
      insideRef.current = false
    }

    const element = parent.current
    element.addEventListener('mousemove', handleMouseMove)
    element.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      element.removeEventListener('mousemove', handleMouseMove)
      element.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [parent])

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

      const width = ((springXValue - parentLeft) / vWidth) * 100
      const height = ((springYValue - parentTop) / vHeight) * 100

      if (width && height)
        ref.current.style.transform = `translate(${-clamp(width, 0, 100)}%, ${-clamp(height, 0, 100)}%)`
    }
  })

  return (
    <AnimatePresence>
      { !disabled && insideRef.current && (
        <motion.div
          ref={ ref }
          className={ classNames(styles.wrapper, className) }
          style={{
            transform: isParentAbsolute.current
              ? 'translateY(100%)'
              : undefined
          }}
          { ...baseVariants }
          { ...tooltipAnimation() }
        >
          <span>{ ttl }</span>
        </motion.div>
      ) }
    </AnimatePresence>
  )
}

export default Tooltip
