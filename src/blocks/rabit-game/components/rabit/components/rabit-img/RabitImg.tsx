import React, { useState, useEffect } from 'react'

import {
  motion,
  AnimatePresence,
  useTransform,
  animate,
  MotionValue
} from 'framer-motion'
import { baseVariants, rabbitAnimation } from 'core/animation'
import { clamp } from 'lodash-es'

import styles from './RabitImg.module.scss'

type TRabitImg = {
  life: MotionValue<number>;
  attack: number;
};

let lifeValue = 100
const imagePaths = [
  'img/rabit/rabit_6.png',
  'img/rabit/rabit_5.png',
  'img/rabit/rabit_4.png',
  'img/rabit/rabit_3.png',
  'img/rabit/rabit_2.png',
  'img/rabit/rabit_1.png'
].reverse()

const RabitImg = ({ life, attack }: TRabitImg) => {
  const [images, setImages] = useState<HTMLImageElement[]>([])
  const [index, setIndex] = useState(0)
  const height = useTransform(life, [-1, 0, 100], ['0%', '100%', '0%'])

  // Load images
  useEffect(() => {
    const loadedImages = imagePaths.map((src) => {
      const img = new Image()
      img.src = src
      return img
    })

    setImages(loadedImages)
  }, [])

  life.on('change', (value) => {
    if (value >= 100 || value === -1) {
      lifeValue = 100
      setIndex(0)
      height.jump('0%')
    }
  })

  // Handle rabbit click
  const onRabitClick = () => {
    const prevLifeValue = lifeValue
    lifeValue -= attack
    const newIndex = Math.floor(
      ((100 - lifeValue) / 100) * (images.length - 1)
    )

    if (lifeValue !== prevLifeValue) {
      setIndex(clamp(newIndex, 0, images.length - 1))

      // Update life value directly
      life.set(clamp(lifeValue, 0, 100))

      // Animate the height value with spring
      animate(height, `${100 - clamp(lifeValue, 0, 100)}%`, {
        duration: 0.2,
        type: 'spring'
      })
    }
  }

  return (
    <div className={ styles.rabitWrapper } onClick={ () => onRabitClick() }>
      <AnimatePresence mode='wait'>
        <div className={ styles.rabitContainer }>
          <motion.div key={ index } { ...baseVariants } { ...rabbitAnimation() }>
            <img className={ styles.rabit } src={ images[index]?.src } alt='' />
            <motion.div className={ styles.rabitLife } style={{ height }}>
              <img
                className={ styles.rabitLifeImg }
                src={ images[index]?.src }
                alt=''
              />
            </motion.div>
          </motion.div>
        </div>
      </AnimatePresence>
    </div>
  )
}

export default RabitImg
