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
  const canBuy = useUnitsStore(state => state.canBuyUnitSelector(unitId)(state))

  if (!unit) return null

  const { count, name, action, cost } = unit

  const handleClick = () => {
    performAction(unitId)
  }

  let costText = ''
  if (cost && cost.value > 0)
    costText = `${cost.value} ${cost.unitId}`

  return (
    <div className={ classNames(styles.wrapper, className) }>
      <Count unit={ name } count={ count } />
      <Button
        title={ action.name }
        onClick={ handleClick }
        disabled={ !canBuy }
      />
      <span>{ costText }</span>
    </div>
  )
}

export default memo(Section)
