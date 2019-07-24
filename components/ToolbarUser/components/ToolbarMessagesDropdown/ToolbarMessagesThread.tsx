import moment from 'moment'
import Link from 'next/link'
import React from 'react'
import styled from 'styled-components'
import { resolvePage } from '~/common/page'
import { MessageThreadable, MessageThreadType } from '~/redux/ducks/inbox'

const { useMemo } = React
const Container = styled.a`
  border-bottom: 1px solid #ddd;
  height: 58px;
  padding: 8px 12px;
  display: block;
  color: #333;

  &:hover {
    text-decoration: none;
    background: #f6f7f8;
  }
`

const Body = styled.div`
  padding-left: 57px;
`

const Avatar = styled.div`
  border-radius: 50%;
  background-color: #ddd;
  width: 42px;
  height: 42px;
  margin-left: -57px;
  float: left;
  background-position: center;
  background-size: cover;
  border-radius: ${(props: { isGroup?: boolean }) =>
    props.isGroup ? '10px' : '50%'};
`

const Name = styled.span`
  font-size: 13px;
`

const LastMessageText = styled.span`
  font-size: 13px;
`

const Timestamp = styled.abbr`
  color: #999;
  font-size: 13px;
  float: right;
`

interface ToolbarMessagesThreadProps {
  readonly className?: string
  readonly viewerSlug: string
  readonly thread: MessageThreadType
}

const ToolbarMessagesThread: React.FC<ToolbarMessagesThreadProps> = ({
  className,
  thread,
  viewerSlug,
}) => {
  const image =
    thread.threadable === MessageThreadable.User
      ? thread.threadableNode.avatar
      : thread.threadableNode.image
  const isGroup = thread.threadable === MessageThreadable.Project
  const lastMessageMoment = useMemo(
    () =>
      thread.lastMessage && moment(parseInt(thread.lastMessage.createdAt, 10)),
    [thread.lastMessage],
  )

  return (
    <Link
      href={{
        pathname: resolvePage('/inbox'),
        query: { viewerSlug, threadId: thread.id },
      }}
      as={`/mensagens/${viewerSlug}/${thread.id}`}
    >
      <Container
        href={`/mensagens/${viewerSlug}/${thread.id}`}
        className={className}
      >
        <Body>
          <Avatar
            isGroup={isGroup}
            style={
              image
                ? {
                    backgroundImage: `url('${image.image_url}')`,
                  }
                : undefined
            }
          />
          {lastMessageMoment && (
            <Timestamp title={lastMessageMoment.format()}>
              {lastMessageMoment.fromNow()}
            </Timestamp>
          )}
          <Name className="d-block tw-medium">
            {thread.threadableNode.name}
          </Name>
          <LastMessageText className="d-block tc-muted-dark text-truncate">
            {thread.lastMessage && thread.lastMessage.body}
          </LastMessageText>
        </Body>
      </Container>
    </Link>
  )
}
ToolbarMessagesThread.displayName = 'ToolbarMessagesThread'

export default React.memo(ToolbarMessagesThread)
