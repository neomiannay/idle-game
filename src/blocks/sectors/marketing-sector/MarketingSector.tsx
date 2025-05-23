import React, { PropsWithChildren } from 'react'

import classNames from 'classnames'

import Sector from '../sector/Sector'

import styles from './MarketingSector.module.scss'

type MarketingSectorProps = PropsWithChildren<{
  className?: string
}>

const MarketingSector = ({ className, ...props } : MarketingSectorProps) => {
  return (
    <Sector
      className={ classNames(styles.wrapper, className) }
      { ...props }
    >
      MarketingSector
    </Sector>
  )
}

export default React.memo(MarketingSector)
