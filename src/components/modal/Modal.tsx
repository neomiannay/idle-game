import React, { memo, ReactNode, useState, useEffect, useCallback } from 'react'

import classNames from 'classnames'

import styles from './Modal.module.scss'

type ModalProps = {
  children: ReactNode;
  open?: boolean;
  close?: () => void;
  onClose?: () => void;
  onOpen?: () => void;
};

function Modal ({ children, open = false, close, onClose, onOpen }: ModalProps) {
  const [isOpen, setIsOpen] = useState(open)

  useEffect(() => {
    setIsOpen(open)
    console.log(open)

    if (open && onOpen)
      onOpen()
  }, [open, onOpen])

  const handleClose = useCallback(() => {
    setIsOpen(false)
    if (close) close()
    if (onClose) onClose()
  }, [close, onClose])

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget)
      handleClose()
  }, [handleClose])

  return (
    <>
      { isOpen && (
        <div
          className={ classNames(styles.modalWrapper, { [styles.open]: isOpen }) }
          style={{
            position: 'fixed',
            pointerEvents: isOpen ? 'auto' : 'none',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 999
          }}
          onClick={ handleBackdropClick }
        >
          <div className={ styles.modalContent }>
            { children }
            <button className={ styles.closeButton } onClick={ handleClose }>
              &times;
            </button>
          </div>
        </div>
      ) }
    </>
  )
}

export default memo(Modal)
