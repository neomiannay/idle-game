import React, { useCallback, useEffect, useRef } from 'react'

import useMouseValue from 'hooks/useMouseValue'
import { useSpring, useMotionValue, useAnimationFrame } from 'motion/react'

type TranslatableProps = {
  children: React.ReactNode;
  distance?: number;
  stiffness?: number;
  damping?: number;
  mass?: number;
}

const Translatable = ({ children, distance, stiffness, damping, mass }: TranslatableProps) => {
  // Animations
  const ref = useRef<HTMLDivElement>(null)
  const options = {
    stiffness: stiffness ?? 100,
    damping: damping ?? 10,
    mass: mass ?? 1,
    distance: distance ?? 25
  }
  const mouse = useMouseValue({ absolute: true, ref })
  const springX = useSpring(useMotionValue(0.5), options)
  const springY = useSpring(useMotionValue(0.5), options)

  let rect: DOMRect
  const handlePositionChange = useCallback(
    (axis: 'x' | 'y', value: number) => {
      if (!ref.current) return
      rect ??= ref.current.getBoundingClientRect()

      const normalizedValue = axis === 'x'
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
    const element = ref.current
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
    if (!ref.current) return

    const x = (springX.get() - .5) * options.distance
    const y = (springY.get() - .5) * options.distance

    ref.current.style.transform = `translate(${x}px, ${y}px)`
  })

  return (
    <div ref={ ref }>
      { children }
    </div>
  )
}

export default Translatable
