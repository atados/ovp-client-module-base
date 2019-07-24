import React, { useContext, useEffect } from 'react'
import StatusContext, { StatusLevel } from './StatusContext'

interface StatusProps {
  readonly message: string
  readonly level: StatusLevel
}

const Status: React.FC<StatusProps> = ({ message, level }) => {
  const context = useContext(StatusContext)

  useEffect(() => {
    if (context) {
      const id = context.register(message, level)

      return () => context.unRegister(id)
    }
  }, [message, level])

  return null
}

Status.displayName = 'Status'

export default Status
