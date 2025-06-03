import React, { useCallback, useEffect, useRef, useState } from 'react'

import useMouseValue from 'hooks/useMouseValue'
import { MotionValue, useMotionValue, useSpring } from 'motion/react'
import { useL10n } from 'provider/L10nProvider'
import Translatable from 'components/translatable/Translatable'
import { formatValue } from 'helpers/units'
import Tooltip from 'components/tooltip/Tooltip'
import { useGameProviderContext } from 'provider/GameProvider'
import { EGameUnit } from 'types/store'
import classNames from 'classnames'

import styles from './Rabit.module.scss'
import RabitImg from './components/rabit-img/RabitImg'
import RabitBg from './components/rabit-bg/RabitBg'
import RabitBtn from './components/rabit-btn/RabitBtn'

type TRabit = {
  life: MotionValue<number>;
  price: number;
  attack: number;
  onBuy: () => void;
};

const Rabit = ({ life, price, attack, onBuy }: TRabit) => {
  const { units } = useGameProviderContext()
  const benefits = units[EGameUnit.BENEFITS].motionValue

  const l10n = useL10n()
  const gameRef = useRef<HTMLDivElement>(null)
  const descriptionRef = useRef<HTMLDivElement>(null)
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

  const tips = [
    'RABIT_GAME.TIPS.CLICK_0',
    'RABIT_GAME.TIPS.CLICK_1',
    'RABIT_GAME.TIPS.CLICK_2',
    'RABIT_GAME.TIPS.CLICK_3',
    'RABIT_GAME.TIPS.CLICK_4'
  ]

  const canBuy = () => benefits.get() >= price

  return (
    <div className={ classNames(styles.rabit, { [styles.disabled]: !canBuy() }) }>
      <div ref={ gameRef }>
        <Tooltip
          title={ tips[Math.floor(Math.random() * tips.length)] }
          className={ styles.rabitTooltip }
          disabled={ false }
          parent={ gameRef }
          contain
        />
        <RabitImg life={ life } attack={ attack } />
        <RabitBg opacity={ opacity } springX={ springX } springY={ springY } />
      </div>
      { life.get() }
      { life.get() <= 0 && (
        <div ref={ descriptionRef } className={ styles.rabitDescription }>
          <Translatable parentRef={ gameRef } disabled={ !canBuy() }>
            <RabitBtn
              price={ `${formatValue(price)} ${l10n('UNITS.EURO')}` }
              label={ l10n('RABIT_GAME.LAYOUT.BUY_RABIT') }
              onClick={ onBuy }
              disabled={ !canBuy() }
            />
          </Translatable>
          <Tooltip
            title='RABIT_GAME.LAYOUT.NOT_ENOUGH_MONEY'
            className={ styles.rabitTooltipNotEnoughMoney }
            disabled={ canBuy() }
            parent={ descriptionRef }
          />
        </div>
      ) }
    </div>
  )
}

export default Rabit
