import React, { PropsWithChildren } from 'react'

import classNames from 'classnames'
import { AnimationDefinition, motion, usePresenceData } from 'motion/react'
import { pageTransition } from 'core/page-transition'
import { baseVariants } from 'core/animation'

import styles from './Sector.module.scss'

type SectorProps = PropsWithChildren<{
  className?: string
  custom?: any
}>

const Sector = ({ className, children, ...props } : SectorProps) => {
  const ref = React.useRef<HTMLDivElement>(null)
  const custom = usePresenceData() || {}

  const onAnimationStart = (d: AnimationDefinition) => {
    if (d === 'exit') ref.current?.classList.add(styles.exiting)
  }

  const onAnimationComplete = (d: AnimationDefinition) => {
    if (d === 'animate') ref.current?.classList.add(styles.shown)
  }

  return (
    <motion.div
      className={ classNames(styles.wrapper, className) }
      { ...props }
      { ...baseVariants }
      { ...pageTransition }
      onAnimationStart={ onAnimationStart }
      onAnimationComplete={ onAnimationComplete }
      custom={{ ...custom, ...(props.custom || {}) }}
      ref={ ref }
    >
      <div className={ styles.inner }>
        { children }
      </div>
    </motion.div>
  )
}

export default React.memo(Sector)
