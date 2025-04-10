import React, { memo } from 'react'

import classNames from 'classnames'
import Count from 'components/count/Count'
import Button from 'components/button/Button'
import { useGameProviderContext } from 'provider/GameProvider'
import { useInventoryContext } from 'provider/InventoryProvider'
import useMotionState from 'hooks/useMotionState'
import { useL10n } from 'provider/L10nProvider'

import styles from './Section.module.scss'

type SectionProps = {
  className?: string
  unitId: string
}

const Section = ({ className, unitId }: SectionProps) => {
  const l10n = useL10n()
  const { getUnit, canBuyUnit, buyUnit } = useGameProviderContext()
  const {
    getElementsForUnit,
    getItemCount,
    getUpgradeCount,
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
  else if (unitId === 'excipient') actionName = 'BUTTONS.HOLD'
  else if (unitId === 'complex') actionName = 'BUTTONS.SPREAD'

  let unitName = unitId.toUpperCase()
  if (unitId === 'actif') unitName = 'UNITS.ACTIVE'
  else if (unitId === 'excipient') unitName = 'UNITS.EXCIPIENT'
  else if (unitId === 'complex') unitName = 'UNITS.COMPLEX'

  const handleClick = () => {
    buyUnit(unitId)
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
    costText = `${unit.costAmount} ${unit.costUnitId}`

  const formattedCount = count

  return (
    <div className={ classNames(styles.wrapper, className) }>
      <div className={ styles.unitSection }>
        <Count unit={ unitName } count={ formattedCount } />
        <Button
          title={ actionName }
          onClick={ handleClick }
          disabled={ !canBuy }
        />
        <span>{ costText }</span>

        { productionPerSecond > 0 && (
          <div className={ styles.production }>
            +{ productionPerSecond.toFixed(1) }/sec
          </div>
        ) }
        { unitMultiplier > 1 && (
          <div className={ styles.multiplier }>
            x{ unitMultiplier.toFixed(2) }
          </div>
        ) }
      </div>

      { /* Purchased Upgrades Display */ }
      { Object.keys(upgrades).length > 0 && (
        <div className={ styles.purchasedUpgradesSection }>
          <h3>Active Upgrades</h3>
          <div className={ styles.purchasedUpgradesList }>
            { Object.entries(upgrades).map(([upgradeId, upgrade]) => {
              const isPurchased = getUpgradeCount(unitId, upgradeId) > 0

              if (!isPurchased) return null

              return (
                <div key={ upgradeId } className={ styles.purchasedUpgrade }>
                  <div className={ styles.upgradeIcon }>✓</div>
                  <div className={ styles.upgradeInfo }>
                    <b className={ styles.upgradeName }>{ l10n(upgrade.name) }</b>
                    <span className={ styles.upgradeEffect }>+{ upgrade.valueByAction - 1 }x multiplier</span>
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
          <h3>Items</h3>
          <div className={ styles.itemsList }>
            { Object.entries(items).map(([itemId, item]) => {
              const itemCount = getItemCount(unitId, itemId)
              const isSequentiallyPurchasable = canPurchaseItemSequentially(itemId)
              const canPurchase = canBuyElement(unitId, itemId, 'item') && isSequentiallyPurchasable

              return (
                <div
                  key={ itemId } className={ classNames(styles.item, {
                    [styles.unavailable]: !isSequentiallyPurchasable
                  }) }
                >
                  <div className={ styles.itemInfo }>
                    <b className={ styles.itemName }>{ l10n(item.name) }</b>
                    <span className={ styles.itemCount }> Owned: { itemCount }</span>
                    <span className={ styles.itemProduction }>+{ item.unitByTime }/sec</span>
                  </div>
                  <div className={ styles.itemPurchase }>
                    <Button
                      title='ACTIONS.BUY'
                      onClick={ () => buyElement(unitId, itemId, 'item') }
                      disabled={ !canPurchase }
                    />
                    <span className={ styles.itemCost }>
                      { item.cost.value } { item.cost.unitId }
                    </span>
                  </div>
                </div>
              )
            }) }
          </div>
        </div>
      ) }
    </div>
  )
}

export default memo(Section)
