import React, { useState } from 'react'

import classNames from 'classnames'
import { useGameProviderContext } from 'provider/GameProvider'
import { EGameUnit } from 'types/store'
import HoldButton from 'components/hold-button/HoldButton'
import AutoSwitch from 'blocks/auto-switch/AutoSwitch'
import useMotionState from 'hooks/useMotionState'
import Count from 'components/count/Count'
import { conjugate, useL10n } from 'provider/L10nProvider'
import { useUpgradePurchased } from 'hooks/useUpgradePurchased'

import styles from './ComplexSection.module.scss'

type ComplexSectionProps = {
  className?: string
  unitId: EGameUnit
}

const ComplexSection = ({ className, unitId }: ComplexSectionProps) => {
  const l10n = useL10n()
  const { getUnit, hasEnoughUnits, updateUnitDuration, updateValueByAction } = useGameProviderContext()

  const [autoMode, setAutoMode] = useState(false)

  const unit = getUnit(unitId)
  if (!unit) return null

  const count = useMotionState(unit.motionValue, (value) => value)

  let formattedSeconds = ''
  let duration = 0
  const complexDuration = unit.duration
  if (complexDuration) {
    duration = useMotionState(complexDuration, (v) => v)

    const seconds = duration / 1000
    formattedSeconds = seconds.toFixed(1)
  }

  let quantity = 1
  const valueByAction = unit.valueByAction
  if (valueByAction)
    quantity = useMotionState(valueByAction, (value) => value)

  const canPurchaseTime = (unitsNeeded: number, unitId: EGameUnit) => {
    if (duration <= 500) return false
    return hasEnoughUnits(unitsNeeded, unitId)
  }

  const improveTime = () => {
    if (!canPurchaseTime(10, EGameUnit.ACTIF)) return
    updateUnitDuration(EGameUnit.COMPLEX)
  }

  const improveValueByAction = (
    unitsNeeded: number,
    unitId: EGameUnit,
    requiredUnitId: EGameUnit
  ) => {
    if (!hasEnoughUnits(unitsNeeded, requiredUnitId)) return
    const unit = getUnit(unitId)
    if (!unit) return
    updateValueByAction(unitId, 1)
  }

  const costName = `UNITS.${unit.costUnitId?.toString().toUpperCase()}`

  const isUpgradePurchased = useUpgradePurchased(unitId, 'autoprod')

  return (
    <div className={ classNames(styles.wrapper, className) }>
      <div className={ styles.stepCounter }>
        <Count unitId={ unitId } count={ count } />
      </div>
      <HoldButton label='BUTTONS.PRODUCE' autoMode={ autoMode } />
      <div className={ styles.perfWrapper }>
        <div className={ styles.perf }>
          <p className={ styles.perfTitle }>Durée de production</p>
          <span className={ styles.perfValue }>{ formattedSeconds } s</span>
          <button
            className={ classNames(styles.improvePerf, {
              [styles.disabled]: !canPurchaseTime(10, EGameUnit.ACTIF)
            }) }
            onClick={ improveTime }
          >
            <p className={ styles.gain }>-0.5 s</p>
            <p>
              { unit.costAmount } <span>({ l10n(conjugate(costName, unit.costAmount ?? 0)) })</span>
            </p>
          </button>
        </div>
        <div className={ styles.perf }>
          <p className={ styles.perfTitle }>Quantité exécutée</p>
          <span className={ styles.perfValue }>{ quantity }</span>
          <button
            className={ classNames(styles.improvePerf, {
              [styles.disabled]: !hasEnoughUnits(10, EGameUnit.ACTIF)
            }) }
            onClick={ () => improveValueByAction(10, EGameUnit.COMPLEX, EGameUnit.ACTIF) }
          >
            <p className={ styles.gain }>+1</p>
            <p>
              { unit.costAmount } <span>({ l10n(conjugate(costName, unit.costAmount ?? 0)) })</span>
            </p>
          </button>
        </div>
      </div>
      { isUpgradePurchased && (
        <AutoSwitch value={ autoMode } onToggle={ () => setAutoMode(prev => !prev) } />
      ) }
    </div>
  )
}

export default ComplexSection
