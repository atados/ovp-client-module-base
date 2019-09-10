import Link from 'next/link'
import React from 'react'
import styled, { StyledProps } from 'styled-components'
import { Page, PageAs } from '~/common'
import { globalColors } from '~/lib/color/manager'
import { Message, MessageSenderKind } from '~/redux/ducks/inbox'

const Container = styled.div`
  padding: 1px 0;
`

interface BubbleProps {
  sent?: boolean
  firstFromSegment?: boolean
  lastFromSegment?: boolean
  sending?: boolean
}
const Bubble = styled.div`
  padding: 8px 16px;
  max-width: 340px;
  display: inline-block;
  text-align: left;
  position: relative;
  word-break: break-word;

  ${(props: StyledProps<BubbleProps>) => `
    border-radius: ${props.sent ? '20px 2px 2px 20px' : '2px 20px 20px 2px'};

    ${
      props.sending
        ? `
    opacity: .5;
    `
        : ''
    }
  ${
    props.sent
      ? `
  background: #457dfe;
  color: #fff;

  a {
    color: #fff;
    text-decoration: underline;
  }`
      : `
  background: #E5ECEF`
  }

  ${
    props.lastFromSegment
      ? `
      border-bottom-${props.sent ? 'right' : 'left'}-radius: 20px;

      &::after {
        content: '';
        position: absolute;
        ${props.sent ? 'right' : 'left'}: -7px;
        bottom: 1px;
        width: 16px;
        height: 16px;
        display: block;
        background: url(/static/base/icons/message-bg-${
          props.sent ? 'sent' : 'received'
        }.svg) no-repeat center;
      }`
      : ''
  } ${
    props.firstFromSegment
      ? `

      border-top-${props.sent ? 'right' : 'left'}-radius: 20px;
      `
      : ''
  }`}
`

const Avatar = styled.a`
  width: 34px;
  height: 34px;
  position: absolute;
  left: -40px;
  bottom: 0;
  background: #999 center;
  background-size: cover;
  border-radius: 50%;
  display: block;
`

interface InboxMessageProps {
  readonly className?: string
  readonly sent?: boolean
  readonly children?: React.ReactNode
  readonly firstFromSegment?: boolean
  readonly lastFromSegment?: boolean
  readonly viewerSlug: string
  readonly message: Message
  readonly showAuthorName?: boolean
}

const InboxMessage: React.FC<InboxMessageProps> = ({
  className,
  sent,
  firstFromSegment,
  lastFromSegment,
  message,
  showAuthorName,
}) => {
  const image = message.sending
    ? undefined
    : message.senderKind === MessageSenderKind.Organization
    ? message.sender.image
    : message.sender.avatar
  const profileLinkAs = message.sending
    ? undefined
    : message.senderKind === MessageSenderKind.Organization
    ? PageAs.Organization({ organizationSlug: message.sender.slug })
    : PageAs.PublicUser({ slug: message.sender.slug })

  return (
    <Container className={`${className || ''}${sent ? ' ta-right' : ' pl-5'}`}>
      <Bubble
        sent={sent}
        firstFromSegment={firstFromSegment}
        lastFromSegment={lastFromSegment}
        sending={message.sending}
      >
        {!message.sending && lastFromSegment && !sent && (
          <Link
            href={
              message.senderKind === MessageSenderKind.Organization
                ? Page.Organization
                : Page.PublicUser
            }
            as={profileLinkAs}
          >
            <Avatar
              href={profileLinkAs}
              style={
                image
                  ? {
                      backgroundImage: `url('${image.image_url}')`,
                    }
                  : { backgroundColor: globalColors[0] }
              }
            />
          </Link>
        )}
        {showAuthorName && (
          <span
            className="ts-small block tw-medium"
            style={{ color: globalColors[0] }}
          >
            {!message.sending && message.sender.name}
          </span>
        )}
        <span>{message.body}</span>
      </Bubble>
      {message.sending && (
        <span className="tc-muted block ts-tiny">Enviando...</span>
      )}
    </Container>
  )
}

InboxMessage.displayName = 'InboxMessage'

export default React.memo(InboxMessage)
