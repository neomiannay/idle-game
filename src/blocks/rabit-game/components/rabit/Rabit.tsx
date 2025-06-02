import React, { useCallback, useEffect, useRef, useState } from 'react'

import useMouseValue from 'hooks/useMouseValue'
import { MotionValue, useMotionValue, useSpring } from 'motion/react'
import { useL10n } from 'provider/L10nProvider'
import Translatable from 'components/translatable/Translatable'
import { formatValue } from 'helpers/units'

import styles from './Rabit.module.scss'
import RabitImg from './components/rabit-img/RabitImg'
import RabitBg from './components/rabit-bg/RabitBg'
import RabitBtn from './components/rabit-btn/RabitBtn'

type TRabit = {
  life: MotionValue<number>
  price: number
  attack: number
}

const Rabit = ({ life, price, attack }: TRabit) => {
  const l10n = useL10n()
  const gameRef = useRef<HTMLDivElement>(null)
  const options = {
    stiffness: 50,
    damping: 10,
    mass: 1
  }

  const mouse = useMouseValue({ absolute: true, ref: gameRef })
  const springX = useSpring(useMotionValue(0), options)
  const springY = useSpring(useMotionValue(0), options)
  const [opacity, setOpacity] = useState(0)

  const handlePositionChange = useCallback(
    (axis: 'x' | 'y', value: number) => {
      const toTop = gameRef.current?.getBoundingClientRect().top ?? 0
      const toLeft = gameRef.current?.getBoundingClientRect().left ?? 0

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
    if (!gameRef.current) return
    const handleMouseLeave = () => setOpacity(0)
    const handleMouseEnter = () => setOpacity(1)

    const element = gameRef.current
    if (!element) return

    element.addEventListener('mouseleave', handleMouseLeave)
    element.addEventListener('mouseenter', handleMouseEnter)

    return () => {
      element.removeEventListener('mouseleave', handleMouseLeave)
      element.removeEventListener('mouseenter', handleMouseEnter)
    }
  }, [])

  return (
    <div className={ styles.rabit }>
      <div ref={ gameRef }>
        <RabitImg life={ life } attack={ attack } />
        <RabitBg opacity={ opacity } springX={ springX } springY={ springY } />
      </div>
      <div className={ styles.rabitDescription }>
        <Translatable parentRef={ gameRef }>
          <RabitBtn
            price={ `${formatValue(price)} ${l10n('UNITS.EURO')}` }
            label={ l10n('ACTIONS.BUY_RABIT') }
          />
        </Translatable>
      </div>
    </div>
  )
}

export default React.memo(Rabit)
