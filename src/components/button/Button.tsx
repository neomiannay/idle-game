import { ButtonHTMLAttributes, memo } from 'react'

import classNames from 'classnames'
import { useL10n } from 'provider/L10nProvider'

import styles from './Button.module.scss'

type ButtonProps = {
  className?: string
  title: string
} & ButtonHTMLAttributes<HTMLButtonElement>

const Button = ({ className, title, ...props }: ButtonProps) => {
  const l10n = useL10n()

  console.log('🔘 Button rendered')

  return (
    <button className={ classNames(styles.wrapper, className) } { ...props }>
      { l10n(title) }
    </button>
  )
}

export default memo(Button)
