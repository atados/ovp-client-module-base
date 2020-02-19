import React from 'react'
import { Toast, ToastMessage, ToastType } from './types'

export interface ToastsContextType {
  get: (id: string) => Toast | undefined
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
