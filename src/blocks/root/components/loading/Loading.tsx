import React from 'react'

import GradientText from 'components/gradient-text/GradientText'

import styles from './Loading.module.scss'

function Loading () {
  return (
    <div className={ styles.loading }>
      <GradientText
        startColor='var(--color-money)'
        endColor='var(--fill-60)'
      >
        Loading...
      </GradientText>
    </div>
  )
}

export default Loading
