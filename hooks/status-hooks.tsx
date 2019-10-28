import { useEffect, useContext, useState, useMemo, useCallback } from 'react'
import { StatusLevel } from '../components/Status'
import StatusContext from '../components/Status/StatusContext'
import { reportError } from '../lib/utils/error'

interface Message {
  id: string
  text: string
  level: StatusLevel
}
export function useSetStatus() {
  const context = useContext(StatusContext)
  const [message, setMessage] = useState<Message | null>(null)

  const setStatus = useMemo(() => {
    function fn(text: Error): void
    function fn(text: string, level: StatusLevel): void
    function fn(text: string | Error, level?: StatusLevel): void {
      if (!context) {
        throw new Error('Status context not found')
      }

      if (text instanceof Error) {
        reportError(text)
        setMessage({
          id: context.register(text.message, StatusLevel.Error),
          text: text.message,
          level: StatusLevel.Error,
        })
        return
      }

      if (level) {
        setMessage({ id: context.register(text, level), text, level })
      }
    }

    return fn
  }, [context])
  const removeStatusIfExists = useCallback(() => {
    if (!context) {
      throw new Error('Status context not found')
    }

    if (message) {
      context.unRegister(message.id)
    }
  }, [context, message])

  useEffect(() => () => removeStatusIfExists(), [message])
  return useMemo(() => [setStatus, removeStatusIfExists], [setMessage])
}
