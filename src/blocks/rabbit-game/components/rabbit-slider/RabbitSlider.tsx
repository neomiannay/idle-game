import React, { useState, useRef, useEffect } from 'react'

import { animate, AnimatePresence, motion, MotionValue } from 'framer-motion'
import Chevron from 'components/icons/chevron/Chevron'
import { EGamePrice, EGameUnit } from 'types/store'
import classNames from 'classnames'
import Translatable from 'components/translatable/Translatable'
import { formatValue } from 'helpers/units'
import { useL10n } from 'provider/L10nProvider'

import RabbitSliderCard from '../rabbit-slider-card/RabbitSliderCard'
import RabbitBtn from '../rabbit/components/rabbit-btn/RabbitBtn'

import styles from './RabbitSlider.module.scss'
import { baseVariants, fadeAppearRabbit } from 'core/animation'
import { useGameProviderContext } from 'provider/GameProvider'
import rabbits from 'data/games/rabbits.json'
import { RABBIT_LIFE } from 'data/constants'
import { clamp } from 'lodash-es'

export type TRabbitSliderItemValue = {
  value: number;
  target: EGameUnit | EGamePrice;
};

export type TRabbitSliderItem = {
  id: string;
  disabled: boolean;
  name: string;
  description: string;
  power: number;
  values: TRabbitSliderItemValue[];
};

type TRabbitSlider = {
  items: TRabbitSliderItem[];
  setCurrentExp: (exp: TRabbitSliderItem) => void;
  isRabbitDead: boolean;
  life: MotionValue<number>;
  rabbitPrice: number;
  testPrice: number;
  setRabbitPrice: (price: number) => void;
};

let lifeValue = RABBIT_LIFE

const RabbitSlider = ({ items, setCurrentExp, isRabbitDead, life, rabbitPrice, testPrice, setRabbitPrice }: TRabbitSlider) => {
  const l10n = useL10n()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isReady, setIsReady] = useState(false)
  const [currentDir, setCurrentDir] = useState<'left' | 'right' | null>(null)
  const [height, setHeight] = useState<string | number>('auto')
  const contentRef = useRef<HTMLDivElement>(null)

  const { hasEnoughUnits, modifyUnitValue, applyChoiceEffects } = useGameProviderContext()


  const nextSlide = () => {
    setCurrentDir('right')
    requestAnimationFrame(() => {
      setCurrentIndex((p) => ((p ?? 0) + 1) % items.length)
    })
  }

  const prevSlide = () => {
    setCurrentDir('left')
    requestAnimationFrame(() => {
      setCurrentIndex((p) => ((p ?? 0) - 1 + items.length) % items.length)
    })
  }

  const handleSetHeight = () => {
    const value = contentRef.current?.offsetHeight ?? 0
    setHeight(value)
  }

  useEffect(() => setIsReady(true), [])
  useEffect(() => handleSetHeight(), [])

  const handleBuy = () => {
    if (!hasEnoughUnits(rabbitPrice, EGameUnit.BENEFITS)) return
    if (life.get() <= 0) {
      setRabbitPrice(rabbitPrice * rabbits.factor)
      modifyUnitValue(EGameUnit.BENEFITS, -rabbitPrice)
      life.set(RABBIT_LIFE)
    }
  }

    const handleStart = (exp: TRabbitSliderItem) => {
    if (!hasEnoughUnits(testPrice, EGameUnit.BENEFITS)) return

    modifyUnitValue(EGameUnit.BENEFITS, -testPrice)
    applyChoiceEffects(exp.values)

    setCurrentExp(exp)

    if(lifeValue <= 0)
      lifeValue = RABBIT_LIFE


    const prevLifeValue = lifeValue
    lifeValue -= exp.power

    if (lifeValue !== prevLifeValue) {
      // Update life value directly
      life.set(clamp(lifeValue, 0, RABBIT_LIFE))
    }
  }

  const  canBuyRabbit = hasEnoughUnits(rabbitPrice, EGameUnit.BENEFITS)
  const  canBuyTest = hasEnoughUnits(testPrice, EGameUnit.BENEFITS)

  return (
    <>
      <div className={ styles.rabbitSlider }>
        { items.length > 1 && (
          <button
            className={ classNames(
              styles.rabbitSliderButton,
              styles.rabbitSliderButtonLeft
            ) }
            onClick={ prevSlide }
          >
            <Chevron direction='left' />
          </button>
        ) }
        <AnimatePresence mode='wait'>
          <motion.div
            key={ currentIndex }
            ref={ contentRef }
            transition={{
              duration: isReady ? 0.25 : 0,
              ease: 'easeInOut'
            }}
            initial={{
              x: currentDir === 'left' ? '100%' : '-100%',
              opacity: 0,
              height
            }}
            animate={{
              x: 0,
              opacity: 1,
              height: 'auto'
            }}
            exit={{
              x: currentDir === 'left' ? '-100%' : '100%',
              opacity: 0,
              height
            }}
            onAnimationComplete={ handleSetHeight }
            className={ styles.rabbitSliderContent }
            style={{
              padding: items.length > 1 ? '0' : '0 16rem'
            }}
          >
            <RabbitSliderCard item={ items[currentIndex] } />
          </motion.div>
        </AnimatePresence>
        { items.length > 1 && (
          <button
            className={ classNames(
              styles.rabbitSliderButton,
              styles.rabbitSliderButtonRight
            ) }
            onClick={ nextSlide }
          >
            <Chevron direction='right' />
          </button>
        ) }
      </div>
      <Translatable className={ styles.rabbitSliderStart }>

        { (isRabbitDead || life.get() === null) ? (
          <motion.div { ...baseVariants } { ...fadeAppearRabbit }>
            {/* <Translatable parentRef={ gameRef } disabled={ !canBuy }> */}
              <RabbitBtn
                price={ `${formatValue(rabbitPrice)} ${l10n('UNITS.EURO')}` }
                label={ l10n('RABBIT_GAME.LAYOUT.BUY_RABBIT') }
                onClick={ handleBuy }
                disabled={ !canBuyRabbit }
              />
            {/* </Translatable> */}
            {/* <Tooltip
              title='RABBIT_GAME.LAYOUT.NOT_ENOUGH_MONEY'
              className={ styles.rabbitTooltipNotEnoughMoney }
              disabled={ canBuy }
              parent={ descriptionRef }
            /> */}
          </motion.div>
        ) : (
        <RabbitBtn
          price={ `${formatValue(testPrice)} ${l10n('UNITS.EURO')}` }
          label={ l10n('RABBIT_GAME.LAYOUT.START_EXP') }
          onClick={ () => handleStart(items[currentIndex]) }
          disabled={ !canBuyTest }
        />
        ) }
      </Translatable>
    </>
  )
}

export default RabbitSlider
