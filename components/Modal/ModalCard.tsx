import * as React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  border-width: 0;
  border-radius: 10px;
`

interface ModalCardProps {
  readonly className?: string
}

const ModalCard: React.SFC<ModalCardProps> = ({ className, children }) => (
  <Container className={`card ${className ? ` ${className}` : ''}`}>
    {children}
  </Container>
)

ModalCard.displayName = 'ModalCard'
ModalCard.defaultProps = {
  className: undefined,
}

export default ModalCard
