import React, { memo } from 'react'

import classNames from 'classnames'
import useUnitsStore from 'store/useUnitsStore'
import Section from 'components/section/Section'
import { useVisibility } from 'provider/VisibilityProvider'

import styles from './Root.module.scss'

type RootProps = {
  className?: string;
};

function Root ({ className, ...props }: RootProps) {
  const unitsId = useUnitsStore(state => state.getAllUnitsId)
  const resetStore = useUnitsStore(state => state.resetStore)

  // const unitsIdArr = unitsId()

  const { visibleEntities } = useVisibility()

  return (
    <main className={ classNames(styles.wrapper, className) }>
      <button onClick={ resetStore }>Reset</button>
      { visibleEntities.units.map(unitId => (
        <Section
          key={ unitId }
          unitId={ unitId }
          visibleItems={ visibleEntities.items[unitId] || [] }
          visibleUpgrades={ visibleEntities.upgrades[unitId] || [] }
        />
      )) }
    </main>
  )
}

export default memo(Root)
