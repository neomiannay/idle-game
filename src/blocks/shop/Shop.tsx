import React, { useEffect } from 'react'

import { useInventoryContext } from 'provider/InventoryProvider'
import { useGameProviderContext } from 'provider/GameProvider'
import { useShopProviderContext } from 'provider/ShopProvider'
import { useUpgradeObserver } from 'hooks/useUpgradeObserver'
import { EGameUnit } from 'types/store'
import { AnimatePresence, motion } from 'motion/react'
import { baseVariants, fadeAppear, stagger } from 'core/animation'

import ShopMainView from './ShopMainView'
import ShopFirstPurchaseView from './ShopFirstPurchaseView'
import styles from './Shop.module.scss'

const Shop = ({ className }: { className?: string }) => {
  const { canDisplayUnit, units } = useGameProviderContext()
  const { getElementsForUnit, getItemPurchased } = useInventoryContext()
  const { checkForNewUpgrades } = useUpgradeObserver()
  const { motionWrapperRef, setShopOpen } = useShopProviderContext()

  const firstAvailableElement = (Object.keys(units) as EGameUnit[])
    .filter((unitId) => canDisplayUnit(unitId))
    .map((unitId) => {
      const items = getElementsForUnit(unitId, 'item')
      const firstItemId = Object.keys(items)[0]
      return firstItemId
        ? {
            unitId,
            elementId: firstItemId,
            isPurchased: getItemPurchased(unitId, firstItemId)
          }
        : null
    })
    .find(Boolean)

  useEffect(() => checkForNewUpgrades(), [checkForNewUpgrades])

  if (!firstAvailableElement) return null

  return (
    <div
      className={ styles.wrapper }
      style={ !firstAvailableElement.isPurchased
        ? {
            bottom: 0,
            top: 'unset'
          }
        : undefined }
    >
      <AnimatePresence>
        { firstAvailableElement.isPurchased ? (
          <motion.div
            key='shop-main'
            ref={ motionWrapperRef }
            className={ styles.motionWrapper }
            { ...baseVariants }
            { ...fadeAppear() }
            { ...stagger(0.1, 0.4) }
            onMouseEnter={ () => setShopOpen(true) }
            onMouseLeave={ () => setShopOpen(false) }
          >
            <ShopMainView
              className={ className }
              motionWrapperRef={ motionWrapperRef }
            />
          </motion.div>
        ) : (
          <motion.div
            key='shop-first'
            { ...baseVariants }
            { ...fadeAppear() }
          >
            <ShopFirstPurchaseView
              unitId={ firstAvailableElement.unitId }
              elementId={ firstAvailableElement.elementId }
            />
          </motion.div>
        ) }
      </AnimatePresence>
    </div>
  )
}

export default Shop
