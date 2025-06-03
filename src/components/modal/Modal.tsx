import classNames from 'classnames'

import { useMessageSystemContext } from '../../provider/MessageSystemProvider'

import styles from './Modal.module.scss'

const Modal = () => {
  const { activeMessage, handleResponse } = useMessageSystemContext()

  if (!activeMessage) return null

  return (
    <div className={ classNames(styles.wrapper) }>
      <div className={ styles.container }>
        <p>{ activeMessage.message }</p>
        <button onClick={ () => handleResponse('accept') }>Accepter</button>
        <button onClick={ () => handleResponse('decline') }>Refuser</button>
      </div>
    </div>
  )
}

export default Modal
