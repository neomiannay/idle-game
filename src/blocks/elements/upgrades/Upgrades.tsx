import React from 'react'

import { EGameUnit } from 'types/store'
import { useGameProviderContext } from 'provider/GameProvider'
import useMotionState from 'hooks/useMotionState'
import classNames from 'classnames'
import MaskText from 'components/mask-text/MaskText'

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
    <div className={ classNames(styles.upgradesCount, className) }>
      <MaskText tag='span' opened={ false } replayKey={ valueByAction }>
        x{ valueByAction }
      </MaskText>
    </div>
  )
}

export default Upgrades
