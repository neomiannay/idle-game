import { useEffect, useRef, useState } from 'react'

import classNames from 'classnames'

import styles from './GridHelper.module.scss'

const GridHelper = () => {
  const [enabled, setEnabled] = useState<boolean>(false)

  const gridRef = useRef<HTMLDivElement>(null)

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.code === 'KeyG' && event.shiftKey) {
      const newEnabled = !enabled
      setEnabled(newEnabled)
      localStorage.setItem('grid-helper', newEnabled.toString())
    }
  }

  useEffect(() => {
    const isGridEnabled = localStorage.getItem('grid-helper') === 'true'
    setEnabled(isGridEnabled)

    if (window !== undefined && gridRef.current) {
      window.addEventListener('keydown', handleKeyDown)

      return () => {
        window.removeEventListener('keydown', handleKeyDown)
      }
    }
  }, [enabled])

  return (
    <div ref={ gridRef } className={ classNames(styles.gridHelper, { [styles.visible]: enabled }) }>
      <div className={ styles.gridHelperCol } />
      <div className={ styles.gridHelperCol } />
      <div className={ styles.gridHelperCol } />
      <div className={ styles.gridHelperCol } />
      <div className={ styles.gridHelperCol } />
      <div className={ styles.gridHelperCol } />
      <div className={ styles.gridHelperCol } />
      <div className={ styles.gridHelperCol } />
      <div className={ styles.gridHelperCol } />
      <div className={ styles.gridHelperCol } />
      <div className={ styles.gridHelperCol } />
      <div className={ styles.gridHelperCol } />
      <div className={ styles.gridHelperCol } />
      <div className={ styles.gridHelperCol } />
      <div className={ styles.gridHelperCol } />
    </div>

  )
}

export default GridHelper
