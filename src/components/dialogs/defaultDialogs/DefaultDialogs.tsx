import React, { memo } from 'react'

import classNames from 'classnames'

import styles from './DefaultDialogs.module.scss'

function DefaultDialogs (props: any) {
  return (
    <>
      <div
        className={ classNames(styles.wrapper) }
        { ...props }
      >
        <div className={ classNames(styles.container) } />
      </div>
    </>
  )
}

export default memo(DefaultDialogs)
