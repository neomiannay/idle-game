import { useEffect, useState } from 'react'

import { EStatus } from 'types/store'
import { useFeedbackContext } from 'provider/FeedbackProvider'

import styles from './SaleFeedback.module.scss'

type SaleFeedbackProps = {
  status: EStatus;
  onDone: () => void;
};

const SaleFeedback = ({ status, onDone }: SaleFeedbackProps) => {
  const [visible, setVisible] = useState(true)
  const { successCount, failCount } = useFeedbackContext()

  useEffect(() => {
    const timeout = setTimeout(() => {
      setVisible(false)
      onDone()
    }, 1500)

    return () => clearTimeout(timeout)
  }, [])

  if (!visible) return null

  return (
    <div className={ styles.feedback }>
      <span>Ratées: { failCount }</span>
      <span>Réussies: { successCount }</span>
    </div>
  )
}

export default SaleFeedback
