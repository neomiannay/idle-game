import React from 'react'

import classNames from 'classnames'
import { motion } from 'framer-motion'

import styles from './AutoSwitch.module.scss'

type AutoSwitchProps = {
  value: boolean;
  onToggle: () => void;
};

const AutoSwitch: React.FC<AutoSwitchProps> = ({ value, onToggle }) => {
  return (
    <motion.div
      className={ styles.autoSwitch }
      onClick={ onToggle }
      initial={{ opacity: 0, y: 10, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.9 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <span className={ styles.switchLabel }>Production automatique</span>
      <div className={ classNames(styles.switchTrack, { [styles.on]: value }) }>
        <div className={ styles.switchThumb } />
      </div>
    </motion.div>
  )
}

export default AutoSwitch
