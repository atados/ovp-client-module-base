import { ApolloError } from 'apollo-client'
import * as React from 'react'
import styled from 'styled-components'
import StatusBar from './Statusbar'

const Container = styled(StatusBar)`
  background: #d6002a;
  width: 100%;
  overflow-x: auto;
  white-space: nowrap;
  text-overflow: initial;

  &::-webkit-scrollbar {
    display: none;
  }
`

interface ErrorStatusbarProps {
  readonly className?: string
  readonly error?: Error | ApolloError
}

const ErrorStatusbar: React.SFC<ErrorStatusbarProps> = ({ className, error }) =>
  error ? <Container className={className}>{error.message}</Container> : null

ErrorStatusbar.displayName = 'ErrorStatusbar'

export default ErrorStatusbar
