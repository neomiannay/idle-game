import React, { memo, useEffect } from 'react'

import classNames from 'classnames'
import Button from 'components/button/Button'
import { useInventoryContext } from 'provider/InventoryProvider'
import { useGameProviderContext } from 'provider/GameProvider'
import { useL10n } from 'provider/L10nProvider'
import { useSequentialPurchase } from 'hooks/useSequentialPurchase'
import { useUpgradeObserver } from 'hooks/useUpgradeObserver'

import styles from './Shop.module.scss'

type ShopProps = {
  className?: string
}

const Shop = ({ className }: ShopProps) => {
  const { canDisplayUnit, units } = useGameProviderContext()
  const {
    getElementsForUnit,
    canBuyElement,
    buyElementFromShop,
    shouldDisplayElement,
    getItemPurchased,
    getUpgradePurchased
  } = useInventoryContext()
  const { canPurchaseElementSequentially } = useSequentialPurchase()
  const { checkForNewUpgrades } = useUpgradeObserver()
  const l10n = useL10n()

  useEffect(() => {
    checkForNewUpgrades()
  }, [checkForNewUpgrades])

  const unitIds = Object.keys(units)

  return (
    <aside className={ classNames(styles.wrapper, className) }>
      { unitIds.map(unitId => {
        if (!canDisplayUnit(unitId)) return null

        const items = getElementsForUnit(unitId, 'item')
        const upgrades = getElementsForUnit(unitId, 'upgrade')

        const hasElements = Object.keys(items).length > 0 || Object.keys(upgrades).length > 0

        // console.log(items?.ami?.purchased.get())

        if (!hasElements) return null

        return (
          <div key={ unitId } className={ styles.unitSection }>
            <div className={ styles.cards }>
              { /* Upgrades */ }
              { /* { Object.entries(upgrades).map(([upgradeId, upgrade]) => {
                const shouldDisplay = shouldDisplayElement(unitId, upgradeId, 'upgrade')
                const canPurchase = canBuyElement(unitId, upgradeId, 'upgrade')
                const sequentiallyPurchasable = canPurchaseElementSequentially(unitId, upgradeId, 'upgrade')
                const isPurchased = getUpgradePurchased(unitId, upgradeId)

                if (!shouldDisplay || isPurchased) return null

                return (
                  <div
                    key={ upgradeId }
                    className={ classNames(styles.card, {
                      [styles.purchased]: isPurchased,
                      [styles.unavailable]: !sequentiallyPurchasable
                    }) }
                  >
                    <div className={ styles.cardInfo }>
                      <h4 className={ styles.cardName }>{ l10n(upgrade.name) }</h4>
                      <p className={ styles.cardEffect }>+{ upgrade.valueByAction - 1 }x multiplier</p>
                    </div>

                    { isPurchased ? (
                      <div className={ styles.purchasedBadge }>Purchased</div>
                    ) : (
                      <div className={ styles.purchaseAction }>
                        <Button
                          title='ACTIONS.BUY'
                          onClick={ () => buyElementFromShop(unitId, upgradeId, 'upgrade') }
                          disabled={ !canPurchase }
                        />
                        <span className={ styles.cardCost }>
                          { upgrade.cost.value } { upgrade.cost.unitId }
                        </span>
                      </div>
                    ) }
                  </div>
                )
              }) } */ }

              { /* Items */ }
              { Object.entries(items).map(([itemId, item]) => {
                const shouldDisplay = shouldDisplayElement(unitId, itemId, 'item')
                const canPurchase = canBuyElement(unitId, itemId, 'item')
                const sequentiallyPurchasable = canPurchaseElementSequentially(unitId, itemId, 'item')
                const isPurchased = getItemPurchased(unitId, itemId)

                console.log(isPurchased)

                if (!shouldDisplay || isPurchased) return null

                return (
                  <div
                    key={ itemId }
                    className={ classNames(styles.card, {
                      [styles.purchased]: isPurchased,
                      [styles.unavailable]: !sequentiallyPurchasable
                    }) }
                  >
                    <div className={ styles.cardInfo }>
                      <h4 className={ styles.cardName }>{ l10n(item.name) }</h4>
                      <p className={ styles.cardEffect }>+{ item.unitByTime }/sec</p>
                    </div>
                    <div className={ styles.purchaseAction }>
                      <Button
                        title='ACTIONS.BUY'
                        onClick={ () => buyElementFromShop(unitId, itemId, 'item') }
                        disabled={ !canPurchase }
                      />
                      <span className={ styles.cardCost }>
                        { item.cost.value } { item.cost.unitId }
                      </span>
                    </div>
                  </div>
                )
              }) }

            </div>
          </div>
        )
      }) }
    </aside>
  )
}

export default memo(Shop)
