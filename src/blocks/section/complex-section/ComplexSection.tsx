import React, { memo, useState } from 'react'

import classNames from 'classnames'
import { useGameProviderContext } from 'provider/GameProvider'
import { EGameUnit } from 'types/store'
import HoldButton from 'components/hold-button/HoldButton'
import AutoSwitch from 'blocks/auto-switch/AutoSwitch'
import useMotionState from 'hooks/useMotionState'

import styles from './ComplexSection.module.scss'

type ComplexSectionProps = {
  className?: string
  unitId: EGameUnit
}

const ComplexSection = ({ className, unitId }: ComplexSectionProps) => {
  const { getUnit, hasEnoughUnits, updateUnitDuration, updateValueByAction } = useGameProviderContext()

  const [autoMode, setAutoMode] = useState(false)

  const unit = getUnit(unitId)
  if (!unit) return null

  let formattedSeconds = ''
  let duration = 0
  const complexDuration = unit.duration
  if (complexDuration && unitId === 'complex') {
    duration = useMotionState(complexDuration, (v) => v)

    const seconds = duration / 1000
    formattedSeconds = seconds.toFixed(1)
  }

  let quantity = 1
  const valueByAction = unit.valueByAction
  if (valueByAction && unitId === 'complex')
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
    const unitValue = unit.valueByAction
    if (!unitValue) return
    const currentValue = unitValue.get()
    const newValue = currentValue + 1
    updateValueByAction(unitId, newValue)
  }

  return (
    <div className={ classNames(styles.wrapper, className) }>
      <HoldButton label='BUTTONS.PRODUCE' autoMode={ autoMode } />
      <div className={ styles.perfWrapper }>
        <div className={ styles.perf }>
          <div className={ styles.perfBox }>
            <p className={ styles.perfTitle }>Durée d'exécution</p>
            <span className={ styles.perfValue }>{ formattedSeconds } s</span>
          </div>
          <button
            className={ classNames(styles.improvePerf, {
              [styles.disabled]: !canPurchaseTime(10, EGameUnit.ACTIF)
            }) }
            onClick={ improveTime }
          >
            <p>-0.5 s</p>
            <p>
              { unit.costAmount } <span>({ unit.costUnitId })</span>
            </p>
          </button>
        </div>
        <div className={ styles.perf }>
          <div className={ styles.perfBox }>
            <p className={ styles.perfTitle }>Quantité exécutée</p>
            <span className={ styles.perfValue }>{ quantity }</span>
          </div>
          <button
            className={ classNames(styles.improvePerf, {
              [styles.disabled]: !hasEnoughUnits(10, EGameUnit.ACTIF)
            }) }
            onClick={ () => improveValueByAction(10, EGameUnit.COMPLEX, EGameUnit.ACTIF) }
          >
            <p>+1</p>
            <p>
              { unit.costAmount } <span>({ unit.costUnitId })</span>
            </p>
          </button>
        </div>
      </div>
      <AutoSwitch value={ autoMode } onToggle={ () => setAutoMode(prev => !prev) } />
    </div>
  )
}

export default memo(ComplexSection)
