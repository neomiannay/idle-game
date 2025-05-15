import React from 'react'

import classNames from 'classnames'
import { useItemPurchased } from 'hooks/useElementPurchased'
import { useSequentialPurchase } from 'hooks/useSequentialPurchase'
import { useInventoryContext } from 'provider/InventoryProvider'
import { useL10n } from 'provider/L10nProvider'
import { ItemType } from 'types/store'
import Button from 'components/button/Button'

import styles from './ShopItem.module.scss'

type ShopItemProps = {
  itemId: string
  item: ItemType
  unitId: string
}

const ShopItem = ({ itemId, item, unitId }: ShopItemProps) => {
  const { canBuyElement, buyElementFromShop, shouldDisplayElement } = useInventoryContext()
  const { canPurchaseElementSequentially } = useSequentialPurchase()
  const l10n = useL10n()
  const isPurchased = useItemPurchased(unitId, itemId)

  const shouldDisplay = shouldDisplayElement(unitId, itemId, 'item')
  const canPurchase = canBuyElement(unitId, itemId, 'item')
  const sequentiallyPurchasable = canPurchaseElementSequentially(unitId, itemId, 'item')

  if (!shouldDisplay || isPurchased) return null

  return (
    <div
      className={ classNames(styles.wrapper, {
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
}

export default React.memo(ShopItem)
