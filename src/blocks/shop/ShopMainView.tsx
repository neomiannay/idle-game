import React from 'react'

import classNames from 'classnames'
import { useGameProviderContext } from 'provider/GameProvider'
import { useInventoryContext } from 'provider/InventoryProvider'
import { EGameUnit } from 'types/store'

import ShopElements from './shop-elements/ShopElements'
import styles from './Shop.module.scss'

type Props = {
  className?: string
}

const ShopMainView = ({ className }: Props) => {
  const { canDisplayUnit, units } = useGameProviderContext()
  const { getElementsForUnit } = useInventoryContext()
  const unitIds = Object.keys(units) as EGameUnit[]

  return (
    <>
      <h2 className={ styles.title }>Projets</h2>
      <aside className={ classNames(styles.wrapper, className) }>
        { unitIds.map((unitId) => {
          if (!canDisplayUnit(unitId)) return null

          const items = getElementsForUnit(unitId, 'item')
          const upgrades = getElementsForUnit(unitId, 'upgrade')
          const hasElements =
            Object.keys(items).length > 0 || Object.keys(upgrades).length > 0

          if (!hasElements) return null

          return (
            <React.Fragment key={ unitId }>
              <ShopElements elements={ upgrades } unitId={ unitId } type='upgrade' />
              <ShopElements elements={ items } unitId={ unitId } type='item' />
            </React.Fragment>
          )
        }) }
      </aside>
    </>
  )
}

export default ShopMainView
