import classNames from 'classnames'
import { conjugate, useL10n } from 'provider/L10nProvider'

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
      <span className={ styles.count }>{ count }</span>
      <span className={ styles.title }>{ l10n(conjugate(unit, count)) }</span>
    </div>
  )
}

export default Count
