import React, { PropsWithChildren } from 'react'

import classNames from 'classnames'
import { EGameSector } from 'types/store'
import { useSectorsProviderContext } from 'provider/SectorsProvider'

import styles from './Sectors.module.scss'
import ProductionSector from './production-sector/ProductionSector'
import MarketingSector from './marketing-sector/MarketingSector'
import LaboratorySector from './laboratory-sector/LaboratorySector'

type SectorsProps = PropsWithChildren<{
  className?: string
}>

const Components = {
  [EGameSector.PRODUCTION]: ProductionSector,
  [EGameSector.SAHUR]: MarketingSector,
  [EGameSector.TRALALERO]: LaboratorySector
}

const Sectors = ({ className, ...props } : SectorsProps) => {
  const { reactiveCurrentSector } = useSectorsProviderContext()

  const Component = Components[reactiveCurrentSector]

  return (
    <div className={ classNames(styles.wrapper, className) } { ...props }>
      <Component />
    </div>
  )
}

export default React.memo(Sectors)
