import { memo } from 'react'

import classNames from 'classnames'
import { useL10n } from 'provider/L10nProvider'

import styles from './Count.module.scss'

type CountProps = {
  className?: string
  unit: string
  count: number
}

const Count = ({ className, unit, count, ...props }: CountProps) => {
  const l10n = useL10n()

  return (
    <div className={ classNames(styles.wrapper, className) } { ...props }>
      <span className={ styles.title }>{ l10n(unit) }</span>
      <span className={ styles.count }>{ count }</span>
    </div>
  )
}

export default memo(Count)
