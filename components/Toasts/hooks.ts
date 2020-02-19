import { useRef, useEffect, useContext } from 'react'
import { ToastsContext } from '~/components/Toasts/context'

export const notifyErrorWithToast = (error?: Error | null) => {
  const toasts = useToasts()
  const toastIdRef = useRef<string | null>(null)

  useEffect(() => {
    if (toastIdRef.current && !toasts.get(toastIdRef.current)) {
      toastIdRef.current = null
    }

    if (!error) {
      if (toastIdRef.current) {
        toasts.remove(toastIdRef.current)
        toastIdRef.current = null
      }

      return
    }
    if (toastIdRef.current) {
      toasts.replace(toastIdRef.current, error.message)
      return
    }

    toastIdRef.current = toasts.add(error.message, 'error')
  }, [error])

  return toastIdRef.current
}

export const useToasts = () => {
  const context = useContext(ToastsContext)

  if (!context) {
    throw new Error(
      'Unable to find ToastsContext. Make sure to wrap it on ToastsProvider',
    )
  }

  return context
}
