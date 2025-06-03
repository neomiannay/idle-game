import React from 'react'

import { EGameUnit, ElementType, ItemType, UpgradeType } from 'types/store'

import ShopElement from '../shop-element/ShopElement'

type ShopElementsProps = {
  className?: string
  elements: Record<string, ItemType | UpgradeType>
  unitId: EGameUnit
  type: ElementType
}

const ShopElements = ({ className, elements, unitId, type }: ShopElementsProps) => {
  return (
    <React.Fragment key={ unitId }>
      { Object.entries(elements).map(([elementId, element]) => (
        <ShopElement
          key={ elementId }
          elementId={ elementId }
          element={ element }
          unitId={ unitId }
          type={ type }
        />
      )) }
    </React.Fragment>
  )
}

export default ShopElements
