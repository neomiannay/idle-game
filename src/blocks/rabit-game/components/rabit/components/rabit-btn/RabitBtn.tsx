import React from 'react'

import classNames from 'classnames'
import GradientText from 'components/gradient-text/GradientText'

import styles from './RabitBtn.module.scss'

type RabitBtnProps = {
  price: string;
  label: string;
  className?: string;
  props?: React.HTMLAttributes<HTMLDivElement>;
  onClick?: () => void;
  disabled?: boolean;
};

const RabitBtn = ({
  price,
  label,
  className,
  onClick,
  disabled,
  ...props
}: RabitBtnProps) => {
  return (
    <button
      type='button'
      { ...props }
      className={ classNames(styles.btn, className) }
      onClick={ onClick }
      disabled={ disabled }
    >
      <div className={ styles.btnLeft }>{ price }</div>
      <GradientText
        disabled={ disabled }
        className={ styles.btnRight }
        startColor='var(--fill-40-100)'
        endColor='var(--color-white)'
        duration={ 3 }
      >
        { label }
      </GradientText>
    </button>
  )
}

export default RabitBtn
