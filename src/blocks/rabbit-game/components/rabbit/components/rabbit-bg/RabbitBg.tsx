import React, { useEffect, useRef, useState } from 'react'

import { animate, MotionValue } from 'motion/react'
import easing from 'helpers/easing'

import { RabbitBgMask } from './RabbitBgMask'

const RabbitBg = ({
  opacity,
  springX,
  springY
}: {
  opacity: number;
  springX: MotionValue<number>;
  springY: MotionValue<number>;
}) => {
  const sizes = {
    width: 350,
    height: 350,
    bgScale: 0.75,
    pulse: {
      min: 85,
      max: 110,
      cursorScale: 0.5
    }
  }

  const svgRef = useRef<HTMLDivElement>(null)
  const [pulse, setPulse] = useState(sizes.pulse.min)

  useEffect(() => {
    const { stop } = animate(sizes.pulse.min, sizes.pulse.max, {
      duration: 3,
      repeat: Infinity,
      repeatType: 'reverse',
      ease: easing.quadEaseOut,
      onUpdate: setPulse
    })
    return stop
  }, [])

  return (
    <div
      ref={ svgRef }
      style={{
        width: `${sizes.width}px`,
        height: `${sizes.height}px`,
        transition: 'opacity 0.3s ease-in-out',
        zIndex: -1,
        position: 'relative'
      }}
    >
      <svg
        width={ sizes.width }
        height={ sizes.height }
        style={{
          mixBlendMode: 'darken',
          pointerEvents: 'none'
        }}
        viewBox={ `0 0 ${sizes.width} ${sizes.height}` }
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        { /* Svg mask */ }
        <RabbitBgMask
          width={ sizes.width }
          height={ sizes.height }
          bgScale={ sizes.bgScale }
        />
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
          <rect
            width={ sizes.width }
            height={ sizes.height }
            fill='url(#gradient)'
          />
        </g>
        <g
          id='cursor-mouse'
          mask='url(#mask-bg)'
        >
          <circle
            style={{
              filter: 'blur(50px)'
            }}
            width={ sizes.width }
            height={ sizes.height }
            cx={ sizes.width / 2 }
            cy={ sizes.height / 2 }
            r={ Math.max(sizes.width, sizes.height) / 2 }
            fill='#13394626'
          />
          <circle
            style={{
              filter: 'blur(50px)',
              opacity,
              transition: 'opacity 0.3s ease-in-out'
            }}
            cx={ springX.get() }
            cy={ springY.get() }
            r={ pulse * sizes.pulse.cursorScale }
            fill='#133946'
          />
        </g>
      </svg>
    </div>
  )
}

export default RabbitBg
