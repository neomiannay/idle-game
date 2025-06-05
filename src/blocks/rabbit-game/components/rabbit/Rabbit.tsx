import React, { useEffect, useRef, useState } from 'react'

import useMouseValue from 'hooks/useMouseValue'
import {
  AnimatePresence,
  motion,
  MotionValue,
  useMotionValue,
  useSpring
} from 'motion/react'
import { useL10n } from 'provider/L10nProvider'
import Translatable from 'components/translatable/Translatable'
import { formatValue } from 'helpers/units'
import Tooltip from 'components/tooltip/Tooltip'
import { useGameProviderContext } from 'provider/GameProvider'
import { EGameUnit } from 'types/store'
import classNames from 'classnames'
import useMotionState from 'hooks/useMotionState'
import { fadeAppear } from 'core/animation'

import RabbitHp from '../rabbit-hp/RabbitHp'

import styles from './Rabbit.module.scss'
import RabbitImg from './components/rabbit-img/RabbitImg'
import RabbitBg from './components/rabbit-bg/RabbitBg'
import RabbitBtn from './components/rabbit-btn/RabbitBtn'

type TRabbit = {
  life: MotionValue<number>;
  price: number;
  attack: number;
  isRabbitDead: boolean;
};

const Rabbit = ({ life, price, attack, isRabbitDead }: TRabbit) => {
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

  const onPositionChange = (axis: 'x' | 'y', value: number) => {
    if (!gameRef.current) return

    const toTop = gameRef.current.getBoundingClientRect().top
    const toLeft = gameRef.current.getBoundingClientRect().left

    const springValue = axis === 'x' ? value - toLeft : value - toTop
    const spring = axis === 'x' ? springX : springY

    spring.set(springValue)
  }

  useEffect(() => {
    mouse.x.on('change', (value) => onPositionChange('x', value))
    mouse.y.on('change', (value) => onPositionChange('y', value))
  }, [mouse.x, mouse.y])

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

  const canBuy = useMotionState(benefits, (v) => v >= price)
  const tips = [
    'RABBIT_GAME.TIPS.CLICK_0',
    'RABBIT_GAME.TIPS.CLICK_1',
    'RABBIT_GAME.TIPS.CLICK_2',
    'RABBIT_GAME.TIPS.CLICK_3',
    'RABBIT_GAME.TIPS.CLICK_4'
  ]

  return (
    <div className={ classNames(styles.rabbit, { [styles.disabled]: !canBuy || life.get() > -1 }) }>
      <div className={ styles.rabbitHpWrapper }>
        { !isRabbitDead && (
          <motion.div { ...fadeAppear() }>
            <RabbitHp life={ life } length={ 6 } />
          </motion.div>
        )}
      </div>
      <div ref={ gameRef } className={ styles.rabbitWrapper }>
        <Tooltip
          title={ tips[Math.floor(Math.random() * tips.length)] }
          className={ styles.rabbitTooltip }
          disabled={ false }
          parent={ gameRef }
          contain
        />
        <RabbitImg life={ life } attack={ attack } />
        <RabbitBg opacity={ opacity } springX={ springX } springY={ springY } />
      </div>
      <div
        ref={ descriptionRef }
        className={ styles.rabbitDescription }
        style={{ pointerEvents: !isRabbitDead ? 'none' : 'auto' }}
      >
      </div>
    </div>
  )
}

export default Rabbit
