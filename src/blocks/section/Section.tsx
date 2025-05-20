import React, { memo } from 'react'

import classNames from 'classnames'
import Count from 'components/count/Count'
import Button from 'components/button/Button'
import { useGameProviderContext } from 'provider/GameProvider'
import { useInventoryContext } from 'provider/InventoryProvider'
import useMotionState from 'hooks/useMotionState'
import { useL10n } from 'provider/L10nProvider'
import { EGameUnit, EStatus } from 'types/store'
import SaleFeedback from 'components/sale-feedback/SaleFeedback'
import ReputationIndicator from 'components/reputation-indicator/ReputationIndicator'
import { useFeedbackContext } from 'provider/FeedbackProvider'
import ComplexSection from 'blocks/section/complex-section/ComplexSection'

import styles from './Section.module.scss'
import Items from './items/Items'

type SectionProps = {
  className?: string;
  unitId: EGameUnit;
};

const Section = ({ className, unitId }: SectionProps) => {
  const l10n = useL10n()
  const { feedback, setFeedback, triggerFeedback, setSuccessCount, setFailCount } = useFeedbackContext()

  const { getUnit, canBuyUnit, buyUnit, isSaleSuccessful } = useGameProviderContext()
  const { getElementsForUnit, getUpgradePurchased, getItemProduction } = useInventoryContext()

  const unit = getUnit(unitId)
  if (!unit) return null

  const count = useMotionState(unit.motionValue, (value) => value)
  const canBuy = canBuyUnit(unitId)

  const upgrades = getElementsForUnit(unitId, 'upgrade')

  const productionPerSecond = getItemProduction(unitId)

  let actionName = 'Buy'
  if (unitId === EGameUnit.ACTIF) actionName = 'BUTTONS.ACTIVATE'
  else if (unitId === EGameUnit.COMPLEX) actionName = 'BUTTONS.PRODUCE'
  else if (unitId === EGameUnit.SALE) actionName = 'BUTTONS.SPREAD'

  const unitName = `UNITS.${unitId.toString().toUpperCase()}`

  const handleClick = () => {
    if (!canBuy) return
    if (unitId === EGameUnit.SALE) {
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
    } else {
      buyUnit(unitId)
    }
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
      { unitId === EGameUnit.COMPLEX ? (
        <ComplexSection unitId={ EGameUnit.COMPLEX } />
      ) : (
        <div className={ styles.buttonContainer }>
          <Button title={ actionName } onClick={ handleClick } disabled={ !canBuy } />
          { unitId === EGameUnit.SALE && feedback && (
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
      ) }

      { unitId === EGameUnit.SALE && (
        <ReputationIndicator />
      ) }

      { /* Purchased Upgrades Display */ }
      { Object.keys(upgrades).length > 0 && (
        <div className={ styles.purchasedUpgradesSection }>
          <div className={ styles.purchasedUpgradesList }>
            { Object.entries(upgrades).map(([upgradeId, upgrade]) => {
              const isPurchased = getUpgradePurchased(unitId, upgradeId)

              if (!isPurchased) return null

              return (
                <div key={ upgradeId } className={ styles.purchasedUpgrade }>
                  <div className={ styles.upgradeIcon }>✓</div>
                  <div className={ styles.upgradeInfo }>
                    <b className={ styles.upgradeName }>{ l10n(upgrade.name) }</b>
                    <span className={ styles.upgradeEffect }>
                      +{ upgrade.valueByAction - 1 }x multiplier
                    </span>
                  </div>
                </div>
              )
            }) }
          </div>
        </div>
      ) }

      <Items unitId={ unitId } />
    </div>
  )
}

export default memo(Section)
