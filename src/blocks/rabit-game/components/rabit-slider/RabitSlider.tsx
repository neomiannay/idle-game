import React, { useState, useRef, useEffect } from 'react'

import { AnimatePresence, motion } from 'motion/react'
import Chevron from 'components/icons/chevron/Chevron'

import RabitSliderCard from '../rabit-slider-card/RabitSliderCard'

import styles from './RabitSlider.module.scss'

const RabitSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isReady, setIsReady] = useState(false)
  const [currentDir, setCurrentDir] = useState<'left' | 'right' | null>(null)
  const [height, setHeight] = useState<number | 'auto'>('auto')
  const contentRef = useRef<HTMLDivElement>(null)
  const slides = [1, 2, 3]

  const nextSlide = () => {
    setCurrentDir('right')
    requestAnimationFrame(() => {
      setCurrentIndex((p) => ((p ?? 0) + 1) % slides.length)
    })
  }

  const prevSlide = () => {
    setCurrentDir('left')
    requestAnimationFrame(() => {
      setCurrentIndex((p) => ((p ?? 0) - 1 + slides.length) % slides.length)
    })
  }

  useEffect(() => setIsReady(true), [])

  return (
    <div className={ styles.rabitSlider }>
      <button className={ styles.rabitSliderButton } onClick={ prevSlide }>
        <Chevron direction='left' />
      </button>
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
          onAnimationComplete={ () => {
            setHeight(contentRef.current?.offsetHeight ?? 0)
          } }
        >
          <RabitSliderCard power={ 5 } />
        </motion.div>
      </AnimatePresence>
      <button className={ styles.rabitSliderButton } onClick={ nextSlide }>
        <Chevron direction='right' />
      </button>
    </div>
  )
}

export default React.memo(RabitSlider)
