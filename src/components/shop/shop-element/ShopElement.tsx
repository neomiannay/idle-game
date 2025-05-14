import React from 'react'

import classNames from 'classnames'
import { ElementType, ItemType, UpgradeType } from 'types/store'
import { useSequentialPurchaseState } from 'hooks/useSequentialPurchase'
import { useInventoryContext } from 'provider/InventoryProvider'
import { useL10n } from 'provider/L10nProvider'
import Button from 'components/button/Button'
import useElementPurchased from 'hooks/useElementPurchased'
import useCanBuyElement from 'hooks/useCanBuyElement'

import styles from './ShopElement.module.scss'

type ShopElementProps = {
  elementId: string
  element: ItemType | UpgradeType
  unitId: string
  type: ElementType
}

const ShopElement = ({ elementId, element, unitId, type }: ShopElementProps) => {
  const { buyElementFromShop, shouldDisplayElement } = useInventoryContext()
  const l10n = useL10n()
  const isPurchased = useElementPurchased(unitId, elementId, type)
  const canPurchase = useCanBuyElement(unitId, elementId, type)

  const shouldDisplay = shouldDisplayElement(unitId, elementId, type)
  const sequentiallyPurchasable = useSequentialPurchaseState(unitId, elementId, type)

  // console.log(elementId, type, sequentiallyPurchasable)

  if (!shouldDisplay || isPurchased) return null

  const isUpgrade = type === 'upgrade'
  const effectText = isUpgrade
    ? `+${(element as UpgradeType).valueByAction - 1}x multiplier`
    : `+${(element as ItemType).unitByTime}/sec`

  return (
    <div
      className={ classNames(styles.wrapper, {
        [styles.unavailable]: !sequentiallyPurchasable
      }) }
    >
      <div className={ styles.cardInfo }>
        <h4 className={ styles.cardName }>{ l10n(element.name) }</h4>
        <p className={ styles.cardEffect }>{ effectText }</p>
      </div>
      <div className={ styles.purchaseAction }>
        <Button
          title='ACTIONS.BUY'
          onClick={ () => buyElementFromShop(unitId, elementId, type) }
          disabled={ !canPurchase }
        />
        <span className={ styles.cardCost }>
          { element.cost.value } { element.cost.unitId }
        </span>
      </div>
    </div>
  )
}

export default React.memo(ShopElement)
