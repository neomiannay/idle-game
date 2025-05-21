import React, { memo } from 'react'

import classNames from 'classnames'
import Count from 'components/count/Count'
import Button from 'components/button/Button'
import { useGameProviderContext } from 'provider/GameProvider'
import { useInventoryContext } from 'provider/InventoryProvider'
import useMotionState from 'hooks/useMotionState'
import { EGameUnit } from 'types/store'
import Upgrades from 'blocks/section/upgrades/Upgrades'
import Items from 'blocks/section/items/Items'

import styles from './ActifSection.module.scss'

type ActifSectionProps = {
  className?: string;
};

const ActifSection = ({ className }: ActifSectionProps) => {
  const { getUnit, canBuyUnit, buyUnit } = useGameProviderContext()
  const { getItemProduction } = useInventoryContext()

  const unitId = EGameUnit.ACTIF

  const unit = getUnit(unitId)
  if (!unit) return null

  const count = useMotionState(unit.motionValue, (value) => value)
  const canBuy = canBuyUnit(unitId)
  const productionPerSecond = getItemProduction(unitId)

  const unitName = `UNITS.${unitId.toString().toUpperCase()}`

  const handleClick = () => {
    if (!canBuy) return
    buyUnit(unitId)
  }

  return (
    <div className={ classNames(styles.wrapper, className) }>
      <div className={ styles.stepWrapper }>
        <div className={ styles.stepCounter }>
          <Count unit={ unitName } count={ count } />
          { productionPerSecond > 0 && (
            <span className={ styles.production }>
              [{ productionPerSecond.toFixed(1) }/s]
            </span>
          ) }
        </div>
      </div>
      <div className={ styles.buttonContainer }>
        <Button title='BUTTONS.ACTIVATE' onClick={ handleClick } disabled={ !canBuy } />
      </div>

      <Upgrades unitId={ unitId } />
      <Items unitId={ unitId } />
    </div>
  )
}

export default memo(ActifSection)
