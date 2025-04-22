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
  const l10n = useL10n()
  const { getElementsForUnit, canBuyElement, buyElement, getUpgradeCount, shouldDisplayElement } = useInventoryContext()
  const { canDisplayUnit, units } = useGameProviderContext()
  const { canPurchaseElementSequentially } = useSequentialPurchase()

  const { checkForNewUpgrades } = useUpgradeObserver()

  useEffect(() => {
    checkForNewUpgrades()
  }, [checkForNewUpgrades])

  const unitIds = Object.keys(units)

  return (
    <aside className={ classNames(styles.wrapper, className) }>
      { unitIds.map(unitId => {
        if (!canDisplayUnit(unitId)) return null

        const upgrades = getElementsForUnit(unitId, 'upgrade')
        if (Object.keys(upgrades).length === 0) return null

        let unitName = unitId.toUpperCase()
        if (unitId === 'actif') unitName = 'UNITS.ACTIVE'
        else if (unitId === 'complex') unitName = 'UNITS.COMPLEX'
        else if (unitId === 'sale') unitName = 'UNITS.SALE'

        return (
          <div key={ unitId } className={ styles.unitSection }>
            <h3 className={ styles.unitTitle }>{ l10n(unitName) }</h3>

            <div className={ styles.upgradeCards }>
              { Object.entries(upgrades).map(([upgradeId, upgrade]) => {
                const shouldDisplay = shouldDisplayElement(unitId, upgradeId, 'upgrade')
                const canPurchase = canBuyElement(unitId, upgradeId, 'upgrade')
                const sequentiallyPurchasable = canPurchaseElementSequentially(unitId, upgradeId, 'upgrade')
                const isPurchased = getUpgradeCount(unitId, upgradeId) > 0
                if (!shouldDisplay) return null

                return (
                  <div
                    key={ upgradeId }
                    className={ classNames(styles.upgradeCard, {
                      [styles.purchased]: isPurchased,
                      [styles.unavailable]: !sequentiallyPurchasable
                    }) }
                  >
                    <div className={ styles.upgradeInfo }>
                      <h4 className={ styles.upgradeName }>{ l10n(upgrade.name) }</h4>
                      <p className={ styles.upgradeEffect }>+{ upgrade.valueByAction - 1 }x multiplier</p>
                    </div>

                    { isPurchased ? (
                      <div className={ styles.purchasedBadge }>Purchased</div>
                    ) : (
                      <div className={ styles.purchaseAction }>
                        <Button
                          title='ACTIONS.BUY'
                          onClick={ () => buyElement(unitId, upgradeId, 'upgrade') }
                          disabled={ !canPurchase }
                        />
                        <span className={ styles.upgradeCost }>
                          { upgrade.cost.value } { upgrade.cost.unitId }
                        </span>
                      </div>
                    ) }
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
