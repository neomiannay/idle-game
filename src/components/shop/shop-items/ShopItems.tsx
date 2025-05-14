import React from 'react'

import classNames from 'classnames'
import { ItemType } from 'types/store'

import ShopItem from '../shop-item/ShopItem'

import styles from './ShopItems.module.scss'

type ShopItemsProps = {
  className?: string
  items: Record<string, ItemType>
  unitId: string
}

const ShopItems = ({ className, items, unitId }: ShopItemsProps) => {
  return (
    <div className={ classNames(styles.wrapper, className) }>
      { Object.entries(items).map(([itemId, item]) => (
        <ShopItem
          key={ itemId }
          itemId={ itemId }
          item={ item }
          unitId={ unitId }
        />
      )) }
    </div>
  )
}

export default React.memo(ShopItems)
