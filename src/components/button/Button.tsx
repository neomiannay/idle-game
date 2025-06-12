import React, { ButtonHTMLAttributes, PropsWithChildren, useState } from 'react'

import classNames from 'classnames'
import MaskText from 'components/mask-text/MaskText'
import { motion, MotionProps, Variants } from 'motion/react'
import { formatValue } from 'helpers/units'
import { SOUNDS } from 'data/constants'
import { useAudioContext } from 'provider/AudioProvider'

import styles from './Button.module.scss'

type ButtonProps = PropsWithChildren<{
  className?: string
  variant?: 'simple' | 'variant' | null
  disabled?: boolean
  cost?: {
    value: number
    unit: string
  }
  action: string
  onClick?: () => void
  motionProps?: Variants | MotionProps
  onMouseEnter?: () => void
  onMouseLeave?: () => void
} & ButtonHTMLAttributes<HTMLButtonElement>>

const Button = ({ className, cost, action, disabled, variant = null, onClick, motionProps, onMouseEnter, onMouseLeave } : ButtonProps) => {
  const [isHovered, setIsHovered] = useState(false)
  const [replayKey, setReplayKey] = useState(0)
  const { playSound } = useAudioContext()

  const handleMouseEnter = () => {
    setIsHovered(true)
    onMouseEnter?.()
  }
  const handleMouseLeave = () => {
    setIsHovered(false)
    onMouseLeave?.()
  }

  return (
    <motion.button
      className={ classNames(styles.wrapper, className, {
        [styles.variant]: variant === 'variant',
        [styles.simple]: variant === 'simple'
      }) }
      disabled={ disabled }
      onClick={ (e) => {
        onClick && onClick(e)
        setReplayKey((k) => k + 1)
        playSound(SOUNDS.ACTIONS.CATEGORY, SOUNDS.ACTIONS.BUY_BASIC)
      } }
      onHoverStart={ handleMouseEnter }
      onHoverEnd={ handleMouseLeave }
      { ...motionProps }
    >
      { variant === 'variant' && (
        <>
          <div className={ styles.left }>
            <span className={ styles.variantCost }>
              { action }
            </span>
          </div>

          <div className={ styles.right }>
            <span className={ styles.cost }>
              <MaskText opened={ isHovered } replayKey={ replayKey }>
                { formatValue(cost?.value ?? 0) }&nbsp;
              </MaskText>
            </span>
            <span className={ styles.unit }>
              <MaskText opened={ isHovered } replayKey={ replayKey }>
                { cost?.unit }
              </MaskText>
            </span>
          </div>
        </>
      ) }

      { !variant && cost && (
        <>
          <div className={ styles.left }>
            <span className={ styles.cost }>
              <MaskText opened={ false } replayKey={ replayKey }>
                { formatValue(cost?.value) }&nbsp;
              </MaskText>
            </span>
            <span className={ styles.unit }>
              <MaskText opened={ false } replayKey={ replayKey }>
                { cost?.unit }
              </MaskText>
            </span>
          </div>
          <div className={ classNames(styles.right, {
            [styles.hasCost]: cost
          }) }
          >
            <span className={ styles.action }>
              <MaskText opened={ isHovered } replayKey={ replayKey }>
                { action }
              </MaskText>
            </span>
          </div>
        </>
      ) }

      { variant === 'simple' && (
        <span className={ styles.action }>
          <MaskText opened={ isHovered } replayKey={ replayKey }>
            { action }
          </MaskText>
        </span>
      ) }
    </motion.button>
  )
}

export default React.memo(Button)
