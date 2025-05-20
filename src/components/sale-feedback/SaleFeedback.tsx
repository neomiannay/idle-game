import { useEffect, useState } from 'react'

import { EStatus } from 'types/store'

import styles from './SaleFeedback.module.scss'

type SaleFeedbackProps = {
  status: EStatus;
  onDone: () => void;
};

const SaleFeedback = ({ status, onDone }: SaleFeedbackProps) => {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setVisible(false)
      onDone()
    }, 1500)

    return () => clearTimeout(timeout)
  }, [])

  if (!visible) return null

  return (
    <div className={ `${styles.feedback} ${styles[status]}` }>
      { status === EStatus.SUCCESS && '✅ Vendu !' }
      { status === EStatus.FAIL && '❌ Raté' }
    </div>
  )
}

export default SaleFeedback
