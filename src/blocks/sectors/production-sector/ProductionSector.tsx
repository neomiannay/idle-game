import React, { PropsWithChildren } from 'react'

import classNames from 'classnames'

import Sector from '../sector/Sector'

import styles from './ProductionSector.module.scss'

type ProductionSectorProps = PropsWithChildren<{
  className?: string
}>

const ProductionSector = ({ className, ...props } : ProductionSectorProps) => {
  return (
    <Sector
      className={ classNames(styles.wrapper, className) }
      { ...props }
    >
      ProductionSector
    </Sector>
  )
}

export default React.memo(ProductionSector)
