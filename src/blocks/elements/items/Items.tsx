import React from 'react'

import classNames from 'classnames'
import { EGameUnit } from 'types/store'
import { useInventoryContext } from 'provider/InventoryProvider'
import { AnimatePresence, motion } from 'motion/react'
import { baseVariants, stagger } from 'core/animation'

import Item from '../item/Item'

import styles from './Items.module.scss'

type ItemsProps = {
  className?: string
  unitId: EGameUnit
}

const Items = ({ className, unitId }: ItemsProps) => {
  const { getElementsForUnit } = useInventoryContext()

  const items = getElementsForUnit(unitId, 'item')

  return (
    <AnimatePresence key={ unitId } mode='wait'>
      { Object.entries(items).length > 0 && (
        <motion.div
          className={ classNames(styles.wrapper, className) }
          { ...baseVariants }
          { ...stagger(0.1, 0.4) }
        >
          { Object.entries(items).map(([itemId, item]) => (
            <AnimatePresence key={ itemId } mode='wait'>
              <Item
                key={ itemId }
                unitId={ unitId }
                itemId={ itemId }
                item={ item }
              />
            </AnimatePresence>
          )) }
        </motion.div>
      ) }
    </AnimatePresence>
  )
}

export default Items
