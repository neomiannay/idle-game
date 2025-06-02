import React from 'react'

import classNames from 'classnames'
import GradientText from 'components/gradient-text/GradientText'

import styles from './RabitBtn.module.scss'

type RabitBtnProps = {
  price: string;
  label: string;
  className?: string;
  props?: React.HTMLAttributes<HTMLDivElement>;
};

const RabitBtn = ({ price, label, className, ...props }: RabitBtnProps) => {
  return (
    <div { ...props } className={ classNames(styles.btn, className) }>
      <div className={ styles.btnLeft }>{ price }</div>
      <GradientText
        className={ styles.btnRight }
        startColor='var(--fill-20-100)'
        endColor='var(--color-white)'
        duration={ 3 }
      >
        { label }
      </GradientText>
    </div>
  )
}

export default React.memo(RabitBtn)
