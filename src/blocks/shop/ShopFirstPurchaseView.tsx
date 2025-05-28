import React from 'react'

import { useInventoryContext } from 'provider/InventoryProvider'
import classNames from 'classnames'
import { EGameUnit } from 'types/store'

import styles from './Shop.module.scss'
import ShopElement from './shop-element/ShopElement'

type Props = {
  unitId: EGameUnit
  elementId: string
  className?: string
}

const ShopFirstPurchaseView = ({ unitId, elementId, className }: Props) => {
  const { getElementsForUnit } = useInventoryContext()
  const element = getElementsForUnit(unitId, 'item')[elementId]

  return (
    <aside className={ classNames(styles.wrapper, className) }>
      <ShopElement
        elementId={ elementId }
        element={ element }
        unitId={ unitId }
        type='item'
      />
    </aside>
  )
}

export default ShopFirstPurchaseView
