import React from 'react'

import classNames from 'classnames'
import { EGameUnit, ElementType, ItemType, OtherShopElementType, SectorType, UpgradeType } from 'types/store'
import { useSequentialPurchaseState } from 'hooks/useSequentialPurchase'
import { useInventoryContext } from 'provider/InventoryProvider'
import { conjugate, useL10n } from 'provider/L10nProvider'
import { useSectorsProviderContext } from 'provider/SectorsProvider'
import { useShopProviderContext } from 'provider/ShopProvider'
import useElementPurchased from 'hooks/useElementPurchased'
import useCanBuyElement from 'hooks/useCanBuyElement'
import { motion } from 'motion/react'
import { baseTransition, baseVariants, fadeAppear } from 'core/animation'
import { bezier } from 'helpers/easing'
import useItemCount from 'hooks/useItemCount'

import styles from './ShopElement.module.scss'

type ShopElementProps = {
  className?: string;
  elementId: string;
  element: ItemType | UpgradeType | SectorType | OtherShopElementType;
  unitId: EGameUnit;
  type: ElementType;
  onBuyComplete?: () => void;
};

const ShopElement = ({
  className,
  elementId,
  element,
  unitId,
  type,
  onBuyComplete
}: ShopElementProps) => {
  const { shopOpen, translateYValue } = useShopProviderContext()
  const { buyElementFromShop, shouldDisplayElement } = useInventoryContext()
  const { setUnlockedSectors, unlockedSectors } = useSectorsProviderContext()
  const l10n = useL10n()
  const isPurchased = useElementPurchased(unitId, elementId, type)
  const count = useItemCount(unitId, elementId)
  const canPurchase = useCanBuyElement(unitId, elementId, type, count)
  const shouldDisplay = shouldDisplayElement(unitId, elementId, type)
  const sequentiallyPurchasable = useSequentialPurchaseState(
    unitId,
    elementId,
    type
  )

  if (!shouldDisplay || isPurchased) return null

  const isUpgrade = type === 'upgrade'
  const isSector = type === 'sector'
  const rawUnitName = element.cost.unitId.toString().toUpperCase()
  const unitName = `UNITS.${rawUnitName}`
  const buttonTitle = `BUTTONS.${rawUnitName}`

  // Variants qui respectent le stagger du parent
  const shopElementVariants = {
    initial: { y: '30%', opacity: 0 },
    animate: {
      y: '0%',
      opacity: 1
    },
    hover: {
      y: `${translateYValue}px`,
      opacity: 1
    },
    normal: {
      y: '0%',
      opacity: 1
    },
    exit: {
      y: '30%',
      opacity: 0,
      transition: {
        duration: 0.5,
        ease: bezier.quintEaseInOut
      }
    }
  }

  const getEffectText = () => {
    if (isUpgrade) {
      const nextLevel = elementId.replace(/\d+/, (n) => String(Number(n) + 1))
      return `${elementId.toUpperCase()} => ${nextLevel.toUpperCase()}`
    }

    return `1 ${element.cost.unitId}/s`
  }

  const handleSectorClick = () => {
    if (isSector) {
      const sector = element as SectorType
      setUnlockedSectors([...(unlockedSectors || []), sector._id])
    }
  }

  const handleBuyClick = () => {
    buyElementFromShop(unitId, elementId, type)
    handleSectorClick()
    onBuyComplete?.()
  }

  return (
    <motion.div
      className={ classNames(styles.wrapper, className) }
      variants={ shopElementVariants }
      transition={ baseTransition }
    >
      <motion.button
        className={ classNames(styles.container, {
          [styles.unavailable]: !sequentiallyPurchasable || !canPurchase,
          [styles.isSector]: isSector
        }) }
        { ...baseVariants }
        { ...fadeAppear() }
        onClick={ handleBuyClick }
        disabled={ !sequentiallyPurchasable || !canPurchase }
      >
        <div className={ styles.whiteBackground } />
        <div className={ styles.inner }>
          <div className={ styles.content }>
            <h4 className={ styles.title }>{ l10n(element.name) }</h4>
            { !isSector && (
              <span className={ styles.effect }>{ getEffectText() }</span>
            ) }
            <p className={ styles.text }>{ l10n(element.description) }</p>
          </div>
          <div className={ styles.bottom }>
            <span className={ styles.cost }>
              { element.cost.value } <span>({ l10n(conjugate(unitName, element.cost.value)) })</span>
            </span>
            { !isSector && (
              <span className={ styles.unitEffect }>
                { l10n(buttonTitle) }
              </span>
            ) }
          </div>
        </div>
      </motion.button>
    </motion.div>
  )
}

export default ShopElement
