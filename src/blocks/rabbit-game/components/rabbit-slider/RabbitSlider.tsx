import React, { useState, useRef, useEffect } from 'react'

import { AnimatePresence, motion, MotionValue } from 'framer-motion'
import Chevron from 'components/icons/chevron/Chevron'
import { EGamePrice, EGameUnit } from 'types/store'
import classNames from 'classnames'
import { formatValue } from 'helpers/units'
import { useL10n } from 'provider/L10nProvider'
import { useGameProviderContext } from 'provider/GameProvider'
import { BUY_RABBIT_ITEM_ID, RABBIT_LIFE } from 'data/constants'
import { clamp } from 'lodash-es'

import rabbits from 'data/games/rabbits.json'

import RabbitBtn from '../rabbit/components/rabbit-btn/RabbitBtn'
import RabbitSliderCard from '../rabbit-slider-card/RabbitSliderCard'

import styles from './RabbitSlider.module.scss'

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
  rabbitPrice: number | null;
  testPrice: number;
  setRabbitPrice: (price: number) => void;
};

let lifeValue = RABBIT_LIFE

const RabbitSlider = ({
  items,
  setCurrentExp,
  isRabbitDead,
  life,
  rabbitPrice,
  testPrice,
  setRabbitPrice
}: TRabbitSlider) => {
  const l10n = useL10n()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isReady, setIsReady] = useState(false)
  const [currentDir, setCurrentDir] = useState<'left' | 'right' | null>(null)
  const [height, setHeight] = useState<string | number>('auto')
  const contentRef = useRef<HTMLDivElement>(null)

  const { hasEnoughUnits, modifyUnitValue, applyChoiceEffects } =
    useGameProviderContext()

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

    if (rabbitPrice && !hasEnoughUnits(rabbitPrice, EGameUnit.BENEFITS)) return

    if (life.get() <= 0 && rabbitPrice) {
      setRabbitPrice(rabbitPrice * rabbits.factor)
      modifyUnitValue(EGameUnit.BENEFITS, -rabbitPrice)
      life.set(RABBIT_LIFE)
      setCurrentExp(items[0])
    }

  }

  const handleStart = (exp: TRabbitSliderItem) => {

    if (!hasEnoughUnits(testPrice, EGameUnit.BENEFITS)) {

    }

    modifyUnitValue(EGameUnit.BENEFITS, -testPrice)
    applyChoiceEffects(exp.values)

    setCurrentExp(exp)

    if (lifeValue <= 0) lifeValue = RABBIT_LIFE

    const prevLifeValue = lifeValue
    lifeValue -= exp.power

    if (lifeValue !== prevLifeValue) {
      // Update life value directly
      life.set(clamp(lifeValue, 0, RABBIT_LIFE))
    }

  }

  const canBuyRabbit =
    rabbitPrice && hasEnoughUnits(rabbitPrice, EGameUnit.BENEFITS)
  const canBuyTest = hasEnoughUnits(testPrice, EGameUnit.BENEFITS)

  if (isRabbitDead)
    items = items.filter((item) => item.id === BUY_RABBIT_ITEM_ID)
  else items = items.filter((item) => item.id !== BUY_RABBIT_ITEM_ID)

  useEffect(() => {
    if (currentIndex >= items.length)
      setCurrentIndex(0)
  }, [items, currentIndex, isRabbitDead])

  const price = isRabbitDead ? rabbitPrice : testPrice

  console.log('RabbitSlider render', rabbitPrice);


  return (
    <div className={ styles.controlPanel }>
      { (isRabbitDead || life.get() === null) && rabbitPrice ? (
        <RabbitBtn
          price={ `${formatValue(rabbitPrice)} ${l10n('UNITS.EURO')}` }
          label='exécuter le lapin'
          onClick={handleBuy}
          disabled={ !canBuyRabbit }
        />
      ) : (
        <RabbitBtn
          price={ `${formatValue(testPrice)} ${l10n('UNITS.EURO')}` }
          label='exécuter'
          onClick={ () => handleStart(items[currentIndex]) }
          disabled={ !canBuyTest }
        />
      ) }
      <div className={ styles.rabbitSlider }>
        <button
          className={ classNames(
            styles.rabbitSliderButton,
            styles.rabbitSliderButtonLeft
          ) }
          onClick={ prevSlide }
        >
          <Chevron direction='left' />
        </button>
        <div className={ styles.sliderBackground }>
          <AnimatePresence mode='wait'>
            <motion.div
              key={ `${currentIndex}-${items.map((item) => item.id).join('-')}` }
              ref={ contentRef }
              transition={{
                duration: isReady ? 0.25 : 0,
                ease: 'easeInOut'
              }}
              initial={{
                x: currentDir === 'left' ? '5%' : '-5%',
                opacity: 0
              }}
              animate={{
                x: 0,
                opacity: 1
              }}
              exit={{
                x: currentDir === 'left' ? '-5%' : '5%',
                opacity: 0
              }}
              onAnimationComplete={ handleSetHeight }
              className={ styles.rabbitSliderContent }
            >
              { items[currentIndex] && (
                <RabbitSliderCard
                  item={ items[currentIndex] }
                  isRabbitDead={ isRabbitDead }
                  price={ price }
                />
              ) }
            </motion.div>
          </AnimatePresence>
        </div>
        <button
          className={ classNames(
            styles.rabbitSliderButton,
            styles.rabbitSliderButtonRight
          ) }
          onClick={ nextSlide }
        >
          <Chevron direction='right' />
        </button>
      </div>
    </div>
  )
}

export default RabbitSlider
