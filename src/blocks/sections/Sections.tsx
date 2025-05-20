import React, { PropsWithChildren } from 'react'

import classNames from 'classnames'
import { useGameProviderContext } from 'provider/GameProvider'
import { EGameUnit } from 'types/store'

import styles from './Sections.module.scss'
import ActifSection from './actif-section/ActifSection'
import ComplexSection from './complex-section/ComplexSection'
import SaleSection from './sale-section/SaleSection'

type SectionsProps = PropsWithChildren<{
  className?: string
}>

const Sections = ({ className, ...props } : SectionsProps) => {
  const { canDisplayUnit } = useGameProviderContext()

  return (
    <div className={ classNames(styles.wrapper, className) } { ...props }>
      { canDisplayUnit(EGameUnit.ACTIF) && (<ActifSection />) }
      { canDisplayUnit(EGameUnit.COMPLEX) && (<ComplexSection />) }
      { canDisplayUnit(EGameUnit.SALE) && (<SaleSection />) }
    </div>
  )
}

export default React.memo(Sections)
