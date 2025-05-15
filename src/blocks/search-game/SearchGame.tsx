import React from 'react'

import { EGamePrice, EGameUnit } from 'types/store'

import styles from './SearchGame.module.scss'

type TSearchGameItemValue = {
  value: number;
  target: EGameUnit | EGamePrice;
}

type TSearchGameItem = {
  id: string;
  disabled: boolean;
  name: string;
  description: string;
  values: TSearchGameItemValue[];
}

type TSearchGameLayoutInfos = {
  name: string;
  title: string;
  subtitle: string;
  description: string;
  buttonLabel: string;
}

export type SearchGameProps = {
  duration: number; // In seconds
  price: number; // In euros
  efficiency: number; // In percentage
  layoutInfos: TSearchGameLayoutInfos;
  items: TSearchGameItem[];
};

const SearchGame: React.FC<SearchGameProps> = ({ duration, price, efficiency, layoutInfos, items }) => {
  return (
    <div className={ styles.wrapper }>
      search game works
    </div>
  )
}

export default SearchGame
