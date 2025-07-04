import React, { useEffect, useState, createContext, useContext, useMemo } from 'react'

import useTinyEmitter from 'hooks/useTinyEmitter'
import { EGamePrice, EGameUnit, MessageType } from 'types/store'

import messagesData from '../data/messageEvents.json'

import { BaseProviderProps } from './GlobalProvider'
import { usePricesContext } from './PricesProvider'
import { useGameProviderContext } from './GameProvider'

type UnitUpdatedType = {
  unitId: string;
  motionValue: number;
}

type MessageSystemContextType = {
  activeMessage: MessageType | null;
  seenMessages: string[] | null;
  setSeenMessages: React.Dispatch<React.SetStateAction<string[] | null>>;
  seenMessagesLoaded: boolean;
  setSeenMessagesLoaded: React.Dispatch<React.SetStateAction<boolean>>;
  handleResponse: (choice: 'accept' | 'decline') => void;
  loadMessages: (data: string[]) => void;
}

const MessageContext = createContext<MessageSystemContextType | null>(null)

export const MessageSystemProvider = ({ children }: BaseProviderProps) => {
  const { modifyUnitValue } = useGameProviderContext()
  const priceContext = usePricesContext()
  const [activeMessage, setActiveMessage] = useState<MessageType | null>(null)
  const [seenMessages, setSeenMessages] = useState<string[] | null>(null)
  const [seenMessagesLoaded, setSeenMessagesLoaded] = useState(false)
  const emitter = useTinyEmitter()

  useEffect(() => {
    if (!seenMessagesLoaded) return

    const handler = (unitUpdated: UnitUpdatedType) => {
      if (activeMessage) return

      const next = messagesData.find(msg => {
        const { unit, min } = msg.condition
        return (
          unitUpdated.unitId === unit &&
          unitUpdated.motionValue >= min &&
          !seenMessages?.includes(msg.id)
        )
      })

      if (next) {
        setSeenMessages(prev => (prev ? [...prev, next.id] : [next.id]))
        setActiveMessage(next)
      }
    }

    emitter.on('unitUpdated', handler)

    return () => {
      emitter.off('unitUpdated', handler)
    }
  }, [seenMessagesLoaded, seenMessages, activeMessage])

  const handleResponse = (choice: 'accept' | 'decline') => {
    if (!activeMessage) return

    if (choice === 'accept') {
      if (activeMessage.accept) {
        Object.entries(activeMessage.accept).forEach(([key, value]) => {
          if (key === 'selling') {
            const sellingPrice = priceContext.getPrice(key as EGamePrice)
            if (sellingPrice)
              sellingPrice.rawValue.add(value)
          } else if (key === 'production') {
            const productionPrice = priceContext.getPrice(key as EGamePrice)
            if (productionPrice) {
              if (value < 0) {
                const currentValue = productionPrice.rawValue.get()
                if (currentValue + value < 0) return false
                return productionPrice.rawValue.subtract(Math.abs(value))
              }
            }
          } else {
            // Pour les unités standards (reputation, actif, complex, etc.)
            modifyUnitValue(key as EGameUnit, value)
          }
        })
      }
    } else {
      if (activeMessage.decline) {
        Object.entries(activeMessage.decline).forEach(([key, value]) => {
          modifyUnitValue(key as EGameUnit, value)
        })
      }
    }

    setActiveMessage(null)
  }

  const loadMessages = (data: string[]) => {
    const refinedData = Array.from(new Set([...data]))
    setSeenMessages(refinedData)
  }

  const contextValue = useMemo<MessageSystemContextType>(() => ({
    activeMessage,
    seenMessages,
    setSeenMessages,
    seenMessagesLoaded,
    setSeenMessagesLoaded,
    handleResponse,
    loadMessages
  }), [activeMessage, seenMessages, setSeenMessagesLoaded, handleResponse, loadMessages])

  return (
    <MessageContext.Provider value={ contextValue }>
      { children }
    </MessageContext.Provider>
  )
}

export const useMessageSystemContext = () => {
  const context = useContext(MessageContext)
  if (!context) throw Error('useMessageSystemContext must be used inside a `MessageSystemProvider`')
  return context
}
