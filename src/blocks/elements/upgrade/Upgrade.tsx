import React, { memo } from 'react'

import { EGameUnit, UpgradeType } from 'types/store'
import { useL10n } from 'provider/L10nProvider'
import classNames from 'classnames'
import { useUpgradePurchased } from 'hooks/useUpgradePurchased'

import styles from './Upgrade.module.scss'

type ItemProps = {
  className?: string
  unitId: EGameUnit
  upgradeId: string
  upgrade: UpgradeType
}

const Upgrade = ({ className, unitId, upgradeId, upgrade }: ItemProps) => {
  const l10n = useL10n()

  const isPurchased = useUpgradePurchased(unitId, upgradeId)

  if (!isPurchased) return null

  return (
    <div className={ classNames(styles.wrapper, className) }>
      <div key={ upgradeId } className={ styles.purchasedUpgrade }>
        <div className={ styles.upgradeIcon }>✓</div>
        <div className={ styles.upgradeInfo }>
          <b className={ styles.upgradeName }>{ l10n(upgrade.name) }</b>
          <span className={ styles.upgradeEffect }>
            +{ upgrade.valueByAction - 1 }x multiplier
          </span>
        </div>
      </div>
    </div>
  )
}

export default memo(Upgrade)
