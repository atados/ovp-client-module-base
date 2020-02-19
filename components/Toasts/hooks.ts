import { useRef, useEffect } from 'react'
import { useToasts } from '~/components/Toasts'

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
