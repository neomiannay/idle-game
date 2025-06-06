import classNames from 'classnames'
import React from 'react'

import styles from './Chevron.module.scss'

type TChevron = {
  direction: 'left' | 'right'
  className?: string
  style?: React.CSSProperties
}

const Chevron = ({ direction, className, style }: TChevron) => {
  const imageSrcMap: Record<TChevron['direction'], string> = {
    left: '/img/rabbit/slider_button_left.svg',
    right: '/img/rabbit/slider_button_right.svg'
  }

  return (
    <img
      src={imageSrcMap[direction]}
      alt={`Chevron ${direction}`}
      width={42}
      className={classNames(styles.wrapper, className, {
        [styles.left]: direction === 'left',
        [styles.right]: direction === 'right'
      })}
      style={style}
    />
  )
}

export default Chevron
