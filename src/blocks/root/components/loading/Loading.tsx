import React from 'react'

import GradientText from 'components/gradient-text/GradientText'

import styles from './Loading.module.scss'

function Loading () {
  return (
    <div className={ styles.loading }>
      <GradientText>
        Loading...
      </GradientText>
    </div>
  )
}

export default Loading
