import React, { useState } from 'react'

import {
  motion,
  AnimatePresence,
  useTransform,
  animate,
  MotionValue
} from 'framer-motion'
import { baseVariants, rabbitAnimation } from 'core/animation'
import { clamp } from 'lodash-es'
import { useLoaderContext } from 'provider/LoaderProvider'

import styles from './RabbitImg.module.scss'

type TRabbitImg = {
  life: MotionValue<number>;
  attack: number;
};

let lifeValue = 100

const RabbitImg = ({ life, attack }: TRabbitImg) => {
  const { resources } = useLoaderContext()
  const [index, setIndex] = useState(0)
  const height = useTransform(life, [-1, 0, 100], ['0%', '100%', '0%'])

  const images = [
    resources.rabbit1,
    resources.rabbit2,
    resources.rabbit3,
    resources.rabbit4,
    resources.rabbit5,
    resources.rabbit6
  ] as HTMLImageElement[]

  life.on('change', (value) => {
    if (value >= 100 || value === -1) {
      lifeValue = 100
      setIndex(0)
      height.jump('0%')
    }
  })

  // Handle rabbit click
  const onRabbitClick = () => {
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
    <div className={ styles.rabbitWrapper } onClick={ () => onRabbitClick() }>
      <AnimatePresence mode='wait'>
        <div className={ styles.rabbitContainer }>
          <motion.div key={ index } { ...baseVariants } { ...rabbitAnimation() }>
            <img className={ styles.rabbit } src={ images[index].src } alt='' />
            <motion.div className={ styles.rabbitLife } style={{ height }}>
              <img
                className={ styles.rabbitLifeImg }
                src={ images[index].src }
                alt=''
              />
            </motion.div>
          </motion.div>
        </div>
      </AnimatePresence>
    </div>
  )
}

export default RabbitImg
