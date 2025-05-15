import React, { PropsWithChildren } from 'react'

import classNames from 'classnames'
import { useGameProviderContext } from 'provider/GameProvider'
import Section from 'blocks/section/Section'
import { EGameUnit } from 'types/store'

import styles from './Sections.module.scss'

type SectionsProps = PropsWithChildren<{
  className?: string
}>

const Sections = ({ className, ...props } : SectionsProps) => {
  const { canDisplayUnit, units } = useGameProviderContext()

  const unitIds = Object.keys(units).filter(
    (unitId) => unitId !== EGameUnit.BENEFITS && unitId !== EGameUnit.REPUTATION
  ) as EGameUnit[]

  return (
    <div className={ classNames(styles.wrapper, className) } { ...props }>
      { unitIds.map((unitId) => (
        canDisplayUnit(unitId) && (
          <Section key={ unitId } unitId={ unitId } />
        )
      )) }
    </div>
  )
}

export default React.memo(Sections)
