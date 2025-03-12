import { memo } from 'react'

import classNames from 'classnames'

import styles from './Count.module.scss'

type CountProps = {
  className?: string
  count: number
  unit: string
}

const Count = ({ className, count, unit, ...props }: CountProps) => {
  console.log('🚨 Count render')

  return (
    <div className={ classNames(styles.wrapper, className) } { ...props }>
      <span className={ styles.count }>{ count }</span>
      <span className={ styles.title }>{ unit }</span>
    </div>
  )
}

export default memo(Count)
