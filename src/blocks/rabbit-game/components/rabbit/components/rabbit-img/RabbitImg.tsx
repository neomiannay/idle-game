import React, { useState } from 'react'

import {
  motion,
  AnimatePresence,
  useTransform,
  MotionValue,
  useMotionValueEvent
} from 'framer-motion'
import { baseVariants, rabbitAnimation } from 'core/animation'
import { useLoaderContext } from 'provider/LoaderProvider'
import { RABBIT_LIFE } from 'data/constants'

import styles from './RabbitImg.module.scss'

type TRabbitImg = {
  life: MotionValue<number>;
};

const RabbitImg = ({ life }: TRabbitImg) => {
  const { resources } = useLoaderContext()
  const [index, setIndex] = useState(0)
  const height = useTransform(life, [0, RABBIT_LIFE], ['100%', '0%'])

  const images = [
    resources.rabbit1,
    resources.rabbit2,
    resources.rabbit3,
    resources.rabbit4,
    resources.rabbit5,
    resources.rabbit6
  ] as HTMLImageElement[]

  useMotionValueEvent(life, 'change', (value) => {
    if (value >= RABBIT_LIFE || value < 0) {
      setIndex(0)
    } else {
      const newIndex = Math.floor(
        ((RABBIT_LIFE - value) / RABBIT_LIFE) * (images.length - 1)
      )
      setIndex(Math.max(0, Math.min(newIndex, images.length - 1)))
    }
  })

  return (
    <div className={ styles.rabbitWrapper }>
      <AnimatePresence mode='wait'>
        <div className={ styles.rabbitContainer }>
          <motion.div key={ height.get() } { ...baseVariants } { ...rabbitAnimation() }>
            <img className={ styles.rabbit } src={ images[index]?.src } alt='' />
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
