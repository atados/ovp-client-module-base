export interface Toast {
  id: string
  message: ToastMessage
  type: ToastType
  timeout?: number
  exitClassName?: string
}

export type ToastType = 'error' | 'warning' | 'info' | 'success' | 'loading'
export type ToastMessage = React.ReactNode | Element | string
