import { memo } from 'react'

import classNames from 'classnames'

import styles from './Button.module.scss'

type ButtonProps = {
  className?: string
  title: string
}

const Button = ({ className, title, ...props }: ButtonProps) => {
  return (
    <button className={ classNames(styles.wrapper, className) } { ...props }>
      { title }
    </button>
  )
}

export default memo(Button)
