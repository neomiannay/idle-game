import React from 'react'

import classNames from 'classnames'
import { EGameUnit } from 'types/store'
import { useInventoryContext } from 'provider/InventoryProvider'

import Upgrade from '../upgrade/Upgrade'

import styles from './Upgrades.module.scss'

type UpgradesProps = {
  className?: string
  unitId: EGameUnit
}

const Upgrades = ({ className, unitId }: UpgradesProps) => {
  const { getElementsForUnit } = useInventoryContext()

  const upgrades = getElementsForUnit(unitId, 'upgrade')

  return (
    <div className={ classNames(styles.wrapper, className) }>
      { Object.keys(upgrades).length > 0 && (
        <div className={ styles.purchasedUpgradesSection }>
          <div className={ styles.purchasedUpgradesList }>
            { Object.entries(upgrades).map(([upgradeId, upgrade]) => (
              <Upgrade
                key={ upgradeId }
                unitId={ unitId }
                upgradeId={ upgradeId }
                upgrade={ upgrade }
              />
            )) }
          </div>
        </div>
      ) }
    </div>
  )
}

export default Upgrades
