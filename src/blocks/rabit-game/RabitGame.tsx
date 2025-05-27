import React from 'react'

import styles from './RabitGame.module.scss'
import RabitGameBg from './components/rabit-game-bg/RabitGameBg'
import RabitGameImg from './components/rabit-game-img/RabitGameImg'

const RabitGame = () => {
  return (
    <div className={ styles.wrapper }>
      <div className={ styles.rabitGame }>
        <RabitGameImg />
        <RabitGameBg className={ styles.rabitGameBg } />
      </div>
    </div>
  )
}

export default RabitGame
