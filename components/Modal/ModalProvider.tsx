import React, { useState, useMemo, useRef } from 'react'
import { DialogOverlay, DialogContent } from '@reach/dialog'
import { ModalContextType, ModalContext } from '~/components/Modal/context'
import nanoid from 'nanoid'

interface Modal<Props> {
  id: string
  component: React.ComponentType<Props>
  props: Props
  className?: string
  label?: string
}

const ModalProvider: React.FC = ({ children }) => {
  const [modals, setModals] = useState<Modal<any>[]>([])
  const stateRef = useRef<Modal<any>[]>([])
  stateRef.current = modals

  const contextValue = useMemo<ModalContextType>(() => {
    return {
      push({ id = nanoid(), ...modal }) {
        setModals(prevState => [
          ...prevState,
          {
            ...modal,
            id,
          },
        ])

        return id
      },
      isOpen: id => stateRef.current.some(openModal => openModal.id === id),
      close(id) {
        if (id === '*') {
          setModals([])
          return
        }

        setModals(prevState =>
          prevState.filter(openModal => openModal.id !== id),
        )
      },
      replace(replacedId, { id = nanoid(), ...modal }) {
        if (replacedId === '*') {
          setModals([
            {
              ...modal,
              id,
            },
          ])
        } else {
          setModals(prevState =>
            prevState.map(openModal => {
              if (openModal.id === replacedId) {
                return {
                  ...modal,
                  id,
                }
              }

              return openModal
            }),
          )
        }

        return id
      },
    }
  }, [setModals])

  const frontModal = modals[modals.length - 1]
  return (
    <ModalContext.Provider value={contextValue}>
      <style>{`
        :root {
          --reach-dialog: 1;
        }
      `}</style>
      {children}
      {frontModal && (
        <DialogOverlay
          isOpen
          onDismiss={() => contextValue.close(frontModal.id)}
        >
          <DialogContent
            className={frontModal.className}
            aria-label={frontModal.label}
          >
            <frontModal.component {...frontModal.props} />
          </DialogContent>
        </DialogOverlay>
      )}
    </ModalContext.Provider>
  )
}

ModalProvider.displayName = 'ModalProvider'

export default ModalProvider
