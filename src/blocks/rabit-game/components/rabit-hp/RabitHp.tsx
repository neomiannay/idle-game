import React, { useState } from 'react'

import Droplet from 'components/icons/droplet/Droplet'
import { MotionValue } from 'motion/react'
import { clamp } from 'lodash-es'
import classNames from 'classnames'

import styles from './RabitHp.module.scss'

type TRabitHp = {
  life: MotionValue<number>;
  length: number;
  reduce?: boolean;
  className?: string;
};

const RabitHp = ({ life, length, reduce, className }: TRabitHp) => {
  const getLifeValue = () => {
    const value = life.get()
    if (value === -1) return length
    return clamp((value / 100) * length, 1, length)
  }

  const [lifeValue, setLifeValue] = useState(getLifeValue())
  life.on('change', () => setLifeValue(getLifeValue())
  )

  return (
    <div className={ classNames(styles.rabitHp, className) }>
      { new Array(Math.round(reduce ? lifeValue : length)).fill(0).map((_, index) => (
        <Droplet key={ index } active={ index <= lifeValue - 1 } />
      )) }
    </div>
  )
}

export default RabitHp
