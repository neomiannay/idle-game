import React from 'react'

import { useGameProviderContext } from 'provider/GameProvider'
import { EGameUnit } from 'types/store'

import styles from './ReputationIndicator.module.scss'

const getReputationLabel = (value: number) => {
  if (value >= 80) return 'Excellente'
  if (value >= 60) return 'Très bonne'
  if (value >= 40) return 'Bonne'
  if (value >= 20) return 'Moyenne'
  return 'Mauvaise'
}

const ReputationIndicator = () => {
  const { getUnit } = useGameProviderContext()
  const reputationValue = getUnit(EGameUnit.REPUTATION)?.motionValue.get() ?? 0
  const clampedValue = Math.min(reputationValue, 100)
  const label = getReputationLabel(clampedValue)

  return (
    <div className={ styles.wrapper }>
      <span className={ styles.title }>Réputation</span>
      <span className={ styles.label }>{ label }</span>
      <div className={ styles.tooltip }>
        { clampedValue }% de chance de réussir une vente
      </div>
    </div>
  )
}

export default ReputationIndicator
