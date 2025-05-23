import React, { memo } from 'react'

import classNames from 'classnames'
import Count from 'components/count/Count'
import Button from 'components/button/Button'
import { useGameProviderContext } from 'provider/GameProvider'
import { useInventoryContext } from 'provider/InventoryProvider'
import useMotionState from 'hooks/useMotionState'
import { EGameUnit, EStatus } from 'types/store'
import { useFeedbackContext } from 'provider/FeedbackProvider'
import SaleFeedback from 'components/sale-feedback/SaleFeedback'
import Upgrades from 'blocks/elements/upgrades/Upgrades'
import Items from 'blocks/elements/items/Items'

import styles from './SaleSection.module.scss'

type SaleSectionProps = {
  className?: string;
  unitId: EGameUnit;
};

const SaleSection = ({ className, unitId }: SaleSectionProps) => {
  const { getUnit, canBuyUnit, buyUnit, isSaleSuccessful } = useGameProviderContext()
  const { getItemProduction } = useInventoryContext()
  const { feedback, setFeedback, triggerFeedback, setSuccessCount, setFailCount } = useFeedbackContext()

  const unit = getUnit(unitId)
  if (!unit) return null

  const count = useMotionState(unit.motionValue, (value) => value)
  const canBuy = canBuyUnit(unitId)
  const productionPerSecond = getItemProduction(unitId)

  const unitName = `UNITS.${unitId.toString().toUpperCase()}`

  const handleClick = () => {
    if (!canBuy) return
    if (isSaleSuccessful()) {
      buyUnit(unitId)
      triggerFeedback(EStatus.SUCCESS)
      setSuccessCount(1)
      setFailCount(0)
    } else {
      triggerFeedback(EStatus.FAIL)
      setSuccessCount(0)
      setFailCount(1)
    }
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
      <div className={ styles.buttonContainer }>
        <Button title='BUTTONS.SPREAD' onClick={ handleClick } disabled={ !canBuy } />
        { feedback && (
          <SaleFeedback
            key={ feedback.key }
            status={ feedback.status }
            onDone={ () => {
              setSuccessCount(0)
              setFailCount(0)
              setFeedback(null)
            } }
          />
        ) }
      </div>

      <Upgrades unitId={ unitId } />
      <Items unitId={ unitId } />
    </div>
  )
}

export default memo(SaleSection)
