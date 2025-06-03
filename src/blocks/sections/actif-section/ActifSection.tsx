import React, { memo } from 'react'

import classNames from 'classnames'
import Count from 'components/count/Count'
import Button from 'components/button/Button'
import { useGameProviderContext } from 'provider/GameProvider'
import { useInventoryContext } from 'provider/InventoryProvider'
import useMotionState from 'hooks/useMotionState'
import { EGameUnit } from 'types/store'
import Upgrades from 'blocks/elements/upgrades/Upgrades'
import Items from 'blocks/elements/items/Items'

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

  const rawUnitName = unitId.toString().toUpperCase()
  const unitName = `UNITS.${unitId.toString().toUpperCase()}`

  const handleClick = () => {
    if (!canBuy) return
    buyUnit(unitId)
  }

  return (
    <div className={ classNames(styles.wrapper, className) }>
      <div className={ styles.stepCounter }>
        <Count unit={ unitName } count={ count } />
        { /* { productionPerSecond > 0 && (
            <span className={ styles.production }>
              [{ productionPerSecond.toFixed(1) }/s]
            </span>
          ) } */ }
      </div>
      <Button title={ `BUTTONS.${rawUnitName}` } onClick={ handleClick } disabled={ !canBuy } />

      <Upgrades unitId={ unitId } />
      <Items unitId={ unitId } />
    </div>
  )
}

export default memo(ActifSection)
