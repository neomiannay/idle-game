import React, { useEffect } from 'react'

import { useInventoryContext } from 'provider/InventoryProvider'
import { useGameProviderContext } from 'provider/GameProvider'
import { useUpgradeObserver } from 'hooks/useUpgradeObserver'
import { EGameUnit } from 'types/store'

import ShopMainView from './ShopMainView'
import ShopFirstPurchaseView from './ShopFirstPurchaseView'

const Shop = ({ className }: { className?: string }) => {
  const { canDisplayUnit, units } = useGameProviderContext()
  const { getElementsForUnit, getItemPurchased } = useInventoryContext()
  const { checkForNewUpgrades } = useUpgradeObserver()

  const firstAvailableElement = (Object.keys(units) as EGameUnit[])
    .filter(unitId => canDisplayUnit(unitId))
    .map(unitId => {
      const items = getElementsForUnit(unitId, 'item')
      const firstItemId = Object.keys(items)[0]
      return firstItemId ? {
        unitId,
        elementId: firstItemId,
        isPurchased: getItemPurchased(unitId, firstItemId)
      } : null
    })
    .find(Boolean)

  useEffect(() => checkForNewUpgrades(), [checkForNewUpgrades])

  if (!firstAvailableElement) return null

  return firstAvailableElement.isPurchased ? (
    <ShopMainView className={ className } />
  ) : (
    <ShopFirstPurchaseView
      unitId={ firstAvailableElement.unitId }
      elementId={ firstAvailableElement.elementId }
    />
  )
}

export default Shop
