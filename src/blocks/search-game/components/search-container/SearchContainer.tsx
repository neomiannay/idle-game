import React, { useState, useRef, useEffect } from 'react'

import { useL10n } from 'provider/L10nProvider'
import { EGameUnit } from 'types/store'
import { SearchGameProps } from 'blocks/search-game/SearchGame'
import { motion, AnimatePresence } from 'framer-motion'

import SearchProgress from '../search-progress/SearchProgress'
import SearchStart from '../search-start/SearchStart'
import SearchResults from '../search-results/SearchResults'

import styles from './SearchContainer.module.scss'

export type SearchContainerProps = {
  layoutInfos: SearchGameProps['layoutInfos'];
  disabled: boolean;
  duration: number;
  price: {
    unit: EGameUnit;
    value: number;
  };
};

const SearchContainer = ({
  layoutInfos,
  disabled,
  duration,
  price
}: SearchContainerProps) => {
  const l10n = useL10n()
  const [searchState, setSearchState] = useState(0)
  const [contentHeight, setContentHeight] = useState<number | 'auto'>('auto')
  const contentRef = useRef<HTMLDivElement>(null)

  const onProgressEnd = () => {
    setSearchState(2)
  }

  useEffect(() => {
    if (contentRef.current) setContentHeight(contentRef.current.offsetHeight)
  }, [searchState])

  return (
    <div className={ styles.container }>
      <AnimatePresence mode='wait' initial={ false }>
        { searchState === 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: contentHeight, opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
              ref={ contentRef }
            >
              <SearchStart
                price={ price }
                setSearchState={ setSearchState }
              >
                { `${l10n(layoutInfos.buttonLabel)} (${price.value}${l10n('UNITS.EURO')})` }
              </SearchStart>
            </div>
          </motion.div>
        ) }
        { searchState === 1 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: contentHeight, opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
              ref={ contentRef }
            >
              <SearchProgress
                duration={ duration }
                onProgressEnd={ onProgressEnd }
                colors={{
                  background: 'var(--color-white)',
                  progress: '#D5E9E7'
                }}
              />
            </div>
          </motion.div>
        ) }
        { searchState === 2 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: contentHeight, opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
              ref={ contentRef }
            >
              <SearchResults
                disabled={ disabled }
                duration={ duration }
                price={ price }
              />
            </div>
          </motion.div>
        ) }
      </AnimatePresence>
    </div>
  )
}

export default SearchContainer
