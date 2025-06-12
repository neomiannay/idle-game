import React, { PropsWithChildren } from 'react'

import classNames from 'classnames'
import { motion } from 'motion/react'
import AdaptativeText from 'components/adaptative-text/AdaptativeText'
import { baseVariants, fadeAppear, stagger } from 'core/animation'

import styles from './EndScreen.module.scss'

type EndScreenProps = PropsWithChildren<{
  className?: string
}>

const EndScreen = ({ className, ...props }: EndScreenProps) => {
  return (
    <motion.div
      className={ classNames(styles.wrapper, className) }
      { ...props }
      { ...baseVariants }
      { ...stagger(0.3, 0.4) }
    >
      <div
        className={ styles.titleContainer }
      >
        <motion.div
          { ...fadeAppear() }
          custom={{ invert: true }}
        >
          <AdaptativeText
            className={ classNames(styles.title) }
          >
            Félicitations
          </AdaptativeText>
        </motion.div>

        <motion.div
          className={ classNames(styles.second) }
          { ...fadeAppear() }
          custom={{ invert: true }}
        >
          <AdaptativeText className={ styles.adpative } innerText='vous avez généré 6 400 000 000,00 € en 3h 20m 10s'>
            <span>vous avez généré&nbsp;</span>
            <span className={ styles.benefitsWrapper }>
              <span className={ classNames(styles.blur, styles.benefits) }>6 400 000 000,00 €</span>
              <span className={ classNames(styles.base, styles.benefits) }>6 400 000 000,00 €</span>
            </span>
            <span>&nbsp;en&nbsp;</span>
            <span className={ styles.benefitsWrapper }>
              <span className={ classNames(styles.blur, styles.benefits) }>3h 20m 10s</span>
              <span className={ classNames(styles.base, styles.benefits) }>3h 20m 10s</span>
            </span>
          </AdaptativeText>
        </motion.div>
      </div>

      <div className={ styles.content } />
    </motion.div>
  )
}

export default EndScreen
