import React, { memo } from 'react'

import classNames from 'classnames'
import useUnitsStore from 'store/useUnitsStore'
import Section from 'components/section/Section'
import { useItemsContext } from 'provider/ItemsProvider'

import styles from './Root.module.scss'

type RootProps = {
  className?: string;
};

function Root ({ className, ...props }: RootProps) {
  const { getItemsByUnit } = useItemsContext()
  const unitsId = useUnitsStore(state => state.getAllUnitsId)

  const unitsIdArr = unitsId()

  console.log(getItemsByUnit('actif'))

  return (
    <main className={ classNames(styles.wrapper, className) }>
      { unitsIdArr.map(unitId => (
        <Section key={ unitId } unitId={ unitId } />
      )) }
    </main>
  )
}

export default memo(Root)
