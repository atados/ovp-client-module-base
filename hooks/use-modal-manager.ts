import { useContext } from 'react'
import { ModalContext } from '~/components/Modal/ModalProvider'

export default function useModalManager() {
  const value = useContext(ModalContext)

  if (!value) {
    throw new Error('Modal Context not found')
  }

  return value
}
