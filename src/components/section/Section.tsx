import { memo } from 'react'

import classNames from 'classnames'
import Count from 'components/count/Count'
import useUnitsStore from 'store/useUnitsStore'
import Button from 'components/button/Button'

import styles from './Section.module.scss'

type SectionProps = {
  className?: string;
  unitId: string;
}

const Section = ({ className, unitId }: SectionProps) => {
  const unit = useUnitsStore(state => state.units[unitId])
  const performAction = useUnitsStore(state => state.performAction)

  if (!unit) return null

  const { count, name, action } = unit

  const handleClick = () => {
    performAction(unitId)
  }

  return (
    <div className={ classNames(styles.wrapper, className) }>
      <Count unit={ name } count={ count } />
      <Button title={ action.name } onClick={ handleClick } />
    </div>
  )
}

export default memo(Section)
