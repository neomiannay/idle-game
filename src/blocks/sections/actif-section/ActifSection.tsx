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
import { useAudioContext } from 'provider/AudioProvider'

import styles from './ActifSection.module.scss'
import { SOUNDS } from 'data/constants'

type ActifSectionProps = {
  className?: string;
  unitId: EGameUnit;
};

const ActifSection = ({ className, unitId }: ActifSectionProps) => {
  const { getUnit, canBuyUnit, buyUnit } = useGameProviderContext()
  const { getItemProduction } = useInventoryContext()
  const { playSound } = useAudioContext()

  const unit = getUnit(unitId)
  if (!unit) return null

  const count = useMotionState(unit.motionValue, (value) => value)
  const canBuy = canBuyUnit(unitId)
  const productionPerSecond = getItemProduction(unitId)

  const notClickedYet = unit.totalMotionValue.get() === 0

  const handleClick = () => {
    if (!canBuy) return
    buyUnit(unitId)
    playSound(SOUNDS.ACTIONS.CATEGORY, SOUNDS.ACTIONS.CLICK_2)
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
              { ...fadeAppear() }
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
      <Button title='BUTTONS.ACTIF' onClick={ handleClick } disabled={ !canBuy } />

      { /* <motion.div
        key='upgrades'
        { ...stagger(0.1, 0.5) }
      > */ }
      <AnimatePresence mode='wait'>
        { !notClickedYet && (
          <motion.div
            key='upgrades'
            { ...baseVariants }
            { ...fadeAppear() }
          >
            <Upgrades unitId={ unitId } />
          </motion.div>
        ) }
      </AnimatePresence>
      { /* </motion.div> */ }

      <Items unitId={ unitId } />
    </div>
  )
}

export default ActifSection
