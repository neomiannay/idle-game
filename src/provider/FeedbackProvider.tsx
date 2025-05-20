import React, { createContext, useContext, useState } from 'react'

import { EStatus } from 'types/store'

import { BaseProviderProps } from './GlobalProvider'

type FeedbackContextType = {
  feedback: { status: EStatus; key: number } | null
  setFeedback: (feedback: { status: EStatus; key: number } | null) => void
  triggerFeedback: (status: EStatus) => void
  successCount: number
  setSuccessCount: React.Dispatch<React.SetStateAction<number>>
  failCount: number
  setFailCount: React.Dispatch<React.SetStateAction<number>>;
}

export const FeedbackContext = createContext<FeedbackContextType | null>({} as FeedbackContextType)

let context: FeedbackContextType

export const FeedbackProvider = ({ children }: BaseProviderProps) => {
  const [feedback, setFeedback] = useState<{ status: EStatus; key: number } | null>(null)
  const [successCount, setSuccessCount] = useState<number>(0)
  const [failCount, setFailCount] = useState<number>(0)

  const triggerFeedback = (status: EStatus) => {
    setFeedback({ status, key: Date.now() })
  }

  context = {
    feedback,
    setFeedback,
    triggerFeedback,
    successCount,
    setSuccessCount,
    failCount,
    setFailCount
  }

  return (
    <FeedbackContext.Provider
      value={ context }
    >
      { children }
    </FeedbackContext.Provider>
  )
}

export const useFeedbackContext = (): FeedbackContextType => {
  const context = useContext(FeedbackContext)
  if (!context) throw new Error('useFeedbackContext must be used within a FeedbackProvider')
  return context
}
