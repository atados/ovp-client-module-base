import gql from 'graphql-tag'
import * as React from 'react'
import { useQuery } from 'react-apollo-hooks'
import { connect } from 'react-redux'
import styled, { keyframes } from 'styled-components'
import useEffectSubscription from '~/hooks/use-effect-subscription'
import { reportError } from '~/lib/utils/error'
import { hasQuerySucceeded } from '~/lib/utils/graphql'
import {
  InboxViewer,
  InboxViewerKind,
  Message,
  MessageThreadable,
  MessageThreadType,
} from '~/redux/ducks/inbox'
import { User } from '~/redux/ducks/user'
import { RootState } from '~/redux/root-reducer'
import Icon from '../Icon'
import {
  GQL_SUBSCRIBE_TO_NEW_MESSAGES,
  GQLSubscribeToNewMessagesType,
} from '../ToolbarUser/components/AppNotificationWatcher/AppNotificationWatcher'
import InboxConversationBody from './InboxConversationBody'
import InboxConversationForm from './InboxConversationForm'
import InboxConversationHeader from './InboxConversationHeader'

const { useState, useEffect, useMemo } = React
const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  display: flex;
  flex-direction: column;

  @media (min-width: 1100px) {
    left: 350px;
    right: 257px;
  }
`

const Info = styled.div`
  margin: 0 auto;
  padding: 20% 0;
  text-align: center;
`

const InfoIcon = styled(Icon)`
  font-size: 120px;
  color: ${props => props.theme.colorPrimary};
`

const InfoAnimatedBG = styled.div`
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 400px;
  overflow: hidden;
`

const AnimatedItemAnimation = keyframes`
  0% {
    margin-left: 0;
    margin-top: 0;
  }


  25% {
    margin-left: 6px;
    margin-top: -6px;
  }

  50% {
    margin-left: 12px;
    margin-top: 0;
  }


  75% {
    margin-left: 0;
    margin-top: 6px;
  }

  100% {
    margin-left: 0;
    margin-top:  0;
  }
`
const ANIMATED_ITEM_SIZE = 110
const AnimatedItem = styled.span`
  display: block;
  width: ${ANIMATED_ITEM_SIZE}px;
  height: ${ANIMATED_ITEM_SIZE}px;
  background: #eee;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.15);
  border-radius: 50%;
  position: absolute;
  background-position: center;
  background-size: cover;
  opacity: 0.5;
  animation: ${AnimatedItemAnimation} 10s ease-in-out 0s infinite normal;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }
`

const GQL_LIST_MESSAGES = gql`
  query InboxConversationBody($first: Int!, $threadId: String!) {
    listMessages(first: $first, threadId: $threadId) {
      edges {
        node {
          id
          body
          threadId
          createdAt
          senderKind
          senderId
          sender {
            ... on User {
              uuid
              name
              slug
              avatar {
                image_url
                image_small_url
              }
            }
            ... on Organization {
              id
              name
              slug
              image {
                image_url
                image_small_url
              }
            }
          }
        }
      }
    }
  }
`

export interface GQLQueryListMessagesType {
  listMessages: {
    edges: Array<{
      node: Message
    }>
  }
}

interface AnimatedItemType {
  id: string
  style: React.CSSProperties
  meta: {
    scale: number
    position: { x: number; y: number }
  }
}

export interface InboxPendingMessage {
  threadId: string
  body: string
  senderId: number
  senderKind: 'organization' | 'user'
}

interface InboxConversationProps {
  readonly className?: string
  readonly thread?: MessageThreadType
  readonly threadsList: MessageThreadType[]
  readonly viewer: InboxViewer
  readonly user: User
}

const sortMessages = (messageA: Message, messageB: Message) => {
  return parseInt(messageA.createdAt, 10) - parseInt(messageB.createdAt, 10)
}

const InboxConversation: React.SFC<InboxConversationProps> = ({
  className,
  thread,
  viewer,
  user,
  threadsList,
}) => {
  const messagesQuery = useQuery<GQLQueryListMessagesType>(GQL_LIST_MESSAGES, {
    skip: !thread,
    variables: {
      first: 20,
      threadId: thread && thread.id,
    },
  })

  const animatedItems: AnimatedItemType[] = useMemo(() => {
    if (thread) {
      return []
    }

    const result: AnimatedItemType[] = []
    let x = 10
    let y = 10
    threadsList.forEach((threadItem, i) => {
      const scale = (Math.floor(Math.random() * (100 - 50 + 1)) + 50) / 100
      const image =
        threadItem.threadable === MessageThreadable.User
          ? threadItem.threadableNode.avatar
          : threadItem.threadableNode.image

      const lastItem = result[result.length - 1]
      const position = { x: 10, y: 10 }

      if (lastItem) {
        if (i % 3 === 0) {
          y = 10
          x +=
            lastItem.meta.position.y +
            ANIMATED_ITEM_SIZE * lastItem.meta.scale +
            20
        } else {
          y +=
            lastItem.meta.position.y +
            ANIMATED_ITEM_SIZE * lastItem.meta.scale +
            20
        }
      }

      position.y = y
      position.x = x + Math.random() * 50

      result.push({
        id: threadItem.id,
        meta: { scale, position },
        style: {
          backgroundImage: image ? `url('${image.image_url}')` : undefined,
          transform: `scale(${scale})`,
          left: `${position.x}px`,
          top: `${position.y}px`,
          animationDuration: `${Math.max(5000, Math.random() * 12000)}ms`,
          animationDelay: `${Math.random() * 1000}ms`,
        },
      })
    })

    return result
  }, [thread, threadsList])
  useEffectSubscription<GQLSubscribeToNewMessagesType>(
    GQL_SUBSCRIBE_TO_NEW_MESSAGES,
    {
      onSubscriptionData: ({
        client: apolloClient,
        subscriptionData: { data },
      }) => {
        if (!data || !thread) {
          return
        }

        try {
          const prev: GQLQueryListMessagesType | null = apolloClient.cache.readQuery(
            {
              query: GQL_LIST_MESSAGES,
              variables: {
                first: 20,
                threadId: thread && thread.id,
              },
            },
          )

          if (prev) {
            apolloClient.cache.writeQuery({
              query: GQL_LIST_MESSAGES,
              data: {
                ...prev,
                listMessages: {
                  ...prev.listMessages,
                  edges: [
                    ...prev.listMessages.edges,
                    {
                      node: data.newMessage,
                      __typename: 'ListMessagesPaginationEdge',
                    },
                  ],
                },
              },
            })
          }
        } catch (error) {
          reportError(error)
        }

        const { newMessage } = data
        if (newMessage && thread && newMessage.threadId === thread.id) {
          let foundFirstSendingMessage = false
          setMessages(oldMessages => [
            ...(newMessage.author.uuid === user.uuid
              ? oldMessages.filter(message => {
                  if (message.sending) {
                    foundFirstSendingMessage = true
                    return false
                  }

                  return message.sending ? foundFirstSendingMessage : true
                })
              : oldMessages),
            newMessage,
          ])
        }
      },
    },
  )
  const [messages, setMessages] = useState<Message[]>(() => [])
  useEffect(() => {
    setMessages(
      hasQuerySucceeded(messagesQuery)
        ? messagesQuery
            .data!.listMessages.edges.map(edge => edge.node)
            .sort(sortMessages)
        : [],
    )
  }, [messagesQuery.data])
  return (
    <Container className={className}>
      {thread && (
        <>
          <InboxConversationHeader thread={thread} viewer={viewer} />
          <InboxConversationBody
            thread={thread}
            messages={messages}
            viewer={viewer}
            error={messagesQuery.error}
          />

          <InboxConversationForm
            viewer={viewer}
            thread={thread}
            setMessages={setMessages}
          />
        </>
      )}
      {!thread && (
        <>
          <Info>
            <InfoAnimatedBG>
              {animatedItems.map(animatedItem => (
                <AnimatedItem
                  key={animatedItem.id}
                  style={animatedItem.style}
                />
              ))}
            </InfoAnimatedBG>
            <InfoIcon name="mail_outline" />
            <h1>Caixa de entrada</h1>
            <p className="tc-muted ts-large">
              Aqui você envia e recebe mensagens de grupos de vaga e
              {viewer.kind === InboxViewerKind.Organization
                ? ' voluntários.'
                : ' ONGs'}
            </p>
          </Info>
        </>
      )}
    </Container>
  )
}

InboxConversation.displayName = 'InboxConversation'
export default connect((state: RootState) => ({ user: state.user! }))(
  InboxConversation,
)
