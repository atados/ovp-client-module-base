import React from 'react'
import styled from 'styled-components'
import Icon from '../Icon'

const Container = styled.div`
  max-width: 360px;

  .bullets {
    padding-left: 20px;

    li {
      margin-bottom: 5px;
    }
  }
`

const HelpIcon = styled(Icon)`
  font-size: 28px;
`

interface HelpCardProps {
  readonly className?: string
}

const HelpCard: React.FC<HelpCardProps> = ({ className, children }) => (
  <Container className={`card${className ? ` ${className}` : ''}`}>
    <HelpIcon name="lightbulb_outline" className="text-secondary-500 mb-1" />
    {children}
  </Container>
)

HelpCard.displayName = 'HelpCard'

export default HelpCard
