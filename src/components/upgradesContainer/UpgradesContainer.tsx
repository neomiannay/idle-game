import React, { memo, useMemo } from 'react'

import classNames from 'classnames'
import useUnitsStore from 'store/useUnitsStore'
import upgradeAlreadyPurshased from 'utils/upgradeAlreadyPurshased'

import upgradesData from 'data/upgrades.json'

import { Upgrade } from '../../types/store'
import UpgradeCard from '../upgradeCard/UpgradeCard'

import styles from './UpgradesContainer.module.scss'

type UpgradesContainerProps = {
  className?: string;
  unitId: string;
};

const UpgradesContainer = ({ className, unitId }: UpgradesContainerProps) => {
  const unit = useUnitsStore(state => state.units[unitId])

  const availableUpgrades = useMemo(() => {
    // Récupérer les améliorations pour cette unité depuis le fichier JSON
    const unitUpgrades = (upgradesData.upgrades as Record<string, any>)[unitId] || []

    if (!unit) return []

    // Filtrer les améliorations selon les conditions d'apparition
    return unitUpgrades.filter((upgrade: Upgrade) => {
      // Si l'amélioration a déjà été achetée, on ne la liste pas dans unitUpgrades
      const alreadyPurchased = upgradeAlreadyPurshased(unit.upgrades, upgrade) || false

      if (alreadyPurchased) return false

      // Si l'amélioration n'est pas encore atteinte, on ne la liste pas dans unitUpgrades
      const conditionUnit = useUnitsStore.getState().units[upgrade.apparitionCondition.unitId]
      const apparitionConditionMet = conditionUnit && conditionUnit.count >= upgrade.apparitionCondition.value

      return apparitionConditionMet
    })
  }, [unit, unitId])

  if (!availableUpgrades.length) return null

  return (
    <div className={ classNames(styles.container, className) }>
      <h2 className={ styles.heading }>Améliorations disponibles</h2>
      <div className={ styles.grid }>
        { availableUpgrades.map((upgrade: Upgrade) => (
          <UpgradeCard
            key={ upgrade._id }
            upgrade={ upgrade }
          />
        )) }
      </div>
    </div>
  )
}

export default memo(UpgradesContainer)
