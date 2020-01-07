import React, { useContext } from 'react'

export type ToastType = 'error' | 'warning' | 'info' | 'success' | 'loading'
export type ToastMessage = React.ReactNode | Element | string

export interface ToastsContextType {
  add: (
    message: ToastMessage,
    type: ToastType,
    timeoutMs?: number | false,
  ) => string
  remove(id: string, exitAnimation?: string): void
  replace(
    id: string,
    message: ToastMessage,
    newType?: ToastType,
    newTimeoutMs?: number | boolean,
  ): void
}

export const ToastsContext = React.createContext<ToastsContextType | null>(null)

export const useToasts = () => {
  const context = useContext(ToastsContext)

  if (!context) {
    throw new Error(
      'Unable to find ToastsContext. Make sure to wrap it on ToastsProvider',
    )
  }

  return context
}

export { default as ToastsProvider } from './ToastsProvider'
