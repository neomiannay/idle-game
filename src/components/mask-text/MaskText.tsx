import React, { memo } from 'react'

import classNames from 'classnames'
import Mask, { GenericMaskProps } from 'components/mask/Mask'
import { baseTransition, maskTextVariants } from 'core/animation'

import styles from './MaskText.module.scss'

type MaskTextProps = GenericMaskProps

const MaskText = ({ className, children, ...props } : MaskTextProps) => {
  return (
    <Mask
      className={ classNames(styles.inner, className) }
      { ...props }
      innerProps={{
        variants: maskTextVariants,
        ...(props.innerProps || {})
      }}
      custom={{
        duration: baseTransition.duration,
        ease: baseTransition.ease,
        ...(props.custom || {})
      }}
    >
      { children }
    </Mask>
  )
}

export default memo(MaskText)
