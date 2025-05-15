import React, { memo, useState } from 'react'

import classNames from 'classnames'
import Count from 'components/count/Count'
import Button from 'components/button/Button'
import { useGameProviderContext } from 'provider/GameProvider'
import { useInventoryContext } from 'provider/InventoryProvider'
import useMotionState from 'hooks/useMotionState'
import { useL10n } from 'provider/L10nProvider'
import HoldButton from 'components/holdButton/HoldButton'
import AutoSwitch from 'blocks/autoSwitch/AutoSwitch'

import styles from './Section.module.scss'

type SectionProps = {
  className?: string;
  unitId: string;
};

const Section = ({ className, unitId }: SectionProps) => {
  const l10n = useL10n()
  const [autoMode, setAutoMode] = useState(false)
  const {
    getUnit,
    canBuyUnit,
    buyUnit,
    updateUnitDuration,
    updateValueByAction
  } = useGameProviderContext()
  const {
    getElementsForUnit,
    getItemCount,
    getUpgradeCount,
    getItemPurchased,
    getUpgradePurchased,
    canBuyElement,
    buyElement,
    getItemProduction,
    getUnitMultiplier
  } = useInventoryContext()

  const unit = getUnit(unitId)
  if (!unit) return null

  const count = useMotionState(unit.motionValue, (value) => value)
  const canBuy = canBuyUnit(unitId)

  const items = getElementsForUnit(unitId, 'item')
  const upgrades = getElementsForUnit(unitId, 'upgrade')

  const productionPerSecond = getItemProduction(unitId)
  const unitMultiplier = getUnitMultiplier(unitId)

  let actionName = 'Buy'
  if (unitId === 'actif') actionName = 'BUTTONS.ACTIVATE'
  else if (unitId === 'complex') actionName = 'BUTTONS.PRODUCE'
  else if (unitId === 'sale') actionName = 'BUTTONS.SPREAD'

  let unitName = unitId
  if (unitId === 'actif') unitName = 'UNITS.ACTIVE'
  else if (unitId === 'complex') unitName = 'UNITS.COMPLEX'
  else if (unitId === 'sale') unitName = 'UNITS.SALE'

  const handleClick = () => buyUnit(unitId)

  const improveTime = () => {
    if (!canPurchaseTime(10, 'actif')) return
    updateUnitDuration('complex')
  }

  const improveValueByAction = (
    newValue: number,
    unitId: string,
    requiredUnitId: string
  ) => {
    if (!canPurchaseQuantity(newValue, requiredUnitId)) return
    updateValueByAction(unitId)
  }

  // Function to check if previous item has been purchased
  const canPurchaseItemSequentially = (itemId: string) => {
    const itemIds = Object.keys(items)
    const currentIndex = itemIds.indexOf(itemId)

    if (currentIndex === 0) return true // first item so always purchasable

    // Otherwise, check if previous item is purchased
    if (currentIndex > 0) {
      const previousItemId = itemIds[currentIndex - 1]
      return getItemCount(unitId, previousItemId) > 0
    }

    return false
  }

  let costText = ''
  if (unit.costAmount && unit.costAmount > 0 && unit.costUnitId)
    costText = `${unit.costAmount} (${unit.costUnitId})`

  const formattedCount = count

  let formattedSeconds = ''
  let duration = 0
  const complexDuration = unit.duration
  if (complexDuration && unitId === 'complex') {
    duration = useMotionState(complexDuration, (v) => v)

    const seconds = duration / 1000
    formattedSeconds = seconds.toFixed(1)
  }

  let quantity = 1
  const valueByAction = unit.valueByAction
  if (valueByAction && unitId === 'complex')
    quantity = useMotionState(valueByAction, (value) => value)

  const checkPurchaseRequirement = (unitsNeeded: number, rawValue: number) => {
    return rawValue >= unitsNeeded
  }

  const canPurchaseTime = (unitsNeeded: number, unitId: string) => {
    if (duration <= 500) return false
    const unit = getUnit(unitId)
    if (!unit) return false

    return checkPurchaseRequirement(unitsNeeded, unit.rawValue.get())
  }

  const canPurchaseQuantity = (unitsNeeded: number, requiredUnitId: string) => {
    const unit = getUnit(requiredUnitId)
    if (!unit) return false

    return checkPurchaseRequirement(unitsNeeded, unit.rawValue.get())
  }

  return (
    <div className={ classNames(styles.wrapper, className) }>
      <div className={ styles.stepWrapper }>
        <div className={ styles.stepCounter }>
          <Count unit={ unitName } count={ formattedCount } />
          { productionPerSecond > 0 && (
            <span className={ styles.production }>
              [{ productionPerSecond.toFixed(1) }/s]
            </span>
          ) }
        </div>
      </div>
      { unitId === 'complex' ? (
        <>
          <HoldButton label='BUTTONS.PRODUCE' autoMode={ autoMode } />
          <div className={ styles.perfWrapper }>
            <div className={ styles.perf }>
              <div className={ styles.perfBox }>
                <p className={ styles.perfTitle }>Durée d'exécution</p>
                <span className={ styles.perfValue }>{ formattedSeconds } s</span>
              </div>
              <button
                className={ classNames(styles.improvePerf, {
                  [styles.disabled]: !canPurchaseTime(10, 'actif')
                }) }
                onClick={ improveTime }
              >
                <p>-0.5 s</p>
                <p>
                  { unit.costAmount } <span>({ unit.costUnitId })</span>
                </p>
              </button>
            </div>
            <div className={ styles.perf }>
              <div className={ styles.perfBox }>
                <p className={ styles.perfTitle }>Quantité exécutée</p>
                <span className={ styles.perfValue }>{ quantity }</span>
              </div>
              <button
                className={ classNames(styles.improvePerf, {
                  [styles.disabled]: !canPurchaseQuantity(10, 'actif')
                }) }
                onClick={ () => improveValueByAction(10, 'complex', 'actif') }
              >
                <p>+1</p>
                <p>
                  { unit.costAmount } <span>({ unit.costUnitId })</span>
                </p>
              </button>
            </div>
          </div>
        </>
      ) : (
        <Button title={ actionName } onClick={ handleClick } disabled={ !canBuy } />
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

      { /* Items section */ }
      { Object.keys(items).length > 0 && (
        <div className={ styles.itemsSection }>
          <h3 className={ styles.itemsTitle }>Items list</h3>
          <div className={ styles.itemsList }>
            { Object.entries(items).map(([itemId, item]) => {
              const isPurchased = getItemPurchased(unitId, itemId)
              const sequentiallyPurchasable = canPurchaseItemSequentially(itemId)
              const itemCount = getItemCount(unitId, itemId)
              const canPurchase = canBuyElement(unitId, itemId, 'item') && sequentiallyPurchasable

              // console.log(isPurchased)

              if (!isPurchased) return null

              return (
                <div
                  key={ itemId } className={ classNames(styles.item, {
                    [styles.unavailable]: !sequentiallyPurchasable
                  }) }
                >
                  <div className={ styles.line }>
                    <h4 className={ styles.title }>{ l10n(item.name) }</h4>
                    <span className={ styles.count }>{ itemCount }</span>
                  </div>
                  <div className={ styles.line }>
                    <span className={ styles.production }>+{ item.unitByTime }/sec</span>
                    <div className={ styles.purchase }>
                      <Button
                        title='ACTIONS.BUY'
                        onClick={ () => buyElement(unitId, itemId, 'item') }
                        disabled={ !canPurchase }
                      />
                    </div>
                  </div>
                </div>
              )
            }) }
          </div>
        </div>
      ) }

      { unitId === 'complex' && (
        <AutoSwitch value={ autoMode } onToggle={ () => setAutoMode(prev => !prev) } />
      ) }
    </div>
  )
}

export default memo(Section)
