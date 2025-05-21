import React from 'react'

import classNames from 'classnames'
import { EGameUnit } from 'types/store'
import { useInventoryContext } from 'provider/InventoryProvider'

import Item from '../item/Item'

import styles from './Items.module.scss'

type ItemsProps = {
  className?: string
  unitId: EGameUnit
}

const Items = ({ className, unitId }: ItemsProps) => {
  const { getElementsForUnit } = useInventoryContext()

  const items = getElementsForUnit(unitId, 'item')

  return (
    <div className={ classNames(styles.wrapper, className) }>
      { Object.keys(items).length > 0 && (
        <div className={ styles.itemsSection }>
          <h3 className={ styles.itemsTitle }>Items list</h3>
          <div className={ styles.itemsList }>
            { Object.entries(items).map(([itemId, item]) => (
              <Item
                key={ itemId }
                unitId={ unitId }
                itemId={ itemId }
                item={ item }
              />)
            ) }
          </div>
        </div>
      ) }
    </div>
  )
}

export default Items
