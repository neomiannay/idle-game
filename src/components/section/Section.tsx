import { memo, useMemo } from 'react'

import classNames from 'classnames'
import Count from 'components/count/Count'
import useUnitsStore from 'store/useUnitsStore'
import Holder from 'components/holder/Holder'
import { useItemsContext } from 'provider/ItemsProvider'

import styles from './Section.module.scss'

type SectionProps = {
  className?: string;
  unitId: string;
  visibleItems: string[];
  visibleUpgrades: string[];
};

const Section = ({
  className,
  unitId,
  visibleItems
}: SectionProps) => {
  const { getItemsByUnit } = useItemsContext()

  const unit = useUnitsStore((state) => state.units[unitId])
  const performAction = useUnitsStore((state) => state.performAction)
  const canBuy = useUnitsStore((state) => state.canBuyUnitSelector(unitId)(state)
  )
  const resetItems = useUnitsStore((state) => state.resetItems)
  const buyItem = useUnitsStore((state) => state.buyItem)

  const itemsByUnit = getItemsByUnit(unitId) // Peut être plus besoin de ça avec le VisibilityProvider

  if (!unit) return null

  console.log('🆕 Section', unitId)

  const { count, name, action, cost } = unit

  const handleClick = () => {
    performAction(unitId)
  }

  const handleReset = () => {
    resetItems(unitId)
  }

  const items = useMemo(() => {
    const items = itemsByUnit[unitId]
    if (!items) return []

    return items.filter((item) => visibleItems.includes(item._id))
  }, [itemsByUnit, visibleItems])

  let costText = ''
  if (cost && cost.value > 0) costText = `${cost.value} ${cost.unitId}`

  return (
    <div className={ classNames(styles.wrapper, className) }>
      <Count unit={ name } count={ count } />
      <Holder title={ action.name } onHold={ handleClick } disabled={ !canBuy } />
      <span>{ costText }</span>
      <b>
        <button onClick={ handleReset }>Reset</button>
      </b>

      { items.map((item, i) => (
        <div className={ styles.items } key={ i }>
          <span>{ item.name }</span>
          <b>
            <button onClick={ () => buyItem(unitId, item) }>Buy</button>
          </b>
          <span>
            { item.cost.value } { item.cost.unitId }
          </span>
        </div>
      )) }
    </div>
  )
}

export default memo(Section)
