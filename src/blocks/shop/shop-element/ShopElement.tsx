import React from 'react'

import classNames from 'classnames'
import { EGameUnit, ElementType, ItemType, UpgradeType } from 'types/store'
import { useSequentialPurchaseState } from 'hooks/useSequentialPurchase'
import { useInventoryContext } from 'provider/InventoryProvider'
import { conjugate, useL10n } from 'provider/L10nProvider'
import useElementPurchased from 'hooks/useElementPurchased'
import useCanBuyElement from 'hooks/useCanBuyElement'

import styles from './ShopElement.module.scss'

type ShopElementProps = {
  elementId: string
  element: ItemType | UpgradeType
  unitId: EGameUnit
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
  let effectText = ''
  if (isUpgrade && (element as UpgradeType).valueByAction !== 0)
    effectText = `+${(element as UpgradeType).valueByAction} par action`
  else if (!isUpgrade && (element as ItemType).unitByTime !== 0)
    effectText = `+${(element as ItemType).unitByTime}/sec`

  const unitName = `UNITS.${element.cost.unitId.toString().toUpperCase()}`

  return (
    <button
      className={ classNames(styles.wrapper, {
        [styles.unavailable]: !sequentiallyPurchasable || !canPurchase
      }) }
      onClick={ () => buyElementFromShop(unitId, elementId, type) }
      disabled={ !sequentiallyPurchasable || !canPurchase }
    >
      <h4 className={ styles.cardName }>{ l10n(element.name) }</h4>
      <p className={ styles.cardEffect }>{ element.description } { effectText }</p>
      <span className={ styles.cardCost }>
        { element.cost.value } <span>({ l10n(conjugate(unitName, element.cost.value)) })</span>
      </span>
    </button>
  )
}

export default React.memo(ShopElement)
