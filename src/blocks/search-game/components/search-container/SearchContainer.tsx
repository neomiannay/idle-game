import React, { useState, useRef, useEffect } from 'react'

import { EGameSector, EGameUnit } from 'types/store'
import { SearchGameProps, TSearchGameItem } from 'blocks/search-game/SearchGame'
import { motion, AnimatePresence } from 'framer-motion'
import { useSearchLaboratoryContext } from 'provider/SearchLaboratoryProvider'
import { useSearchPublicityContext } from 'provider/SearchPublicityProvider'

import SearchProgress from '../search-progress/SearchProgress'
import SearchStart from '../search-start/SearchStart'
import SearchResults from '../search-results/SearchResults'

import styles from './SearchContainer.module.scss'

export type SearchContainerProps = {
  layoutInfos: SearchGameProps['layoutInfos'];
  duration: number;
  price: {
    unit: EGameUnit;
    value: number;
  };
  items: TSearchGameItem[];
  sectorId: EGameSector;
};

const SearchContainer = ({
  layoutInfos,
  duration,
  price,
  items,
  sectorId
}: SearchContainerProps) => {
  const [contentHeight, setContentHeight] = useState<number | 'auto'>('auto')
  const contentRef = useRef<HTMLDivElement>(null)
  const { searchStateLab, setSearchStateLab, newItemLab, startProgressLab, setNewItemLab, saveNewItemLab, currentTimeLab } = useSearchLaboratoryContext()
  const { searchStatePub, setSearchStatePub, newItemPub, startProgressPub, setNewItemPub, saveNewItemPub, currentTimePub } = useSearchPublicityContext()

  let searchState
  let setSearchState
  let newItem
  let startProgress
  let setNewItem
  let saveNewItem
  let currentTime

  switch (sectorId) {
    case EGameSector.LABORATORY:
      searchState = searchStateLab
      setSearchState = setSearchStateLab
      newItem = newItemLab
      startProgress = startProgressLab
      setNewItem = setNewItemLab
      saveNewItem = saveNewItemLab
      currentTime = currentTimeLab
      break

    case EGameSector.PUBLICITY:
      searchState = searchStatePub
      setSearchState = setSearchStatePub
      newItem = newItemPub
      startProgress = startProgressPub
      setNewItem = setNewItemPub
      saveNewItem = saveNewItemPub
      currentTime = currentTimePub
      break

    default:
      searchState = searchStateLab
      setSearchState = setSearchStateLab
      newItem = newItemLab
      startProgress = startProgressLab
      setNewItem = setNewItemLab
      saveNewItem = saveNewItemLab
      currentTime = currentTimeLab
      break
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
                duration={ duration }
                items={ items }
                setSearchState={ setSearchState }
                startProgress={ startProgress }
                setNewItem={ setNewItem }
                sectorId={ sectorId }
              />
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
                colors={{
                  background: 'var(--color-white)',
                  progress: 'var(--transparent-light-40)'
                }}
                currentTime={ currentTime }
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
            style={{ overflow: 'hidden', width: '100%' }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-start'
              }}
              ref={ contentRef }
            >
              <SearchResults
                newItem={ newItem }
                layoutInfos={ layoutInfos }
                setSearchState={ setSearchState }
                saveNewItem={ saveNewItem }
              />
            </div>
          </motion.div>
        ) }
      </AnimatePresence>
    </div>
  )
}

export default SearchContainer
