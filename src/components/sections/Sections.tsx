import React, { PropsWithChildren } from 'react'

import classNames from 'classnames'
import { useGameProviderContext } from 'provider/GameProvider'
import Section from 'components/section/Section'

import styles from './Sections.module.scss'

type SectionsProps = PropsWithChildren<{
  className?: string
}>

const Sections = ({ className, ...props } : SectionsProps) => {
  const { canDisplayUnit, units } = useGameProviderContext()

  const unitIds = Object.keys(units).filter(
    (unitId) => unitId !== 'benefits' && unitId !== 'reputation'
  )

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
