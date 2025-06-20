import React, { useCallback, useEffect, useRef } from 'react'

import useMouseValue from 'hooks/useMouseValue'
import { useSpring, useMotionValue, useAnimationFrame } from 'motion/react'
import classNames from 'classnames'

type TranslatableProps = {
  children: React.ReactNode;
  parentRef?: React.RefObject<HTMLElement | null>;
  distance?: number;
  stiffness?: number;
  damping?: number;
  mass?: number;
  disabled?: boolean;
  className?: string;
};

const Translatable = ({
  children,
  distance,
  stiffness,
  damping,
  mass,
  parentRef,
  disabled,
  className
}: TranslatableProps) => {
  // Animations
  const ref = useRef<HTMLDivElement>(null)
  const currentRef = parentRef ?? ref

  const options = {
    stiffness: stiffness ?? 100,
    damping: damping ?? 10,
    mass: mass ?? 1,
    distance: distance ?? 25
  }
  const mouse = useMouseValue({ absolute: true, ref: currentRef })
  const springX = useSpring(useMotionValue(0.5), options)
  const springY = useSpring(useMotionValue(0.5), options)

  let rect: DOMRect
  const handlePositionChange = useCallback(
    (axis: 'x' | 'y', value: number) => {
      if (!currentRef.current || disabled) return
      rect ??= currentRef.current.getBoundingClientRect()

      const normalizedValue =
        axis === 'x'
          ? (value - rect.left) / rect.width
          : (value - rect.top) / rect.height

      // Clamp values between 0 and 1
      const clampedValue = Math.max(0, Math.min(1, normalizedValue))

      const spring = axis === 'x' ? springX : springY
      spring.set(clampedValue)
    },
    [springX, springY]
  )
  useEffect(() => {
    mouse.x.on('change', (value) => handlePositionChange('x', value))
    mouse.y.on('change', (value) => handlePositionChange('y', value))

    // Add mouse leave handler
    const element = currentRef.current
    if (!element) return

    const handleMouseLeave = () => {
      springX.set(0.5)
      springY.set(0.5)
    }

    element.addEventListener('mouseleave', handleMouseLeave)
    return () => {
      element.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [mouse.x, mouse.y, handlePositionChange, springX, springY])

  useAnimationFrame(() => {
    if (!ref.current || disabled) return

    const x = (springX.get() - 0.5) * options.distance
    const y = (springY.get() - 0.5) * options.distance

    ref.current.style.transform = `translate(${x}px, ${y}px)`
  })

  return (
    <div ref={ ref } className={ classNames(className) }>
      { children }
    </div>
  )
}

export default Translatable
