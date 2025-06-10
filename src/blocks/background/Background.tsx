import React, { useEffect, useState } from 'react'

import BangerRive from 'blocks/banger-rive/BangerRive'
import {
  Alignment,
  StateMachineInput,
  Fit,
  Layout
} from '@rive-app/react-webgl2'
import { useGameProviderContext } from 'provider/GameProvider'
import { useMotionValue, useMotionValueEvent, useSpring } from 'motion/react'
import { animate } from 'motion'
import { useGlobalContext } from 'provider/GlobalProvider'

import styles from './Background.module.scss'

const BENEFITS_END_STEP = 6_200_000_000
const BENEFITS_START_STEP = 1_000

function getProgressFromMoney (
  money: number,
  maxMoney = BENEFITS_END_STEP,
  base = 1.25
) {
  const ratio = money / maxMoney
  const progress = Math.log(ratio * (base - 1) + 1) / Math.log(base)
  return Math.max(0, Math.min(1, progress)) * 100
}

type BackgroundProps = {
  onLoad?: () => void;
};

/**
 * Background Component
 * @returns {React.ReactNode} The Background component
 */
function Background ({ onLoad }: BackgroundProps): React.ReactElement {
  // Providers
  const { setDarkMode } = useGlobalContext()
  const { units } = useGameProviderContext()

  // States
  const [input, setInput] = useState<StateMachineInput | null>(null)

  // Springs
  const progressSpring = useSpring(-1, { stiffness: 22 })
  const transitionMotion = useMotionValue(100)

  const handleInputsChange = (inputs: StateMachineInput[]) => {
    setInput(inputs.find(({ name }) => name === 'progress') ?? null)
  }

  const isTransitionning = () => transitionMotion.get() > 100 || transitionMotion.get() < 123

  const handleProgressChange = (v: number) => {
    if (!input) return

    input.value = isTransitionning() ? Math.round(v) : v
  }

  const handleBenefitsChange = (value: number) => {
    if (!input || value > BENEFITS_END_STEP) return
    const sprVal = progressSpring.get()
    const transVal = transitionMotion.get()

    // let res = (value / BENEFITS_START_STEP) * 100
    let res = getProgressFromMoney(value, BENEFITS_START_STEP)

    if (value > BENEFITS_START_STEP && transVal < 123) {
      setDarkMode(true)

      progressSpring.jump(123)
      animate(transitionMotion.get(), 123, {
        duration: .22 * 3,
        ease: 'linear',
        onUpdate: (v) => transitionMotion.set(v)
      })
    } else if (transVal >= 123) {
      const startValue = value - BENEFITS_START_STEP
      const endValue = BENEFITS_END_STEP - BENEFITS_START_STEP

      res = 200 + getProgressFromMoney(startValue, endValue)
    }

    if (sprVal >= 0 && !isTransitionning()) {
      progressSpring.set(res)
    } else {
      progressSpring.jump(res)
      handleProgressChange(res)
    }
  }

  useMotionValueEvent(
    units.benefits.motionValue,
    'change',
    handleBenefitsChange
  )

  // Sync once after the Rive input is available to ensure correct initial state
  useEffect(() => {
    if (!input) return
    handleBenefitsChange(units.benefits.motionValue.get())
  }, [input])

  progressSpring.on('change', handleProgressChange)
  transitionMotion.on('change', handleProgressChange)

  return (
    <div className={ styles.background }>
      <BangerRive
        id='background'
        src='rive/background.riv'
        stateMachines={ ['StateMachine'] }
        artboard='tout'
        layout={ new Layout({ fit: Fit.Cover, alignment: Alignment.Center }) }
        onInputsChange={ handleInputsChange }
        onLoad={ onLoad }
      />
    </div>
  )
}

export default Background
