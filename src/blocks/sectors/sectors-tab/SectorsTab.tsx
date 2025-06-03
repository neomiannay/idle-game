import React, { PropsWithChildren, useRef, useEffect, useState } from 'react'

import { motion } from 'framer-motion'
import classNames from 'classnames'
import { useSectorsProviderContext } from 'provider/SectorsProvider'
import { useL10n } from 'provider/L10nProvider'

import styles from './SectorsTab.module.scss'

type SectorsTabProps = PropsWithChildren<{
  className?: string
}>

const SectorsTab = ({ className, ...props }: SectorsTabProps) => {
  const { defaultUnlockedSector, unlockedSectors, reactiveCurrentSector, setCurrentSector } = useSectorsProviderContext()
  const l10n = useL10n()
  const [activeButtonBounds, setActiveButtonBounds] = useState<DOMRect | null>(null)
  const buttonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({})

  useEffect(() => {
    const activeButton = buttonRefs.current[reactiveCurrentSector]
    if (!activeButton) return

    const updateBounds = () => {
      const bounds = activeButton.getBoundingClientRect()
      const parentBounds = activeButton.parentElement?.getBoundingClientRect()

      if (parentBounds) {
        const relativeBounds = {
          width: bounds.width,
          height: bounds.height,
          left: bounds.left - parentBounds.left,
          top: bounds.top - parentBounds.top
        } as DOMRect

        setActiveButtonBounds(relativeBounds)
      }
    }

    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        requestAnimationFrame(updateBounds)
      })
    } else {
      requestAnimationFrame(updateBounds)
    }
  }, [reactiveCurrentSector, defaultUnlockedSector, unlockedSectors])

  return (
    <motion.div
      className={ classNames(styles.wrapper, className) }
      { ...props }
    >
      { (activeButtonBounds) && (
        <motion.div
          className={ styles.activeBackground }
          initial={ false }
          animate={{
            x: activeButtonBounds.left,
            y: activeButtonBounds.top,
            width: activeButtonBounds.width,
            height: activeButtonBounds.height
          }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 30
          }}
        />
      ) }

      <motion.button
        ref={ (el) => {
          if (el) buttonRefs.current[defaultUnlockedSector] = el
        } }
        className={ classNames(styles.sector, {
          [styles.active]: defaultUnlockedSector === reactiveCurrentSector
        }) }
        onClick={ () => setCurrentSector(defaultUnlockedSector) }
        tabIndex={ 1 }
      >
        { l10n(`SECTORS.${defaultUnlockedSector.toUpperCase()}`) }
      </motion.button>

      { unlockedSectors?.map((sector, index) => {
        return (
          <motion.button
            key={ sector }
            ref={ (el) => {
              if (el) buttonRefs.current[sector] = el
            } }
            className={ classNames(styles.sector, {
              [styles.active]: reactiveCurrentSector === sector
            }) }
            onClick={ () => setCurrentSector(sector) }
            tabIndex={ index + 2 }
          >
            { l10n(`SECTORS.${sector.toUpperCase()}`) }
          </motion.button>
        )
      }) }
    </motion.div>
  )
}

export default React.memo(SectorsTab)
