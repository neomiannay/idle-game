import React, { memo, useEffect } from 'react'

import classNames from 'classnames'
import { useInventoryContext } from 'provider/InventoryProvider'
import { useGameProviderContext } from 'provider/GameProvider'
import { useUpgradeObserver } from 'hooks/useUpgradeObserver'
import { EGameUnit } from 'types/store'

import ShopElements from './shop-elements/ShopElements'
import styles from './Shop.module.scss'

type ShopProps = {
  className?: string
}

const Shop = ({ className }: ShopProps) => {
  const { canDisplayUnit, units } = useGameProviderContext()
  const { getElementsForUnit } = useInventoryContext()
  const { checkForNewUpgrades } = useUpgradeObserver()

  useEffect(() => {
    checkForNewUpgrades()
  }, [checkForNewUpgrades])

  const unitIds = Object.keys(units) as EGameUnit[]

  return (
    <aside className={ classNames(styles.wrapper, className) }>
      { unitIds.map(unitId => {
        if (!canDisplayUnit(unitId)) return null

        const items = getElementsForUnit(unitId, 'item')
        const upgrades = getElementsForUnit(unitId, 'upgrade')

        const hasElements = Object.keys(items).length > 0 || Object.keys(upgrades).length > 0

        if (!hasElements) return null

        return (
          <React.Fragment key={ unitId }>
            <ShopElements elements={ upgrades } unitId={ unitId } type='upgrade' />
            <ShopElements elements={ items } unitId={ unitId } type='item' />
          </React.Fragment>
        )
      }) }
    </aside>
  )
}

export default memo(Shop)
