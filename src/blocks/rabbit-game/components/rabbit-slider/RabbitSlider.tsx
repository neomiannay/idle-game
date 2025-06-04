import React, { useState, useRef, useEffect } from 'react'

import { AnimatePresence, motion } from 'motion/react'
import Chevron from 'components/icons/chevron/Chevron'
import { EGamePrice, EGameUnit } from 'types/store'
import classNames from 'classnames'
import Translatable from 'components/translatable/Translatable'
import { formatValue } from 'helpers/units'
import { useL10n } from 'provider/L10nProvider'

import RabbitSliderCard from '../rabbit-slider-card/RabbitSliderCard'
import RabbitBtn from '../rabbit/components/rabbit-btn/RabbitBtn'

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
  onStart: (exp: TRabbitSliderItem) => void;
};

const RabbitSlider = ({ items, onStart }: TRabbitSlider) => {
  const l10n = useL10n()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isReady, setIsReady] = useState(false)
  const [currentDir, setCurrentDir] = useState<'left' | 'right' | null>(null)
  const [height, setHeight] = useState<string | number>('auto')
  const contentRef = useRef<HTMLDivElement>(null)

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
        <RabbitBtn
          price={ `${formatValue(10)} ${l10n('UNITS.EURO')}` }
          label={ l10n('RABIT_GAME.LAYOUT.START_EXP') }
          onClick={ () => onStart(items[currentIndex]) }
        />
      </Translatable>
    </>
  )
}

export default RabbitSlider
