import React, { PropsWithChildren } from 'react'

import classNames from 'classnames'
import { motion } from 'motion/react'
import AdaptativeText from 'components/adaptative-text/AdaptativeText'
import { baseVariants, fadeAppear, stagger } from 'core/animation'
import { BENEFITS_GOAL } from 'data/constants'
import { useLoaderContext } from 'provider/LoaderProvider'
import GradientText from 'components/gradient-text/GradientText'
import Button from 'components/button/Button'
import { useL10n } from 'provider/L10nProvider'

import styles from './EndScreen.module.scss'
import { useSearchLaboratoryContext } from 'provider/SearchLaboratoryProvider'
import { useInventoryContext } from 'provider/InventoryProvider'
import { EGameUnit } from 'types/store'

type EndScreenProps = PropsWithChildren<{
  className?: string;
}>;

const EndScreen = ({ className, ...props }: EndScreenProps) => {
  const l10n = useL10n()
  const { resources } = useLoaderContext()
  const { killedRabbits, complexComposition } = useSearchLaboratoryContext()
  const { getItemCount } = useInventoryContext()
  const pot = resources.pot as HTMLImageElement

  const benefits = BENEFITS_GOAL.toLocaleString('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  })

  const toxicActifsCount = complexComposition ? complexComposition.filter(actif => actif.toxic).length : 0

  return (
    <div
      className={ classNames(styles.wrapper, className) }
      { ...props }
    >
      <motion.div
        className={ styles.container }
        { ...baseVariants }
        { ...stagger(0.1, 0.4) }
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

        <div
          className={ styles.content }
        >
          <motion.div
            className={ classNames(styles.contentLeft, styles.contentText) }
            { ...stagger(0.1, 0.5) }
          >
            <motion.div { ...fadeAppear() }><GradientText className={ styles.item } duration={ 3 }>+25%</GradientText> SUR LE PRIX pour le public “féminin”</motion.div>
            <motion.div { ...fadeAppear() }>COMPLEXE SUR-DILUÉ</motion.div>
            <motion.div { ...fadeAppear() }>promesses scientifiques fallacieuses</motion.div>
            <motion.div { ...fadeAppear() }>molécules chimiques non déclarée camouflée par le terme fragrance</motion.div>
            <motion.div { ...fadeAppear() }><GradientText className={ styles.item } duration={ 3 }>{getItemCount(EGameUnit.SALE, 'kids')}</GradientText> - milliers de peaux de petites filles endommagées</motion.div>
          </motion.div>
          <motion.img
            src={ pot.src }
            alt='content'
            className={ styles.pot }
            { ...fadeAppear() }
          />
          <motion.div
            className={ classNames(styles.contentRight, styles.contentText) }
            { ...stagger(0.1, 0.5) }
          >
            <motion.div { ...fadeAppear() }><GradientText className={ styles.item } duration={ 3 }>{killedRabbits}</GradientText> - animaux souffrants et exploités</motion.div>
            <motion.div { ...fadeAppear() }><GradientText className={ styles.item } duration={ 3 }>{getItemCount(EGameUnit.ACTIF, 'land')}</GradientText> - enfants exploités dans les mines de mica</motion.div>
            <motion.div { ...fadeAppear() }><GradientText className={ styles.item } duration={ 3 }>{toxicActifsCount}</GradientText> - actifs toxiques</motion.div>
            <motion.div { ...fadeAppear() }><GradientText className={ styles.item } duration={ 3 }>{getItemCount(EGameUnit.ACTIF, 'garden')}</GradientText> - terrains destinés à l’agriculture détournés</motion.div>
            <motion.div { ...fadeAppear() }><GradientText className={ styles.item } duration={ 3 }>{getItemCount(EGameUnit.SALE, 'teens')}</GradientText> - milliers d'adolescentes complexées</motion.div>
            <motion.div { ...fadeAppear() }><GradientText className={ styles.item } duration={ 3 }>13</GradientText> - partenariats mensongers</motion.div>
          </motion.div>
        </div>

        <motion.div className={ styles.buttonsContainer } { ...stagger(0.1, 1) }>
          <motion.a
            href='https://www.notion.so/Sources-207ca43dc6968043b395d6fd8a2c0282'
            target='_blank'
            rel='noopener noreferrer'
            { ...fadeAppear() }
          >
            <Button action={ l10n('BUTTONS.CREDITS_LINK') } variant='simple' />
          </motion.a>
          <Button
            action={ l10n('BUTTONS.NEW_GAME') }
            variant='simple'
            onClick={ () => {
              localStorage.clear()
              window.location.reload()
            } }
            motionProps={ fadeAppear() }
          />
          <motion.a
            href='https://bit.ly/4l5K78k'
            target='_blank'
            rel='noopener noreferrer'
            { ...fadeAppear() }
          >
            <Button action={ l10n('BUTTONS.SHARE_SCORE') } variant='simple' />
          </motion.a>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default EndScreen
