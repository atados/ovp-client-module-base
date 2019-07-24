import { ApolloError } from 'apollo-client'
import React from 'react'
import styled from 'styled-components'
import {
  InboxViewer,
  InboxViewerKind,
  Message,
  MessageSenderKind,
  MessageThreadable,
  MessageThreadType,
} from '~/redux/ducks/inbox'
import InboxMessage from '../InboxMessage'
import ErrorStatusbar from '../Statusbar/ErrorStatusbar'

const { useRef, useEffect } = React

const Container = styled.div`
  flex: 1 1 auto;
  position: relative;
`

const ScrollableArea = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`

const MessagesList = styled.div`
  padding: 16px;
`

interface InboxConversationBodyProps {
  readonly className?: string
  readonly viewer: InboxViewer
  readonly thread: MessageThreadType
  readonly messages: Message[]
  readonly error?: Error | ApolloError
}

const InboxConversationBody: React.FC<InboxConversationBodyProps> = ({
  className,
  thread,
  viewer,
  messages,
  error,
}) => {
  const scrollableAreaRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (scrollableAreaRef.current) {
      scrollableAreaRef.current.scrollTop =
        scrollableAreaRef.current.scrollHeight
    }
  }, [thread, messages])
  const viewerId =
    viewer.kind === InboxViewerKind.Organization
      ? viewer.node.id
      : viewer.node.uuid

  return (
    <Container className={className}>
      <ErrorStatusbar error={error} />
      <ScrollableArea ref={scrollableAreaRef}>
        <div className="mb-auto" />
        <MessagesList>
          {messages.map((message, i) => {
            const previousMessage = messages[i - 1]
            const nextMessage = messages[i + 1]
            const senderId = message.sending
              ? viewerId
              : message.senderKind === MessageSenderKind.Organization
              ? message.sender.id
              : message.sender.uuid
            const nextMessageSenderId =
              nextMessage &&
              (nextMessage.sending
                ? viewerId
                : nextMessage.senderKind === MessageSenderKind.Organization
                ? nextMessage.sender.id
                : nextMessage.sender.uuid)
            const previousMessageSenderId =
              previousMessage &&
              (previousMessage.sending
                ? viewerId
                : previousMessage.senderKind === MessageSenderKind.Organization
                ? previousMessage.sender.id
                : previousMessage.sender.uuid)

            const firstFromSegment = previousMessage
              ? previousMessageSenderId !== senderId
              : true
            const lastFromSegment = nextMessage
              ? nextMessageSenderId !== senderId
              : true

            const sentByViewer = senderId === viewerId

            return (
              <InboxMessage
                key={message.id}
                className={
                  lastFromSegment && i !== messages.length - 1 ? 'mb-3' : ''
                }
                sent={sentByViewer}
                firstFromSegment={firstFromSegment}
                lastFromSegment={lastFromSegment}
                message={message}
                viewerSlug={viewer.slug}
                showAuthorName={
                  !sentByViewer &&
                  firstFromSegment &&
                  thread.threadable === MessageThreadable.Project
                }
              />
            )
          })}
        </MessagesList>
      </ScrollableArea>
    </Container>
  )
}

InboxConversationBody.displayName = 'InboxConversationBody'

export default InboxConversationBody
