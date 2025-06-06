import React from 'react'

import classNames from 'classnames'
import Count from 'components/count/Count'
import Button from 'components/buy-button/BuyButton'
import { useGameProviderContext } from 'provider/GameProvider'
import { useInventoryContext } from 'provider/InventoryProvider'
import useMotionState from 'hooks/useMotionState'
import { EGameUnit } from 'types/store'
import Upgrades from 'blocks/elements/upgrades/Upgrades'
import Items from 'blocks/elements/items/Items'
import { AnimatePresence, motion } from 'framer-motion'
import { baseVariants, fadeAppear } from 'core/animation'

import styles from './ActifSection.module.scss'

type ActifSectionProps = {
  className?: string;
  unitId: EGameUnit;
};

const ActifSection = ({ className, unitId }: ActifSectionProps) => {
  const { getUnit, canBuyUnit, buyUnit } = useGameProviderContext()
  const { getItemProduction } = useInventoryContext()

  const unit = getUnit(unitId)
  if (!unit) return null

  const count = useMotionState(unit.motionValue, (value) => value)
  const canBuy = canBuyUnit(unitId)
  const productionPerSecond = getItemProduction(unitId)

  const notClickedYet = unit.totalMotionValue.get() === 0

  const handleClick = () => {
    if (!canBuy) return
    buyUnit(unitId)
  }

  return (
    <div className={ classNames(styles.wrapper, className) }>

      <div className={ styles.stepCounter }>
        <AnimatePresence>
          { !notClickedYet && (
            <motion.div
              key='count'
              layout
              { ...baseVariants }
              { ...fadeAppear }
            >
              <Count unitId={ unitId } count={ count } />
            </motion.div>
          ) }
        </AnimatePresence>
        { notClickedYet && (
          <div className={ styles.spacing } />
        ) }
        { /* { productionPerSecond > 0 && (
            <span className={ styles.production }>
              [{ productionPerSecond.toFixed(1) }/s]
            </span>
          ) } */ }
      </div>

      <Button title='BUTTONS.ACTIVATE' onClick={ handleClick } disabled={ !canBuy } />

      <AnimatePresence>
        { !notClickedYet && (
          <motion.div
            key='upgrades'
            layout
            { ...baseVariants }
            { ...fadeAppear }
          >
            <Upgrades unitId={ unitId } />
          </motion.div>
        ) }
      </AnimatePresence>

      <Items unitId={ unitId } />
    </div>
  )
}

export default ActifSection
