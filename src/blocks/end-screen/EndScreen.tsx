import React, { PropsWithChildren } from 'react'

import classNames from 'classnames'
import { motion } from 'motion/react'
import AdaptativeText from 'components/adaptative-text/AdaptativeText'
import { baseVariants, fadeAppear, fadeAppearDelayed, stagger } from 'core/animation'
import { BENEFITS_GOAL } from 'data/constants'
import { useLoaderContext } from 'provider/LoaderProvider'
import GradientText from 'components/gradient-text/GradientText'

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
    <div
      className={ classNames(styles.wrapper, className) }
      { ...props }
    >
      <div className={ styles.container }>
        <motion.div
          className={ styles.titleContainer }
          { ...baseVariants }
          { ...stagger(0.3, 0.4) }
        >
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
        </motion.div>
        <motion.div
          className={ styles.content }
          { ...baseVariants }
          { ...fadeAppearDelayed(.25) }
        >
          <motion.div
            className={ classNames(styles.contentLeft, styles.contentText) }
            { ...baseVariants }
            { ...fadeAppearDelayed(.5) }
          >
            <div><GradientText className={ styles.item } duration={ 3 }>+25%</GradientText> SUR LE PRIX pour le public “féminin”</div>
            <div>COMPLEXE SUR-DILUÉ</div>
            <div>promesses scientifiques fallacieuses</div>
            <div>molécules chimiques non déclarée camouflée par le terme fragrance</div>
          </motion.div>
          <img src={ pot.src } alt='content' className={ styles.pot } />
          <motion.div
            className={ classNames(styles.contentRight, styles.contentText) }
            { ...baseVariants }
            { ...fadeAppearDelayed(.5) }
          >
            <div><GradientText className={ styles.item } duration={ 3 }>32</GradientText> - animaux souffrant et exploités</div>
            <div><GradientText className={ styles.item } duration={ 3 }>8 000</GradientText> - enfants exploités dans les mines de mica</div>
            <div><GradientText className={ styles.item } duration={ 3 }>9</GradientText> - actifs toxiques</div>
            <div><GradientText className={ styles.item } duration={ 3 }>64</GradientText> - terrains destinés à l’agriculture détournés</div>
            <div><GradientText className={ styles.item } duration={ 3 }>13</GradientText> - partenariats mensongers</div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default EndScreen
