import React, { memo } from 'react'

import classNames from 'classnames'
import useUnitsStore from 'store/useUnitsStore'
import Section from 'components/section/Section'
import { useItemsContext } from 'provider/ItemsProvider'
import { useUpgradesContext } from 'provider/UpgradesProvider'
import Button from 'components/button/Button'

import styles from './Root.module.scss'

type RootProps = {
  className?: string;
};

function Root ({ className, ...props }: RootProps) {
  const { getItemsByUnit } = useItemsContext()
  const { getUpgradesByUnit } = useUpgradesContext()
  const unitsId = useUnitsStore(state => state.getAllUnitsId)
  const resetStore = useUnitsStore(state => state.resetStore)

  const unitsIdArr = unitsId()

  console.log(getItemsByUnit('actif'))
  console.log(getUpgradesByUnit('actif'))

  return (
    <main className={ classNames(styles.wrapper, className) }>
      { unitsIdArr.map(unitId => (
        <Section key={ unitId } unitId={ unitId } />
      )) }
      <Button title='reset' onClick={ resetStore } />
    </main>
  )
}

export default memo(Root)
