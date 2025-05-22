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
      { Object.entries(items).map(([itemId, item]) => (
        <Item
          key={ itemId }
          unitId={ unitId }
          itemId={ itemId }
          item={ item }
        />)
      ) }
    </div>
  )
}

export default Items
