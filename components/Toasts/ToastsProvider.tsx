import React, { useMemo, useState, useRef, useCallback, useEffect } from 'react'
import { Toast } from './types'
import { ToastsContext, ToastsContextType } from './context'
import ToastComponent from './Toast'
import nanoid from 'nanoid'
import styled from 'styled-components'
import { TransitionGroup, CSSTransition } from 'react-transition-group'

const ToastsList = styled.div`
  z-index: 1000000;
  > div {
    transition: height 0.2s;
  }
`

interface ToastsProviderProps {
  readonly className?: string
}

interface ToastsProviderState {
  visibleToastsCount: number
  toasts: Toast[]
}

const DEFAULT_TIMEOUT = 3000
const TOAST_ANIMATION_TIMEOUT = 500
const ToastsProvider: React.FC<ToastsProviderProps> = ({ children }) => {
  const lastVisibleToastsCountRef = useRef(0)
  const [state, setState] = useState<ToastsProviderState>({
    visibleToastsCount: 0,
    toasts: [],
  })
  const stateRef = useRef(state)
  useEffect(() => {
    stateRef.current = state
  }, [state])
  const removeToastById = useCallback((id: string) => {
    setState(prevState => ({
      visibleToastsCount: prevState.visibleToastsCount,
      toasts: prevState.toasts.filter(toast => toast.id !== id),
    }))
  }, [])

  const contextValue = useMemo<ToastsContextType>(() => {
    return {
      get: id => stateRef.current.toasts.find(toast => toast.id === id),
      remove: (id, exitClassName) => {
        if (exitClassName) {
          setState(prevState => ({
            ...prevState,
            toasts: prevState.toasts.map(toast => {
              if (toast.id === id) {
                return {
                  ...toast,
                  exitClassName,
                }
              }

              return toast
            }),
          }))
          setTimeout(() => {
            removeToastById(id)
          }, 1)
        }

        return removeToastById(id)
      },
      add: (message, type, timeoutMs = DEFAULT_TIMEOUT) => {
        lastVisibleToastsCountRef.current += 1
        const id = nanoid()
        setState(prevState => ({
          visibleToastsCount: lastVisibleToastsCountRef.current,
          toasts: [
            ...prevState.toasts,
            {
              id,
              message,
              type,
              timeout:
                timeoutMs !== Infinity && timeoutMs !== false
                  ? window.setTimeout(() => removeToastById(id), timeoutMs)
                  : undefined,
            },
          ],
        }))

        return id
      },
      replace: (id, message, type, timeoutMs) => {
        setState(prevState => ({
          visibleToastsCount: prevState.visibleToastsCount,
          toasts: prevState.toasts.map(toast => {
            if (toast.id === id) {
              let timeout = toast.timeout

              if (timeoutMs !== undefined) {
                timeout =
                  timeoutMs === Infinity || timeoutMs === false
                    ? undefined
                    : window.setTimeout(
                        () => removeToastById(id),
                        timeoutMs === true ? DEFAULT_TIMEOUT : timeoutMs,
                      )

                if (toast.timeout) {
                  clearTimeout(toast.timeout)
                }
              }

              return {
                id,
                message,
                type: type || toast.type,
                timeout,
              }
            }

            return toast
          }),
        }))
      },
    }
  }, [])
  const handleToastExited = () => {
    lastVisibleToastsCountRef.current -= 1
    setState(prevState => ({
      ...prevState,
      visibleToastsCount: lastVisibleToastsCountRef.current,
    }))
  }
  useEffect(
    () => () => {
      // Clear timeouts on unmount
      setState(prevState => {
        prevState.toasts.forEach(toast => {
          if (toast.timeout) {
            clearTimeout(toast.timeout)
          }
        })

        return {
          visibleToastsCount: 0,
          toasts: [],
        }
      })
    },
    [],
  )

  return (
    <ToastsContext.Provider value={contextValue}>
      {children}
      <ToastsList
        role="toasts-list"
        className="fixed right-0 left-0 p-2 bottom-0"
      >
        <TransitionGroup
          style={{
            height: `${state.visibleToastsCount * 47}px`,
            maxHeight: `${state.visibleToastsCount * 47}px`,
          }}
        >
          {state.toasts.map(toast => {
            return (
              <CSSTransition
                key={toast.id}
                timeout={TOAST_ANIMATION_TIMEOUT}
                classNames={{
                  exit: `animated ${toast.exitClassName ||
                    'fadeOutUp'} faster relative`,
                }}
                onExited={handleToastExited}
              >
                <div className="block leading-none pt-1 max-w-xl ml-auto text-right">
                  <ToastComponent
                    message={toast.message}
                    type={toast.type}
                    enableRemoveButton={toast.timeout === undefined}
                    onRemove={exitClassName =>
                      contextValue.remove(toast.id, exitClassName)
                    }
                    className="text-left"
                  />
                </div>
              </CSSTransition>
            )
          })}
        </TransitionGroup>
      </ToastsList>
    </ToastsContext.Provider>
  )
}

ToastsProvider.displayName = 'ToastsProvider'

export default ToastsProvider

export { TOAST_ANIMATION_TIMEOUT, DEFAULT_TIMEOUT as DEFAULT_TOAST_TIMEOUT }
