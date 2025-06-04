import React, { ButtonHTMLAttributes, PropsWithChildren } from 'react'

import classNames from 'classnames'

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

const Button = ({ className, cost, action, disabled, isVariant, onClick, ...props } : ButtonProps) => {
  return (
    <button
      className={ classNames(styles.wrapper, className, {
        [styles.variant]: isVariant
      }) }
      disabled={ disabled }
      onClick={ onClick }
      { ...props }
    >
      { isVariant && (
        <>
          <div className={ styles.left }>
            <span className={ styles.variantCost }>{ action }</span>
          </div>

          <div className={ styles.right }>
            <span className={ styles.cost }>{ cost?.value }&nbsp;</span>
            <span className={ styles.unit }>{ cost?.unit }</span>
          </div>
        </>
      ) }

      { !isVariant && cost && (
        <>
          <div className={ styles.left }>
            <span className={ styles.cost }>{ cost?.value }&nbsp;</span>
            <span className={ styles.unit }>{ cost?.unit }</span>
          </div>
          <div className={ classNames(styles.right, {
            [styles.hasCost]: cost
          }) }
          >
            <span className={ styles.action }>{ action }</span>
          </div>
        </>
      ) }
    </button>
  )
}

export default React.memo(Button)
