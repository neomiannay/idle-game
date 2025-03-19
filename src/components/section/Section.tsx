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
  const { getUnit, updateUnitCount } = useUnitsStore()

  const { name, action } = getUnit(unitId)

  console.log(unitId)

  return (
    <div className={ classNames(styles.wrapper, className) }>
      <Count count={ getUnit(unitId).count } unit={ name } />
      <Button title={ action.name } onClick={ () => updateUnitCount(unitId, action.valueByAction) } />
    </div>
  )
}

export default memo(Section)
