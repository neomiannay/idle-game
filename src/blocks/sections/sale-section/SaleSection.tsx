import React from 'react'

import classNames from 'classnames'
import Count from 'components/count/Count'
import Button from 'components/buy-button/BuyButton'
import { useGameProviderContext } from 'provider/GameProvider'
import useMotionState from 'hooks/useMotionState'
import { EGameUnit, EStatus } from 'types/store'
import { useFeedbackContext } from 'provider/FeedbackProvider'
import SaleFeedback from 'components/sale-feedback/SaleFeedback'
import Upgrades from 'blocks/elements/upgrades/Upgrades'
import Items from 'blocks/elements/items/Items'
import { useAudioContext } from 'provider/AudioProvider'
import { SOUNDS } from 'data/constants'

import styles from './SaleSection.module.scss'

type SaleSectionProps = {
  className?: string;
  unitId: EGameUnit;
};

const SaleSection = ({ className, unitId }: SaleSectionProps) => {
  const { getUnit, canBuyUnit, buyUnit, isSaleSuccessful } = useGameProviderContext()
  const { feedback, setFeedback, triggerFeedback, setSuccessCount, setFailCount } = useFeedbackContext()
  const { playSound } = useAudioContext()

  const unit = getUnit(unitId)
  if (!unit) return null

  const count = useMotionState(unit.motionValue, (value) => value)

  const rawUnitName = unitId.toString().toUpperCase()

  const reactiveCanBuy = useMotionState(unit.motionValue, () => canBuyUnit(unitId))

  const handleClick = () => {
    if (!reactiveCanBuy) return
    if (isSaleSuccessful()) {
      buyUnit(unitId)
      triggerFeedback(EStatus.SUCCESS)
      setSuccessCount(1)
      setFailCount(0)
      playSound(SOUNDS.ACTIONS.CATEGORY, SOUNDS.ACTIONS.CLICK_SUCCESS)
    } else {
      triggerFeedback(EStatus.FAIL)
      setSuccessCount(0)
      setFailCount(1)
      playSound(SOUNDS.ACTIONS.CATEGORY, SOUNDS.ACTIONS.CLICK_FAIL)
    }
  }

  return (
    <div className={ classNames(styles.wrapper, className) }>
      <div className={ styles.stepCounter }>
        <Count unitId={ unitId } count={ count } />
        { /* { productionPerSecond > 0 && (
          <span className={ styles.production }>
            [{ productionPerSecond.toFixed(1) }/s]
          </span>
        ) } */ }
      </div>
      <div className={ styles.buttonContainer }>
        <Button title={ `BUTTONS.${rawUnitName}` } onClick={ handleClick } disabled={ !reactiveCanBuy } />
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

export default SaleSection
