import React from 'react'

import classNames from 'classnames'
import { EGameUnit, ItemType } from 'types/store'
import { conjugate, useL10n } from 'provider/L10nProvider'
import { useInventoryContext } from 'provider/InventoryProvider'
import { useSequentialPurchaseState } from 'hooks/useSequentialPurchase'
import useElementPurchased from 'hooks/useElementPurchased'
import useCanBuyElement from 'hooks/useCanBuyElement'
import useItemCount from 'hooks/useItemCount'
import Button from 'components/button/Button'
import { getItemPrice } from 'helpers/units'
import MaskText from 'components/mask-text/MaskText'

import styles from './Item.module.scss'

type ItemProps = {
  className?: string;
  unitId: EGameUnit;
  itemId: string;
  item: ItemType;
};

const Item = ({ className, unitId, itemId, item }: ItemProps) => {
  const { getElementsForUnit, getItemCount, buyElement } =
    useInventoryContext()
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
  const sequentiallyPurchasable =
    useSequentialPurchaseState(unitId, itemId, 'item') &&
    canPurchaseItemSequentially(itemId)
  const itemCount = useItemCount(unitId, itemId)
  const canPurchase =
    useCanBuyElement(unitId, itemId, 'item', itemCount) && sequentiallyPurchasable

  const cost = getItemPrice(item.cost.value, itemCount)
  const unitName = `UNITS.${item.cost.unitId.toString().toUpperCase()}`
  const costName = `(${l10n(conjugate(unitName, cost))})`

  if (!isPurchased) return null

  return (
    <div
      className={ classNames(styles.wrapper, className, {
        [styles.unavailable]: !sequentiallyPurchasable
      }) }
    >
      <div className={ styles.line }>
        <div className={ styles.information }>
          <h4 className={ styles.title }>{ l10n(item.name) }</h4>
          <span className={ styles.count }>
            <MaskText opened={ false } replayKey={ itemCount }>
              { itemCount }
            </MaskText>
          </span>
        </div>
        <p className={ styles.description }>
          { l10n(item.description) }
          { /* +{ item.unitByTime }/{ l10n('UNITS.SEC') } */ }
        </p>
      </div>
      <Button
        className={ styles.button }
        onClick={ () => buyElement(unitId, itemId, 'item') }
        disabled={ !canPurchase }
        cost={{
          value: cost,
          unit: costName
        }}
        action={ l10n('BUTTONS.BUY') }
      />
    </div>
  )
}

export default Item
