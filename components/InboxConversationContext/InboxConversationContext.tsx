import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { InboxContextType } from '~/redux/ducks/inbox'
import { ReduxState } from '~/redux/root-reducer'
import { Config } from '~/common'

const Container = styled.div`
  position: fixed;
  top: ${Config.toolbar.height}px;
  bottom: 0;
  width: 260px;
  right: 0;
  background: #f6f7f8;
  border-left: 1px solid #ddd;
  color: #666;
  display: none;

  @media (min-width: 1100px) {
    display: block;
  }

  &:hover {
    color: #333;
  }
`

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  background: #999 center;
  background-size: cover;
  border-radius: 50%;
`

interface InboxConversationContextProps {
  readonly className?: string
  readonly value?: InboxContextType
}

const InboxConversationContext: React.FC<InboxConversationContextProps> = ({
  className,
  value,
}) => (
  <Container className={className}>
    {value && (
      <div className="p-3">
        <div className="media mb-6">
          <Avatar
            style={{
              backgroundImage:
                'url(https://pbs.twimg.com/profile_images/901699146993737729/mi3uhA15_reasonably_small.jpg)',
            }}
          />
          <div className="media-body ml-2">
            <h2 className="text-base font-medium mb-0 leading-none">
              {value.node.name}
            </h2>
            <a href="" className="text-sm">
              Ver perfil
            </a>
          </div>
        </div>
        <h4 className="text-xs text-gray-600 mb-1">SOBRE</h4>
        <p className="text-sm">
          In this post, I’m describing most of the React programming model from
          first principles. I don’t explain how to use it — just how it works.
        </p>
        <h4 className="text-xs text-gray-600 mb-1">TELEFONE</h4>
        <p className="text-sm">(11) 9 7657 4407</p>
        <h4 className="text-xs text-gray-600 mb-1">EMAIL</h4>
        <p className="text-sm">vin175pacheco@gmail.com </p>
      </div>
    )}
  </Container>
)

InboxConversationContext.displayName = 'InboxConversationContext'

const mapStateToProps = ({ inbox }: ReduxState) => ({
  value: inbox.context,
})
export default connect(mapStateToProps)(InboxConversationContext)
