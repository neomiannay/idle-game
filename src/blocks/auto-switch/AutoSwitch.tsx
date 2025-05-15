import React from 'react'

import classNames from 'classnames'

import styles from './AutoSwitch.module.scss'

type AutoSwitchProps = {
  value: boolean;
  onToggle: () => void;
};

const AutoSwitch: React.FC<AutoSwitchProps> = ({ value, onToggle }) => {
  return (
    <div className={ styles.autoSwitch } onClick={ onToggle }>
      <span className={ styles.switchLabel }>Production automatique</span>
      <div className={ classNames(styles.switchTrack, { [styles.on]: value }) }>
        <div className={ styles.switchThumb } />
      </div>
    </div>
  )
}

export default AutoSwitch
