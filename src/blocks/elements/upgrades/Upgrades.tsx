import React from 'react'

import { EGameUnit } from 'types/store'
import { useGameProviderContext } from 'provider/GameProvider'
import useMotionState from 'hooks/useMotionState'
import classNames from 'classnames'

import styles from './Upgrades.module.scss'

type UpgradesProps = {
  className?: string
  unitId: EGameUnit
}

const Upgrades = ({ className, unitId }: UpgradesProps) => {
  const { getUnit } = useGameProviderContext()

  const unit = getUnit(unitId)
  if (!unit) return
  if (!unit.valueByAction) return

  const valueByAction = useMotionState(unit.valueByAction, (value) => value)
  if (!valueByAction) return

  return (
    <p className={ classNames(styles.upgradesCount, className) }>x{ valueByAction }</p>
  )
}

export default Upgrades
