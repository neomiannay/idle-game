import React, { useState } from 'react'

import classNames from 'classnames'
import { useGameProviderContext } from 'provider/GameProvider'
import { EGameUnit } from 'types/store'
import HoldButton from 'components/hold-button/HoldButton'
import AutoSwitch from 'blocks/auto-switch/AutoSwitch'
import useMotionState from 'hooks/useMotionState'
import Count from 'components/count/Count'
import { useL10n } from 'provider/L10nProvider'
import { useUpgradePurchased } from 'hooks/useUpgradePurchased'
import Button from 'components/button/Button'

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
  const rawUnitName = unitId.toString().toUpperCase()
  const unitName = `UNITS.${rawUnitName}`

  const isUpgradePurchased = useUpgradePurchased(unitId, 'autoprod')

  const canPurchase = canPurchaseTime(10, EGameUnit.ACTIF) && hasEnoughUnits(10, EGameUnit.ACTIF)

  return (
    <div className={ classNames(styles.wrapper, className) }>
      <div className={ styles.stepCounter }>
        <Count unitId={ unitId } count={ count } />
      </div>
      <HoldButton label='BUTTONS.PRODUCE' autoMode={ autoMode } />
      <div className={ styles.perfWrapper }>
        <div className={ styles.perf }>
          <div className={ styles.perfHeader }>
            <p className={ styles.perfTitle }>{ l10n('UI.PRODUCTION_DURATION') }</p>
            <span className={ styles.perfValue }>{ formattedSeconds } { l10n('UI.SEC') }</span>
          </div>
          <Button
            onClick={ improveTime }
            disabled={ !canPurchase }
            isVariant
            cost={{
              value: unit.costAmount ?? 0,
              unit: '$'
            }}
            action='-0.5 s'
          />
        </div>
        <div className={ styles.perf }>
          <div className={ styles.perfHeader }>
            <p className={ styles.perfTitle }>{ l10n('UI.EXECUTED_QUANTITY') }</p>
            <span className={ styles.perfValue }>{ quantity }</span>
          </div>
          <Button
            onClick={ () => improveValueByAction(10, EGameUnit.COMPLEX, EGameUnit.ACTIF) }
            disabled={ !hasEnoughUnits(10, EGameUnit.ACTIF) }
            isVariant
            cost={{
              value: unit.costAmount ?? 0,
              unit: '$'
            }}
            action='+20'
          />
        </div>
      </div>
      { isUpgradePurchased && (
        <AutoSwitch value={ autoMode } onToggle={ () => setAutoMode(prev => !prev) } />
      ) }
    </div>
  )
}

export default ComplexSection
