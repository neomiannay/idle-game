import React, { useState } from 'react'

import BangerRive from 'blocks/banger-rive/BangerRive'
import {
  Alignment,
  StateMachineInput,
  Fit,
  Layout
} from '@rive-app/react-webgl2'
import { useGameProviderContext } from 'provider/GameProvider'
import { useSpring } from 'motion/react'
import useMotionState from 'hooks/useMotionState'

import styles from './Background.module.scss'

const BENEFITS_END_STEP = 6_200_000_000
const BENEFITS_START_STEP = 100_000

function getProgressFromMoney (money: number, maxMoney = BENEFITS_END_STEP, base = 1.25) {
  const ratio = money / maxMoney
  const progress = Math.log(ratio * (base - 1) + 1) / Math.log(base)
  return Math.max(0, Math.min(1, progress)) * 100
}

/**
 * Background Component
 * @returns {React.ReactNode} The Background component
 */
function Background (): React.ReactElement {
  // Providers
  const { units } = useGameProviderContext()

  // States
  const [input, setInput] = useState<StateMachineInput | null>(null)

  // Springs
  const progressSpring = useSpring(-1, {
    stiffness: 22
  })

  const handleInputsChange = (inputs: StateMachineInput[]) => {
    setInput(inputs.find(({ name }) => name === 'progress') ?? null)
  }

  useMotionState(units.benefits.motionValue, (value) => {
    if (!input || value > BENEFITS_END_STEP) return

    // let res = (value / BENEFITS_START_STEP) * 100
    let res = getProgressFromMoney(value, BENEFITS_START_STEP)

    if (value > BENEFITS_START_STEP && progressSpring.get() < 123) {
      res = 123
    } else if (progressSpring.get() >= 123) {
      const startValue = value - BENEFITS_START_STEP
      const endValue = BENEFITS_END_STEP - BENEFITS_START_STEP
      // res = 200 + (startValue / endValue) * 100
      res = 200 + getProgressFromMoney(startValue, endValue)
    }

    if (progressSpring.get() >= 0) progressSpring.set(res)
    else progressSpring.jump(res)
  })

  progressSpring.on('change', (value) => {
    if (!input) return

    if (value > 100 && value < 123) value = Math.floor(value)
    input.value = value
  })

  return (
    <div className={ styles.background }>
      <BangerRive
        id='background'
        src='rive/background.riv'
        stateMachines={ ['StateMachine'] }
        artboard='tout'
        layout={ new Layout({ fit: Fit.Cover, alignment: Alignment.Center }) }
        onInputsChange={ handleInputsChange }
      />
    </div>
  )
}

export default Background
