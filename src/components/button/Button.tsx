import { ButtonHTMLAttributes } from 'react'

import classNames from 'classnames'
import { useL10n } from 'provider/L10nProvider'

import styles from './Button.module.scss'

type ButtonProps = {
  className?: string
  title: string
  disabled?: boolean
} & ButtonHTMLAttributes<HTMLButtonElement>

const Button = ({ className, title, disabled, ...props }: ButtonProps) => {
  const l10n = useL10n()

  // console.log('🔘 ' + l10n(title) + ' Button rendered')

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

export default Button
