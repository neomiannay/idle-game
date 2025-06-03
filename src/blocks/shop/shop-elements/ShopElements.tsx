import React from 'react'

import { EGameUnit, ElementType, ItemType, SectorType, UpgradeType } from 'types/store'

import ShopElement from '../shop-element/ShopElement'

type ShopElementsProps = {
  elements: Record<string, ItemType | UpgradeType | SectorType>
  unitId: EGameUnit
  type: ElementType
  onElementPurchased?: () => void
}

const ShopElements = ({ elements, unitId, type, onElementPurchased }: ShopElementsProps) => {
  return (
    <React.Fragment key={ unitId }>
      { Object.entries(elements).map(([elementId, element]) => (
        <ShopElement
          key={ elementId }
          elementId={ elementId }
          element={ element }
          unitId={ unitId }
          type={ type }
          onBuyComplete={ onElementPurchased }
        />
      )) }
    </React.Fragment>
  )
}

export default ShopElements
