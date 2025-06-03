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
  attack: number
}

let lifeValue = 100
const imagePaths = [
  'img/rabit/rabit_6.png',
  'img/rabit/rabit_5.png',
  'img/rabit/rabit_4.png',
  'img/rabit/rabit_3.png',
  'img/rabit/rabit_2.png',
  'img/rabit/rabit_1.png'
]

const RabitImg = ({ life, attack }: TRabitImg) => {
  const [images, setImages] = useState<HTMLImageElement[]>([])
  const [index, setIndex] = useState(imagePaths.length - 1)
  const height = useTransform(life, [0, 100], ['100%', '0%'])

  // Load images
  useEffect(() => {
    const loadedImages = imagePaths.map((src) => {
      const img = new Image()
      img.src = src
      return img
    })

    setImages(loadedImages)
  }, [])

  // Handle rabbit click
  const onRabitClick = () => {
    const prevLifeValue = lifeValue
    lifeValue -= attack
    const newIndex = Math.floor((lifeValue / 100) * images.length)

    if (lifeValue !== prevLifeValue) {
      setIndex(Math.max(0, newIndex))
      animate(life, Math.max(0, lifeValue), {
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
