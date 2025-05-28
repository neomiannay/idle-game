import React, { useMemo } from 'react'

import { motion, AnimatePresence } from 'framer-motion'
import classNames from 'classnames'
import { useGameProviderContext } from 'provider/GameProvider'
import { EGameUnit } from 'types/store'
import { baseVariants, fadeAppear } from 'core/animation'

import styles from './Sections.module.scss'
import ActifSection from './actif-section/ActifSection'
import ComplexSection from './complex-section/ComplexSection'
import SaleSection from './sale-section/SaleSection'

const Components = {
  [EGameUnit.ACTIF]: ActifSection,
  [EGameUnit.COMPLEX]: ComplexSection,
  [EGameUnit.SALE]: SaleSection
}

const Sections = ({ className }: { className?: string }) => {
  const { canDisplayUnit } = useGameProviderContext()

  const activeSections = useMemo(() => {
    return Object.entries(Components).filter(([unitId]) => canDisplayUnit(unitId as EGameUnit))
  }, [canDisplayUnit])

  const layoutClass =
    activeSections.length === 1
      ? styles.center
      : activeSections.length === 2
        ? styles.dual
        : styles.triple

  return (
    <motion.div layout className={ classNames(styles.wrapper, className, layoutClass) }>
      <AnimatePresence>
        { activeSections.map(([unitId, Component], index) => (
          <motion.div
            key={ unitId }
            layout
            { ...baseVariants }
            { ...fadeAppear }
          >
            <Component unitId={ unitId as EGameUnit } className={ styles[`section${index + 1}`] } />
          </motion.div>
        )) }
      </AnimatePresence>
    </motion.div>
  )
}

export default React.memo(Sections)
