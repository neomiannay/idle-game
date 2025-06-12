import React, { PropsWithChildren } from 'react'

import classNames from 'classnames'
import { motion } from 'motion/react'
import AdaptativeText from 'components/adaptative-text/AdaptativeText'
import { baseVariants, fadeAppear, stagger } from 'core/animation'
import { BENEFITS_GOAL } from 'data/constants'
import { useLoaderContext } from 'provider/LoaderProvider'

import styles from './EndScreen.module.scss'

type EndScreenProps = PropsWithChildren<{
  className?: string;
}>;

const EndScreen = ({ className, ...props }: EndScreenProps) => {
  const { resources } = useLoaderContext()
  const pot = resources.pot as HTMLImageElement

  const benefits = BENEFITS_GOAL.toLocaleString('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  })

  return (
    <div className={ styles.wrapper }>
      <motion.div
        className={ classNames(styles.container, className) }
        { ...props }
        { ...baseVariants }
        { ...stagger(0.3, 0.4) }
      >
        <div className={ styles.titleContainer }>
          <motion.div { ...fadeAppear() } custom={{ invert: true }}>
            <AdaptativeText className={ classNames(styles.title) }>
              Félicitations
            </AdaptativeText>
          </motion.div>
          <motion.div
            className={ classNames(styles.second) }
            { ...fadeAppear() }
            custom={{ invert: true }}
          >
            <AdaptativeText
              className={ styles.adpative }
              innerText={ `vous avez généré ${benefits} en 3h 20m 10s` }
            >
              <span>vous avez généré&nbsp;</span>
              <span className={ styles.benefitsWrapper }>
                <span className={ classNames(styles.blur, styles.benefits) }>{ benefits }</span>
                <span className={ classNames(styles.base, styles.benefits) }>{ benefits }</span>
              </span>
              <span>&nbsp;en&nbsp;</span>
              <span className={ styles.benefitsWrapper }>
                <span className={ classNames(styles.blur, styles.benefits) }>
                  3h 20m 10s
                </span>
                <span className={ classNames(styles.base, styles.benefits) }>
                  3h 20m 10s
                </span>
              </span>
            </AdaptativeText>
          </motion.div>
        </div>
        <div className={ styles.content }>
          <div className={ classNames(styles.contentLeft, styles.contentText) }>
            <div>+25% SUR LE PRIX pour le public “féminin”</div>
            <div>COMPLEXE SUR-DILUÉ</div>
            <div>promesses scientifiques fallacieuses</div>
            <div>molécules chimiques non déclarée camouflée par le terme fragrance</div>
          </div>
          <img src={ pot.src } alt='content' className={ styles.pot } />
          <div className={ classNames(styles.contentRight, styles.contentText) }>
            <div>[32] animaux souffrAnt et exploités</div>
            <div>[8 000] enfants exploités dans les mines de mica</div>
            <div>[9] actifs toxiques</div>
            <div>[64] terrains destinés à l’agriculture détournés</div>
            <div>[13] partenariats mensongers</div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default EndScreen
