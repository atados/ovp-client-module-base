import cx from 'classnames'
import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import ReactDOM from 'react-dom'
import styled, { keyframes } from 'styled-components'

export enum ModalSize {
  Default,
  Small,
  Medium,
  Large,
}
export interface ModalOptions<Props> {
  size?: ModalSize
  componentProps?: Props
  cardClassName?: string
}

export interface ModalContextType {
  isModalOpen: (id: string) => boolean
  close: (id?: string) => void
  push: (
    id: string,
    component: React.ComponentType<any>,
    options?: ModalOptions<any>,
  ) => void
  replace: (
    replacementId: string,
    component: React.ComponentType<any>,
    replacedId?: string,
    options?: ModalOptions<any>,
  ) => void
}
export const ModalContext = createContext<ModalContextType | undefined>(
  undefined,
)

interface ModalDefinition<Props> {
  id: string
  component: React.ComponentType<Props>
  options: ModalOptions<Props>
}

const Backdrop = styled.div`
  background: rgba(0, 0, 0, 0.55);
  z-index: 9999;
  left: 0;
  right: 0;
  position: fixed;
  top: 0;
  bottom: 0;
  overflow-y: auto;
`

const Container = styled.div`
  margin: 0 auto;
  max-width: 700px;
  z-index: 1000;
  padding-top: 70px;

  @media (min-width: 992px) {
    padding: 70px 20px;
  }
`

const slideInUpeKeyFrames = keyframes`


    from {
      transform: translateY(100px);
      opacity: 0;
    }

    to {
      transform: translateY(0);
      opacity: 1;
    }`

const Card = styled.div`
  background: #fff;
  border-radius: 10px 10px 0 0;
  width: 100%;
  animation-name: ${slideInUpeKeyFrames};
  animation-duration: 0.5s;
  animation-fill-mode: both;
  box-shadow: 0 0 3px 1px rgba(0, 0, 0, 0.15),
    0 30px 60px -30px rgba(0, 0, 0, 0.3),
    0 -18px 60px -10px rgba(0, 0, 0, 0.025);

  @media (min-width: 992px) {
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    min-height: auto !important;
  }
`

const IdleOverlay = styled.div``

const CardWrapper = styled.div`
  position: relative;
  transition: transform 0.3s;
  transform-origin: top center;

  &.stopAnimation ${Card} {
    animation-duration: unset;
  }

  &.idle {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;

    ${IdleOverlay} {
      display: block;
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      border-radius: 10px;
      z-index: 10;
    }
  }
`

interface ModalModalProviderProps {
  readonly children: React.ReactNode
}

const actionPopModal = (
  currentModalsList: Array<ModalDefinition<any>>,
): Array<ModalDefinition<any>> =>
  currentModalsList.slice(0, currentModalsList.length - 1)

const ModalProvider: React.FC<ModalModalProviderProps> = ({ children }) => {
  const [modals, setModals] = useState<Array<ModalDefinition<any>>>([])
  const modalsIdsRef = useRef<string[]>([])
  const containerRef = useRef<HTMLDivElement | null>(null)
  const shouldRunAnimationRef = useRef<boolean>(true)
  const contextValue = useMemo<ModalContextType>(
    () => ({
      isModalOpen: id => {
        return modalsIdsRef.current.includes(id)
      },
      close: id => {
        if (id === undefined) {
          setModals([])
          return
        }

        setModals(currentModalsList =>
          currentModalsList.filter(modal => modal.id !== id),
        )
        modalsIdsRef.current = modalsIdsRef.current.filter(
          modalId => modalId !== id,
        )
      },
      push: (id, component, options = {}) => {
        modalsIdsRef.current.push(id)
        shouldRunAnimationRef.current = true

        setModals(currentModalsList => [
          ...currentModalsList,
          {
            id,
            component,
            options,
          },
        ])
      },
      replace: (
        replacementId,
        component,
        baseReplacedModalId,
        options = {},
      ) => {
        shouldRunAnimationRef.current = false

        const replacedModalId =
          baseReplacedModalId ||
          modalsIdsRef.current[modalsIdsRef.current.length - 1]

        // No modals are open
        if (!replacedModalId) {
          return
        }

        modalsIdsRef.current = modalsIdsRef.current.map(modalId =>
          modalId === replacedModalId ? replacementId : modalId,
        )

        setModals(currentModalsList =>
          currentModalsList.map(modal => {
            if (modal.id === replacedModalId) {
              return {
                id: replacementId,
                component,
                options,
              }
            }

            return modal
          }),
        )
      },
    }),
    [setModals],
  )

  const goBack = useCallback(() => {
    shouldRunAnimationRef.current = false
    setModals(actionPopModal)
    modalsIdsRef.current = modalsIdsRef.current.slice(
      0,
      modalsIdsRef.current.length - 1,
    )
  }, [setModals])

  const handleDocumentKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.keyCode === 27) {
        goBack()
      }
    },
    [setModals],
  )

  useEffect(() => {
    if (modals.length) {
      document.addEventListener('keydown', handleDocumentKeyDown)
    } else {
      document.removeEventListener('keydown', handleDocumentKeyDown)
    }

    document.body.style.overflowY = modals.length ? 'hidden' : 'unset'

    return () => {
      document.removeEventListener('keydown', handleDocumentKeyDown)
      document.body.style.overflowY = 'unset'
    }
  }, [modals.length === 0, setModals])

  const handleBackdropClick = useCallback((event: React.MouseEvent) => {
    if (event && event.target && containerRef.current) {
      try {
        const bodyNode = ReactDOM.findDOMNode(containerRef.current)

        if (
          (bodyNode && !bodyNode.contains(event.target as Node)) ||
          bodyNode === event.target
        ) {
          goBack()
        }
      } catch (error) {
        throw error
      }
    }
  }, [])

  return (
    <ModalContext.Provider value={contextValue}>
      <>
        {children}
        {modals.length > 0 && (
          <Backdrop onClick={handleBackdropClick}>
            <Container>
              <div className="relative">
                {modals.map((modal, i) => {
                  const styleDiff = modals.length - (i + 1)

                  return (
                    <CardWrapper
                      key={modal.id}
                      className={cx({
                        idle: i !== modals.length - 1,
                        stopAnimation:
                          i === modals.length - 1 &&
                          !shouldRunAnimationRef.current,
                      })}
                      style={
                        i !== modals.length - 1
                          ? {
                              transform: `scale(0.${90 - styleDiff * 5})`,
                              top: `${i * 40}px`,
                            }
                          : modals.length > 1
                          ? {
                              top: `${i * 40}px`,
                            }
                          : undefined
                      }
                      ref={i === modals.length - 1 ? containerRef : undefined}
                    >
                      <Card
                        className={modal.options.cardClassName}
                        style={{ minHeight: `calc(100vh - ${i * 40 + 70}px)` }}
                      >
                        {i !== modals.length - 1 && (
                          <IdleOverlay
                            style={{
                              backgroundColor: `rgba(0,0,0,.${15 +
                                styleDiff * 15})`,
                            }}
                          />
                        )}
                        <modal.component {...modal.options.componentProps} />
                      </Card>
                    </CardWrapper>
                  )
                })}
              </div>
            </Container>
          </Backdrop>
        )}
      </>
    </ModalContext.Provider>
  )
}

ModalProvider.displayName = 'ModalProvider'

export default ModalProvider
