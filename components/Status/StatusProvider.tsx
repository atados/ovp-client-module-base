import cx from 'classnames'
import nanoid from 'nanoid'
import React, { useMemo, useState } from 'react'
import styled from 'styled-components'
import Icon from '../Icon'
import StatusContext, { StatusContextType, StatusLevel } from './StatusContext'

const StatusProviderStyled = styled.div`
  position: fixed;
  z-index: 100;
  bottom: 0;
  left: 0;
  right: 0;
`

const Pill = styled.span`
  padding: 2px 8px;
`

interface StatusMessage {
  id: string
  text: string
  level: StatusLevel
}

// tslint:disable-next-line:no-empty-interface
interface StatusProviderProps {}

interface StatusProviderState {
  messages: StatusMessage[]
}

const StatusProvider: React.FC<StatusProviderProps> = ({ children }) => {
  const [state, setState] = useState<StatusProviderState>({ messages: [] })
  const contextValue = useMemo<StatusContextType>(
    () => ({
      register: (messageText, level) => {
        const id = nanoid()
        setState(currentState => ({
          ...currentState,
          messages: [
            ...currentState.messages,
            {
              id,
              text: messageText,
              level,
            },
          ],
        }))

        return id
      },

      unRegister: (id: string) => {
        setState(currentState => ({
          ...currentState,
          messages: currentState.messages.filter(message => message.id !== id),
        }))
      },
    }),
    [setState],
  )

  const countMap = useMemo(() => {
    const obj: { [key: string]: number } = {}
    state.messages.forEach(message => {
      obj[message.level] = obj[message.level] ? obj[message.level] + 1 : 1
    })

    return obj
  }, [state.messages])

  return (
    <StatusContext.Provider value={contextValue}>
      {children}
      <StatusProviderStyled>
        {state.messages.map((message, i) => (
          <div
            key={`${message.text}${i}`}
            className={cx('tc-white ta-center py-1 px-2 text-left flex', {
              'bg-error tc-error': message.level === StatusLevel.Error,
              'bg-warning tc-warning': message.level === StatusLevel.Warning,
            })}
          >
            <span className="tc-white">
              <Icon name="error" className="mr-2" />
              {message.text}
            </span>
            <div className="mr-auto" />
            {i === 0 && (
              <>
                {countMap[StatusLevel.Error] > 0 && (
                  <Pill className="flex rounded-full bg-white uppercase ts-small tw-medium mr-3">
                    {countMap[StatusLevel.Error]} ERRORS
                  </Pill>
                )}
                {countMap[StatusLevel.Warning] > 0 && (
                  <Pill className="flex rounded-full bg-white uppercase ts-small tw-medium mr-3">
                    {countMap[StatusLevel.Warning]} WARNINGS
                  </Pill>
                )}
              </>
            )}
          </div>
        ))}
      </StatusProviderStyled>
    </StatusContext.Provider>
  )
}

StatusProvider.displayName = 'StatusProvider'

export default StatusProvider
