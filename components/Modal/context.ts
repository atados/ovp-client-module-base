import React from 'react'

export interface ModalConfig<Props> {
  id?: string
  component: React.ComponentType<Props>
  props: Props
  className?: string
  label?: string
}

export interface ModalContextType {
  isOpen: (id: string) => boolean
  close: (id: string | '*') => void
  push: <Props>(config: ModalConfig<Props>) => string
  replace: <Props>(
    replacedId: string | '*',
    config: ModalConfig<Props>,
  ) => string
}

export const ModalContext = React.createContext<ModalContextType | null>(null)
