import React, { memo } from 'react'

import classNames from 'classnames'
import { EGameUnit, ItemType } from 'types/store'
import { conjugate, useL10n } from 'provider/L10nProvider'
import { useInventoryContext } from 'provider/InventoryProvider'
import { useSequentialPurchaseState } from 'hooks/useSequentialPurchase'
import useElementPurchased from 'hooks/useElementPurchased'
import useCanBuyElement from 'hooks/useCanBuyElement'
import useItemCount from 'hooks/useItemCount'

import styles from './Item.module.scss'

type ItemProps = {
  className?: string
  unitId: EGameUnit
  itemId: string
  item: ItemType
}

const Item = ({ className, unitId, itemId, item }: ItemProps) => {
  const { getElementsForUnit, getItemCount, buyElement } = useInventoryContext()
  const l10n = useL10n()

  const items = getElementsForUnit(unitId, 'item')

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

  const isPurchased = useElementPurchased(unitId, itemId, 'item')
  const sequentiallyPurchasable = useSequentialPurchaseState(unitId, itemId, 'item') && canPurchaseItemSequentially(itemId)
  const itemCount = useItemCount(unitId, itemId)
  const canPurchase = useCanBuyElement(unitId, itemId, 'item') && sequentiallyPurchasable

  const unitName = `UNITS.${item.cost.unitId.toString().toUpperCase()}`
  const costName = `(${l10n(conjugate(unitName, item.cost.value))})`

  if (!isPurchased) return null

  return (
    <div className={ classNames(styles.wrapper, className, {
      [styles.unavailable]: !sequentiallyPurchasable
    }) }
    >
      <div className={ styles.line }>
        <div className={ styles.information }>
          <h4 className={ styles.title }>{ l10n(item.name) }</h4>
          <p className={ styles.description }>{ item.description } +{ item.unitByTime }/sec</p>
        </div>
        <span className={ styles.count }>{ itemCount }</span>
      </div>
      <button
        className={ styles.buyButton }
        onClick={ () => buyElement(unitId, itemId, 'item') }
        disabled={ !canPurchase }
      >
        <span className={ styles.costValue }>{ item.cost.value }</span>
        <span>{ costName }</span>
      </button>
    </div>
  )
}

export default memo(Item)
