import React, { PropsWithChildren } from 'react'

import classNames from 'classnames'

import Sector from '../sector/Sector'

import styles from './LaboratorySector.module.scss'

type LaboratorySectorProps = PropsWithChildren<{
  className?: string
}>

const LaboratorySector = ({ className, ...props } : LaboratorySectorProps) => {
  return (
    <Sector
      className={ classNames(styles.wrapper, className) }
      { ...props }
    >
      LaboratorySector
    </Sector>
  )
}

export default React.memo(LaboratorySector)
