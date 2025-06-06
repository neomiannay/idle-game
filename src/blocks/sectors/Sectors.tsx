import React, { PropsWithChildren } from 'react'

import classNames from 'classnames'
import { EGameSector } from 'types/store'
import { useSectorsProviderContext } from 'provider/SectorsProvider'
import { motion } from 'motion/react'

import styles from './Sectors.module.scss'
import ProductionSector from './production-sector/ProductionSector'
import MarketingSector from './marketing-sector/MarketingSector'
import LaboratorySector from './laboratory-sector/LaboratorySector'

type SectorsProps = PropsWithChildren<{
  className?: string
}>

const Components = {
  [EGameSector.PRODUCTION]: ProductionSector,
  [EGameSector.LABORATORY]: LaboratorySector,
  [EGameSector.PUBLICITY]: MarketingSector
}

const Sectors = ({ className, ...props } : SectorsProps) => {
  const { reactiveCurrentSector } = useSectorsProviderContext()

  const Component = Components[reactiveCurrentSector]

  return (
    <motion.div className={ classNames(styles.wrapper, className) } { ...props }>
      <Component />
    </motion.div>
  )
}

export default Sectors
