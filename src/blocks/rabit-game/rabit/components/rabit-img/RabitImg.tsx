import React, { useState, useEffect } from 'react'

import {
  motion,
  AnimatePresence,
  useTransform,
  animate,
  MotionValue
} from 'framer-motion'
import { baseVariants, rabbitAnimation } from 'core/animation'

import styles from './RabitImg.module.scss'

type TRabitImg = {
  life: MotionValue<number>
}

const RabitImg = ({ life }: TRabitImg) => {
  const [images, setImages] = useState<HTMLImageElement[]>([])
  const [index, setIndex] = useState(0)
  const height = useTransform(life, [0, 100], ['0%', '100%'])

  // Load images
  useEffect(() => {
    const imagePaths = [
      'img/rabit/rabit_1.png',
      'img/rabit/rabit_2.png',
      'img/rabit/rabit_3.png',
      'img/rabit/rabit_4.png',
      'img/rabit/rabit_5.png',
      'img/rabit/rabit_6.png'
    ]

    const loadedImages = imagePaths.map((src) => {
      const img = new Image()
      img.src = src
      return img
    })

    setImages(loadedImages)
  }, [])

  // Handle rabbit click
  const onRabitClick = () => {
    const value = index + 1
    if (index < images.length - 1) {
      setIndex(value)
      const res = (value / (images.length - 1)) * 100

      animate(life, res, {
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

export default React.memo(RabitImg)
