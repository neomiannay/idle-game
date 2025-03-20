import React, { memo } from 'react'

import classNames from 'classnames'
import useUnitsStore from 'store/useUnitsStore'
import Section from 'components/section/Section'

import styles from './Root.module.scss'

type RootProps = {
  className?: string;
};

function Root ({ className, ...props }: RootProps) {
  const unitsId = useUnitsStore(state => state.getAllUnitsId)

  const unitsIdArr = unitsId()

  return (
    <main className={ classNames(styles.wrapper, className) }>
      { unitsIdArr.map(unitId => (
        <Section key={ unitId } unitId={ unitId } />
      )) }
    </main>
  )
}

export default memo(Root)
