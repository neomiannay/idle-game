import { createContext, useContext, useState, useRef } from 'react'

import { Dialogs, DialogsType } from 'types/dialogs'
import { dialogsComponents } from 'components/dialogs/dialogs'

import { BaseProviderProps } from './GlobalProvider'

type DialogsContextType = {
  dialogs: Dialogs[];
  getDialogsByType: (type: DialogsType) => Dialogs[];
  getDialogsById: (id: Dialogs['id']) => Dialogs | undefined;
  openDialog: <T extends DialogsType>(dialog: Dialogs<T>) => void;
  closeDialog: (id: Dialogs['id']) => void;
  closeAllDialogs: Function
};

export const DialogsContext = createContext<DialogsContextType | null>(
  {} as DialogsContextType
)

export const DialogsProvider = ({ children }: BaseProviderProps) => {
  const [dialogs, setDialogs] = useState<Dialogs[]>([])
  const dialogsRef = useRef<Dialogs[]>([])

  const getDialogsByType = (type: DialogsType): Dialogs[] => {
    return dialogsRef.current.filter((d) => d.type === type)
  }

  const getDialogsById = (id: Dialogs['id']): Dialogs | undefined => {
    return dialogsRef.current.find((d) => d.id === id)
  }

  const openDialog = <T extends DialogsType>(dialog: Dialogs<T>) => {
    dialogsRef.current = [...dialogsRef.current, dialog]
    setDialogs(dialogsRef.current)
  }

  const closeDialog = (id: Dialogs['id']) => {
    dialogsRef.current = dialogsRef.current.filter((d) => d.id !== id)
    setDialogs(dialogsRef.current)
  }

  const closeAllDialogs = () => {
    dialogsRef.current = []
    setDialogs([])
  }

  const context = {
    dialogs,
    getDialogsByType,
    getDialogsById,
    openDialog,
    closeDialog,
    closeAllDialogs
  }

  return (
    <DialogsContext.Provider value={ context }>
      { children }
      <div
        id='dialogs-provider'
        style={{
          position: 'fixed',
          pointerEvents: 'none',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 999
        }}
      >
        { dialogs.map((d) => {
          if (!d.type || !dialogsComponents[d.type]) {
            console.warn('⚠️ Dialog type not found, changed to default')
            d.type = 'default'
          }

          const DialogComponent = dialogsComponents[d.type]
          return <DialogComponent key={ d.id } />
        }) }
      </div>
    </DialogsContext.Provider>
  )
}

export const useDialogsContext = (): DialogsContextType => {
  const context = useContext(DialogsContext)
  if (!context)
    throw new Error('useDialogsContext must be used within a DialogsProvider')
  return context
}
