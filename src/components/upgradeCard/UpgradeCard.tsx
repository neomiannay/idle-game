import React, { memo, useCallback, useMemo } from 'react'

import classNames from 'classnames'
import useUnitsStore from 'store/useUnitsStore'
import { Upgrade } from 'types/store'
import { useL10n } from 'provider/L10nProvider'
import canAfford from 'utils/canAfford'

import styles from './UpgradeCard.module.scss'

type UpgradeCardProps = {
  className?: string;
  upgrade: Upgrade;
};

const UpgradeCard = ({ className, upgrade }: UpgradeCardProps) => {
  const { _id, unitId, name, valueByAction, cost } = upgrade

  const unit = useUnitsStore(state => state.units[unitId])
  const gesture = unit.action.gesture
  const costUnit = useUnitsStore(state => state.units[cost.unitId])
  const updateValueByAction = useUnitsStore(state => state.updateValueByAction)
  const addUpgrade = useUnitsStore(state => state.addUpgrade)
  const updateUnitCount = useUnitsStore(state => state.updateUnitCount)

  const l10n = useL10n()

  const canAffordUpgrade = useMemo(() => {
    return canAfford(cost.value, costUnit.count)
  }, [costUnit, cost.value])

  const handlePurchase = useCallback(() => {
    if (!canAffordUpgrade || !unit) return

    // Déduire le coût
    updateUnitCount(cost.unitId, -cost.value)

    // Appliquer l'amélioration
    if (valueByAction)
      updateValueByAction(unitId, valueByAction)

    // Ajouter l'amélioration à la liste des améliorations achetées
    addUpgrade(unitId, upgrade)
  }, [canAffordUpgrade, unit, cost, unitId, valueByAction, updateUnitCount, updateValueByAction, addUpgrade])

  return (
    <div
      className={ classNames(
        styles.card,
        className,
        { [styles.disabled]: !canAffordUpgrade }
      ) }
      onClick={ handlePurchase }
    >
      <h3 className={ styles.title }>Amélioration: { l10n(name) }</h3>
      <div className={ styles.description }>
        { valueByAction && (
          <p>{ valueByAction } { l10n(unit?.name) } par action</p>
        ) }
      </div>
      <div className={ styles.cost }>
        <span>Coût: { cost.value } { l10n(costUnit?.name) }</span>
      </div>
    </div>
  )
}

export default memo(UpgradeCard)
