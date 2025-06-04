import { ButtonHTMLAttributes, memo } from 'react'

import classNames from 'classnames'
import { useL10n } from 'provider/L10nProvider'

import styles from './BuyButton.module.scss'

type BuyButtonProps = {
  className?: string
  title: string
  disabled?: boolean
} & ButtonHTMLAttributes<HTMLButtonElement>

const BuyButton = ({ className, title, disabled, ...props }: BuyButtonProps) => {
  const l10n = useL10n()

  return (
    <button
      className={ classNames(styles.wrapper, className, {
        [styles.disabled]: disabled
      }) } { ...props }
    >
      { l10n(title) }
    </button>
  )
}

export default memo(BuyButton)
