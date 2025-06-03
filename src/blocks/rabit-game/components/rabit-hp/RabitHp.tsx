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
  const [lifeValue, setLifeValue] = useState(clamp((life.get() / 100) * length, 1, length))

  life.on('change', (v) => {
    setLifeValue(clamp((v / 100) * length, 1, length))
  })

  return (
    <div className={ classNames(styles.rabitHp, className) }>
      { new Array(reduce ? lifeValue : length).fill(0).map((_, index) => (
        <Droplet key={ index } active={ index <= lifeValue - 1 } />
      )) }
    </div>
  )
}

export default RabitHp
