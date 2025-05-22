import React, { memo } from 'react'

import classNames from 'classnames'
import { EGameUnit } from 'types/store'
import { useGameProviderContext } from 'provider/GameProvider'
import useMotionState from 'hooks/useMotionState'

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
    <div className={ classNames(styles.wrapper, className) }>
      <p className={ styles.upgradesCount }>x{ valueByAction }</p>
    </div>
  )
}

export default memo(Upgrades)
