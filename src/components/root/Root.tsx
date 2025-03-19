import React, { memo, useMemo } from 'react'

import classNames from 'classnames'
import useUnitsStore from 'store/useUnitsStore'
import Section from 'components/section/Section'

import styles from './Root.module.scss'

type RootProps = {
  className?: string;
};

function Root ({ className, ...props }: RootProps) {
  const { units } = useUnitsStore() // change to getAllUnitsId

  const unitsArray = useMemo(() => Object.values(units), [units])

  return (
    <main className={ classNames(styles.wrapper, className) }>
      { unitsArray.map(unit => (
        <Section key={ unit._id } unitId={ unit._id } />
      )) }
    </main>
  )
}

export default memo(Root)
