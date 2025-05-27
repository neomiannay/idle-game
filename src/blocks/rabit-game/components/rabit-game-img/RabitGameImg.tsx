import React from 'react'

import { motion, AnimatePresence } from 'framer-motion'

import styles from './RabitGameImg.module.scss'

const RabitGameImg = () => {
  const sources = [
    'img/rabit/rabit_1.png'
    // 'img/rabit/rabit_2.png',
    // 'img/rabit/rabit_3.png',
    // 'img/rabit/rabit_4.png',
    // 'img/rabit/rabit_5.png',
    // 'img/rabit/rabit_6.png'
  ]

  return (
    <AnimatePresence>
      { sources.map((src, i) => (
        <motion.div
          key={ i }
          layout
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{
            duration: 0.3,
            type: 'spring',
            stiffness: 100,
            damping: 20,
            mass: 0.5,
            delay: i * 0.05
          }}
        >
          <div className={ styles.rabitWrapper }>
            <img className={ styles.rabit } src={ src } alt='' />
          </div>
        </motion.div>
      )) }
    </AnimatePresence>
  )
}

export default RabitGameImg
