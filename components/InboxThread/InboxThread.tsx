import moment from 'moment'
import Link from 'next/link'
import React from 'react'
import styled, { StyledProps } from 'styled-components'
import { MessageThreadable, MessageThreadType } from '~/redux/ducks/inbox'
import Icon from '../Icon'
import { channel } from '~/base/common/constants'
import { Page } from '~/base/common'

const { useMemo } = React
const Container = styled.a`
  padding: 10px;
  width: 100%;
  background: none;
  text-align: left;
  border: 0;
  display: block;
  color: #333;
  line-height: 1;

  &:hover {
    background: #f1f5f7;
    cursor: pointer;
    text-decoration: none;
  }

  ${(props: StyledProps<{ active?: boolean }>) =>
    props.active
      ? `
      background: #e9eff1 !important;
      box-shadow: inset -3px 0 ${channel.theme.color.secondary[500]};
  `
      : ''}
`

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  background-color: rgba(0, 0, 0, 0.15);
  background-position: center;
  background-size: cover;
  border-radius: ${(props: { isGroup?: boolean }) =>
    props.isGroup ? '10px' : '50%'};
  float: left;
  margin-left: -52px;
  margin-top: -3px;
  position: relative;
`

const Body = styled.div`
  padding: 2px 0 2px 52px;
  line-height: 1;
  height: 40px;
`

const AvatarIcon = styled.span`
  display: block;
  border-radius: 50%;
  position: absolute;
  right: -5px;
  bottom: -5px;
  width: 20px;
  height: 20px;
  font-size: 10px;
  z-index: 10;
  padding: 3px 0 0;
  background: ${channel.theme.color.primary[500]};
  color: #fff;
  text-align: center;
  border: 2px solid #fff;
`

const Timestamp = styled.abbr`
  color: #999;
  font-size: 13px;
  float: right;
`

interface InboxThreadProps {
  readonly className?: string
  readonly viewerSlug: string
  readonly active?: boolean
  readonly thread: MessageThreadType
}

const InboxThread: React.FC<InboxThreadProps> = ({
  active,
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
        pathname: Page.Inbox,
        query: { viewerSlug, threadId: thread.id },
      }}
      as={`/mensagens/${viewerSlug}/${thread.id}`}
    >
      <Container
        href={`/mensagens/${viewerSlug}/${thread.id}`}
        className={className}
        active={active}
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
          >
            {isGroup && (
              <AvatarIcon>
                <Icon name="group" />
              </AvatarIcon>
            )}
          </Avatar>
          {lastMessageMoment && (
            <Timestamp title={lastMessageMoment.format()} className="ml-2">
              {lastMessageMoment.fromNow()}
            </Timestamp>
          )}
          <span className="font-medium block mb-1 truncate">
            {thread.threadableNode.name}
          </span>
          <span className="block truncate text-sm text-gray-600">
            {thread.threadable === MessageThreadable.Project ? 'Você: ' : ''}
            {thread.lastMessage && thread.lastMessage.body}
          </span>
        </Body>
      </Container>
    </Link>
  )
}

InboxThread.displayName = 'InboxThread'

export default InboxThread
