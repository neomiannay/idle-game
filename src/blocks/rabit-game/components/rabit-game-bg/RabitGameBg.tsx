import React, { useCallback, useEffect, useRef, useState } from 'react'

import { animate, useMotionValue, useSpring } from 'motion/react'
import easing from 'helpers/easing'
import useMouseValue from 'hooks/useMouseValue'

import { RabitGameBgMask } from './RabitGameBgMask'

const RabitGameBg = ({ className }: { className: string }) => {
  const svgRef = useRef<HTMLDivElement>(null)
  const [pulse, setPulse] = useState(60)
  const [opacity, setOpacity] = useState(0)

  const sizes = {
    width: 475,
    height: 475
  }

  useEffect(() => {
    const { stop } = animate(60, 100, {
      duration: 3,
      repeat: Infinity,
      repeatType: 'reverse',
      ease: easing.quadEaseOut,
      onUpdate: setPulse
    })
    return stop
  }, [])

  const options = {
    stiffness: 50,
    damping: 10,
    mass: 1
  }

  const mouse = useMouseValue({ absolute: true, ref: svgRef })
  const springX = useSpring(useMotionValue(0), options)
  const springY = useSpring(useMotionValue(0), options)

  const handlePositionChange = useCallback(
    (axis: 'x' | 'y', value: number) => {
      const toTop = svgRef.current?.getBoundingClientRect().top ?? 0
      const toLeft = svgRef.current?.getBoundingClientRect().left ?? 0

      const springValue = axis === 'x' ? value - toLeft : value - toTop
      const spring = axis === 'x' ? springX : springY

      spring.set(springValue)
    },
    [springX, springY]
  )

  useEffect(() => {
    mouse.x.on('change', (value) => handlePositionChange('x', value))
    mouse.y.on('change', (value) => handlePositionChange('y', value))
  }, [mouse.x, mouse.y, handlePositionChange])

  useEffect(() => {
    if (!svgRef.current) return

    const handleMouseLeave = () => setOpacity(0)
    const handleMouseEnter = () => setOpacity(1)

    const element = svgRef.current

    if (!element) return

    element.addEventListener('mouseleave', handleMouseLeave)
    element.addEventListener('mouseenter', handleMouseEnter)

    return () => {
      element.removeEventListener('mouseleave', handleMouseLeave)
      element.removeEventListener('mouseenter', handleMouseEnter)
    }
  }, [])

  return (
    <div
      ref={ svgRef }
      style={{
        width: `${sizes.width}px`,
        height: `${sizes.height}px`,
        transition: 'opacity 0.3s ease-in-out'
      }}
      className={ className }
    >
      <svg
        width={ sizes.width }
        height={ sizes.height }
        viewBox={ `0 0 ${sizes.width} ${sizes.height}` }
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        { /* Svg mask */ }
        <RabitGameBgMask width={ sizes.width } height={ sizes.height } />
        <g mask='url(#mask-bg)'>
          <defs>
            <radialGradient
              id='gradient'
              cx='50%'
              cy='50%'
              r='50%'
              fx='50%'
              fy='50%'
            >
              <stop offset='0%' stopColor='#13394656' />
              <stop offset={ `${pulse}%` } stopColor='#13394600' />
            </radialGradient>
          </defs>
          <rect width={ sizes.width } height={ sizes.height } fill='url(#gradient)' />
        </g>
        <circle
          id='cursor-mouse'
          mask='url(#mask-bg)'
          style={{
            filter: 'blur(50px)',
            opacity,
            transition: 'opacity 0.3s ease-in-out'
          }}
          cx={ springX.get() }
          cy={ springY.get() }
          r={ pulse / 2 }
          fill='#133946'
        />
      </svg>
    </div>
  )
}

export default RabitGameBg
