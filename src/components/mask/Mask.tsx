import React, { useEffect, useRef, forwardRef, ReactNode, memo } from 'react'

import classNames from 'classnames'
import { HTMLMotionProps, motion, useAnimationControls } from 'motion/react'

import styles from './Mask.module.scss'

export type GenericMaskProps = {
  className?: string
  children?: ReactNode
  disabled?: boolean
  custom?: Record<string, any>
  onAnimationComplete?: (e: string) => void
  opened?: boolean | null
  tag?: any
  innerProps?: HTMLMotionProps<'div'>
  replayKey?: any
} & HTMLMotionProps<'div'>

const Mask = forwardRef<HTMLElement, GenericMaskProps>(({
  className,
  children,
  custom,
  tag = 'div',
  onAnimationComplete,
  opened = null,
  innerProps = {},
  replayKey,
  ...props
}, ref) => {
  const controls = useAnimationControls()
  const first = useRef(true)
  const otherProps = {} as any

  if (opened !== null) {
    otherProps.animate = controls
    otherProps.onAnimationComplete = (variant:string) => {
      if (variant === 'exit') controls.set('initial')
      onAnimationComplete && onAnimationComplete(variant)
    }
  }

  useEffect(() => {
    if (opened === true) {
      controls.set('initial')
      controls.start('animate')
    } else if (opened === false) {
      if (first.current) controls.set('initial')
      else controls.start('exit')
    }
    first.current = false
  }, [opened])

  useEffect(() => {
    if (replayKey === undefined) return
    if (replayKey > 0) {
      controls.set('initial')
      controls.start('animate')
    }
  }, [replayKey])

  const Tag = (motion as any)[tag]

  return (
    <Tag
      ref={ ref }
      className={ classNames(className, styles.wrapper) }
      { ...props }
      { ...otherProps }
      custom={ custom }
    >
      <motion.div className={ styles.inner } { ...innerProps } custom={ custom }>
        { children }
      </motion.div>
      <motion.div className={ classNames(styles.clone, styles.inner) } { ...innerProps } custom={ custom }>
        { children }
      </motion.div>
      <motion.div className={ classNames(styles.clone, styles.inner) } { ...innerProps } custom={ custom }>
        { children }
      </motion.div>
    </Tag>
  )
})

export default memo(Mask)
