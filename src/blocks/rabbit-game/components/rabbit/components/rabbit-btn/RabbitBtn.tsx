import React from 'react'

import classNames from 'classnames'
import GradientText from 'components/gradient-text/GradientText'

import styles from './RabbitBtn.module.scss'

type RabbitBtnProps = {
  price: string;
  label: string;
  className?: string;
  props?: React.HTMLAttributes<HTMLDivElement>;
  onClick?: () => void;
  disabled?: boolean;
};

const RabbitBtn = ({
  price,
  label,
  className,
  onClick,
  disabled,
  ...props
}: RabbitBtnProps) => {
  return (
    <div className={ styles.wrapper }>
      <button
        type='button'
        { ...props }
        className={ classNames(styles.btn, className) }
        onClick={ onClick }
        disabled={ disabled }
      >
        <GradientText
          disabled={ disabled }
          className={ styles.btnRight }
          startColor='var(--fill-40)'
          endColor='var(--color-white)'
          duration={ 3 }
        >
          { label }
        </GradientText>
        <img src='img/rabbit/button_background.svg' className={ styles.background } />
      </button>
    </div>
  )
}

export default RabbitBtn
