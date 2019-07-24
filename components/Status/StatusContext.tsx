import React from 'react'

export enum StatusLevel {
  Error,
  Warning,
  Success,
}

export interface StatusContextType {
  register(message: string, level: StatusLevel): string
  unRegister(id: string): void
}

export default React.createContext<StatusContextType | null>(null)
