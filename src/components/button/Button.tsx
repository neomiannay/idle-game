import React, { ButtonHTMLAttributes, PropsWithChildren, useState } from 'react'

import classNames from 'classnames'
import MaskText from 'components/mask-text/MaskText'
import { motion } from 'motion/react'
import { formatValue } from 'helpers/units'

import styles from './Button.module.scss'

type ButtonProps = PropsWithChildren<{
  className?: string
  isVariant?: boolean
  disabled?: boolean
  cost?: {
    value: number
    unit: string
  }
  action: string
  onClick?: () => void
} & ButtonHTMLAttributes<HTMLButtonElement>>

const Button = ({ className, cost, action, disabled, isVariant, onClick } : ButtonProps) => {
  const [isHovered, setIsHovered] = useState(false)
  const [replayKey, setReplayKey] = useState(0)

  return (
    <motion.button
      className={ classNames(styles.wrapper, className, {
        [styles.variant]: isVariant
      }) }
      disabled={ disabled }
      onClick={ (e) => {
        onClick && onClick(e)
        setReplayKey((k) => k + 1)
      } }
      onHoverStart={ () => setIsHovered(true) }
      onHoverEnd={ () => setIsHovered(false) }
      // { ...baseVariants }
    >
      { isVariant && (
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

      { !isVariant && cost && (
        <>
          <div className={ styles.left }>
            <span className={ styles.cost }>
              <MaskText opened={ false } replayKey={ replayKey }>
                { cost?.value }&nbsp;
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
    </motion.button>
  )
}

export default React.memo(Button)
