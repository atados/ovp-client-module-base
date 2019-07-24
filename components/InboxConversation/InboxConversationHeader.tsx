import Link from 'next/link'
import * as React from 'react'
import styled from 'styled-components'
import {
  InboxViewer,
  MessageThreadable,
  MessageThreadType,
} from '~/redux/ducks/inbox'
import Icon from '../Icon'

const Container = styled.div`
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05), 0 1px 0px rgba(0, 0, 0, 0.15);
  height: 56px;
  padding: 10px 16px;
  z-index: 10;
  position: relative;
  position: relative;
`

const Status = styled.span`
  font-size: 13px;
  color: #999;

  &::before {
    content: '#';
    margin-right: 5px;
    display: inline-block;
    color: #999;
  }
`

const Nav = styled.div`
  position: absolute;
  right: 16px;
  top: 0;
  bottom: 0;
  height: 40px;
  margin: auto;

  > .btn-text {
    padding: 4px;
    width: 40px;
    height: 40px;
    font-size: 24px;
    border-radius: 50%;
    color: #678;

    &:hover {
      color: #333;
    }
  }
`

const BackButton = styled.a`
  padding: 4px;
  width: 40px;
  height: 40px;
  font-size: 24px;
  border-radius: 50%;
  color: #678;
  margin-left: -10px;
  margin-right: 10px;

  &:hover {
    color: #333;
  }
`

interface InboxConversationHeaderProps {
  readonly viewer: InboxViewer
  readonly thread: MessageThreadType
  readonly className?: string
}

const InboxConversationHeader: React.SFC<InboxConversationHeaderProps> = ({
  className,
  viewer,
  thread,
}) => (
  <Container className={className}>
    <div className="tl-1">
      <div className="media">
        <Link
          href={`/inbox?viewerSlug=${viewer.slug}`}
          as={`/mensagens/${viewer.slug}`}
        >
          <BackButton
            href={`/mensagens/${viewer.slug}`}
            className="btn btn-text d-lg-none"
          >
            <Icon name="arrow_back" />
          </BackButton>
        </Link>
        <div className="media-body">
          <h1 className="ts-normal tw-medium mb-0">
            {thread.threadableNode.name}
          </h1>
          <Status>
            {thread.threadable === MessageThreadable.Organization
              ? 'ONG'
              : thread.threadable === MessageThreadable.Project
              ? 'Vaga'
              : 'Usuário'}
          </Status>
        </div>
      </div>
      <Nav>
        <button className="btn btn-text">
          <Icon name="info" />
        </button>
      </Nav>
    </div>
  </Container>
)

InboxConversationHeader.displayName = 'InboxConversationHeader'

export default React.memo(InboxConversationHeader)
