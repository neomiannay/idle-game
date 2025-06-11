import React, { useEffect } from 'react'

import { EGameSector, EGameUnit } from 'types/store'
import {
  SearchGameProps,
  TSearchGameItem
} from 'blocks/search-game/SearchGame'
import { motion, AnimatePresence } from 'framer-motion'
import { useSearchLaboratoryContext } from 'provider/SearchLaboratoryProvider'
import { useSearchPublicityContext } from 'provider/SearchPublicityProvider'

import SearchProgress from '../search-progress/SearchProgress'
import SearchStart from '../search-start/SearchStart'
import SearchResults from '../search-results/SearchResults'
import SearchInfos from '../search-infos/SearchInfos'

import styles from './SearchContainer.module.scss'

export type SearchContainerProps = {
  layoutInfos: SearchGameProps['layoutInfos'];
  duration: number;
  roundedTime: {
    value: number;
    unit: string;
  };
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
  roundedTime,
  price,
  items,
  sectorId
}: SearchContainerProps) => {
  const {
    searchStateLab,
    setSearchStateLab,
    newItemLab,
    startProgressLab,
    setNewItemLab,
    saveNewItemLab,
    currentTimeLab,
    isErrorLab,
    setIsErrorLab,
    efficiencyLab,
    setEfficiencyLab
  } = useSearchLaboratoryContext()
  const {
    searchStatePub,
    setSearchStatePub,
    newItemPub,
    startProgressPub,
    setNewItemPub,
    saveNewItemPub,
    currentTimePub,
    isErrorPub,
    setIsErrorPub,
    efficiencyPub,
    setEfficiencyPub
  } = useSearchPublicityContext()

  let searchState
  let setSearchState
  let newItem
  let startProgress
  let setNewItem
  let saveNewItem
  let currentTime
  let isError
  let setIsError
  let efficiency
  let setEfficiency

  switch (sectorId) {
    case EGameSector.LABORATORY:
      searchState = searchStateLab
      setSearchState = setSearchStateLab
      newItem = newItemLab
      startProgress = startProgressLab
      setNewItem = setNewItemLab
      saveNewItem = saveNewItemLab
      currentTime = currentTimeLab
      isError = isErrorLab
      setIsError = setIsErrorLab
      setEfficiency = setEfficiencyLab
      efficiency = efficiencyLab
      break

    case EGameSector.PUBLICITY:
      searchState = searchStatePub
      setSearchState = setSearchStatePub
      newItem = newItemPub
      startProgress = startProgressPub
      setNewItem = setNewItemPub
      saveNewItem = saveNewItemPub
      currentTime = currentTimePub
      isError = isErrorPub
      setIsError = setIsErrorPub
      setEfficiency = setEfficiencyPub
      efficiency = efficiencyPub
      break

    default:
      searchState = searchStateLab
      setSearchState = setSearchStateLab
      newItem = newItemLab
      startProgress = startProgressLab
      setNewItem = setNewItemLab
      saveNewItem = saveNewItemLab
      currentTime = currentTimeLab
      setEfficiency = setEfficiencyPub
      efficiency = efficiencyPub
      break
  }

  useEffect(() => setEfficiency(efficiency), [efficiency, setEfficiency])

  return (
    <div className={ styles.container }>
      <AnimatePresence initial={ false }>
        { searchState === 0 && (
          <motion.div
            key='start'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ position: 'absolute', opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className={ styles.start }
          >
            <SearchInfos
              layoutInfos={ layoutInfos }
              efficiency={ efficiency }
              roundedTime={ roundedTime }
            />
            <SearchStart
              isError={ !!isError }
              price={ price }
              duration={ duration }
              items={ items }
              setSearchState={ setSearchState }
              startProgress={ startProgress }
              setNewItem={ setNewItem }
              sectorId={ sectorId }
              setIsError={ setIsError }
            />
          </motion.div>
        ) }
        { searchState === 1 && (
          <motion.div
            key='progress'
            initial={{ opacity: 0 }}
            animate={{ height: '-webkit-fill-available', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className={ styles.progress }
          >
            <SearchInfos
              layoutInfos={ layoutInfos }
              efficiency={ efficiency }
              roundedTime={ roundedTime }
            />
            <SearchProgress
              colors={{
                background: 'var(--color-white)',
                progress: 'var(--transparent-light-40)'
              }}
              currentTime={ currentTime }
            />
          </motion.div>
        ) }
        { searchState === 2 && (
          <motion.div
            key='results'
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ position: 'absolute', height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className={ styles.results }
          >
            <SearchResults
              newItem={ newItem }
              layoutInfos={ layoutInfos }
              setSearchState={ setSearchState }
              saveNewItem={ saveNewItem }
            />
          </motion.div>
        ) }
      </AnimatePresence>
    </div>
  )
}

export default SearchContainer
