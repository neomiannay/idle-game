import React from 'react'

import classNames from 'classnames'
import { EGameUnit, ElementType, ItemType, UpgradeType } from 'types/store'

import ShopElement from '../shop-element/ShopElement'

import styles from './ShopElements.module.scss'

type ShopElementsProps = {
  className?: string
  elements: Record<string, ItemType | UpgradeType>
  unitId: EGameUnit
  type: ElementType
}

const ShopElements = ({ className, elements, unitId, type }: ShopElementsProps) => {
  return (
    <div className={ classNames(styles.wrapper, className) }>
      { Object.entries(elements).map(([elementId, element]) => (
        <ShopElement
          key={ elementId }
          elementId={ elementId }
          element={ element }
          unitId={ unitId }
          type={ type }
        />
      )) }
    </div>
  )
}

export default React.memo(ShopElements)
