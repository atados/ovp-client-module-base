import * as React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  padding: 5px;
  text-overflow: ellipsis;
  white-space: nowrap;
  background: #333;
  text-align: center;
  font-size: 14px;
  z-index: 1000;
  color: #fff;
`

interface StatusbarProps {
  readonly className?: string
}

const Statusbar: React.SFC<StatusbarProps> = ({ className, children }) => (
  <Container className={className}>{children}</Container>
)

Statusbar.displayName = 'Statusbar'

export default Statusbar
