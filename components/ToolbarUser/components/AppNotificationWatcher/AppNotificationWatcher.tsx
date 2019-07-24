import gql from 'graphql-tag'
import * as React from 'react'
import styled, { keyframes } from 'styled-components'
import { GQL_THREADS_LIST, GQLQueryThreadsListType } from '~/common/chat'
import useEffectSubscription from '~/hooks/use-effect-subscription'
import {
  InboxViewer,
  InboxViewerKind,
  MessageSenderKind,
  RegisteredMessage,
} from '~/redux/ducks/inbox'
import { User } from '~/redux/ducks/user'

const stackUpAnimation = keyframes`
  0% {
    margin-bottom: -100px;
  }

  100% {
    margin-bottom: 0;
  }
`

const { useRef, useState } = React
const Container = styled.div`
  position: fixed;
  width: 300px;
  padding: 10px;
  bottom: 0;
  left: 0;
`

const Item = styled.div`
  animation: ${stackUpAnimation} 500ms ease-in-out 0s 1 normal;
  transition: opacity 0.2s;
  position: relative;

  &.first {
    opacity: 0.3;
  }

  &.second {
    opacity: 0.6;
  }
`

const ItemCard = styled.div`
  background: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  padding: 12px;
  margin-bottom: 0.5rem;
  box-shadow: 0 0px 0 1px rgba(0, 0, 0, 0.2),
    0px 14px 36px 2px rgba(0, 0, 0, 0.15);
  padding-left: 3.5rem;

  > h4 {
    font-size: 16px;
    margin-bottom: 0.5rem;
  }

  p {
    font-size: 14px;
    margin: 0;
  }
`

export const GQL_SUBSCRIBE_TO_NEW_MESSAGES = gql`
  subscription AppNotificationWatcher {
    newMessage {
      id
      body
      threadId
      createdAt
      senderKind
      senderId
      author {
        uuid
      }
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
          image {
            image_url
            image_small_url
          }
        }
      }
    }
  }
`

export interface GQLSubscribeToNewMessagesType {
  newMessage: RegisteredMessage
}

const ItemImage = styled.div`
  margin-left: -2.7rem;
  width: 32px;
  height: 32px;
  background-color: #eee;
  background-size: cover;
  background-position: center;
  display: block;
  float: left;
  border-radius: 50%;
`

const MAX_ITEMS_LENGTH = 5

enum NotificationAction {
  NewMessage,
}

enum NotificationSenderKind {
  User,
  Organization,
}

interface AppNotificationItem {
  id: string
  senderSlug: string
  senderName: string
  senderKind: NotificationSenderKind
  action: NotificationAction
  imageURL?: string
  timeout?: number
}

interface AppNotificationWatcherProps {
  readonly className?: string
  readonly user: User
  readonly inboxViewers: InboxViewer[]
}

const AppNotificationWatcher: React.SFC<AppNotificationWatcherProps> = ({
  className,
  user,
  inboxViewers,
}) => {
  const [state, setState] = useState<AppNotificationItem[]>([])
  const notificationAudioRef = useRef<HTMLAudioElement | null>(null)
  useEffectSubscription<GQLSubscribeToNewMessagesType>(
    GQL_SUBSCRIBE_TO_NEW_MESSAGES,
    {
      onSubscriptionData: ({ client, subscriptionData: { data, error } }) => {
        if (error) {
          console.error(error)
        }

        if (!data) {
          return
        }

        const { newMessage } = data

        if (newMessage) {
          try {
            inboxViewers.forEach(inboxViewer => {
              const variables =
                inboxViewer.kind === InboxViewerKind.Organization
                  ? {
                      viewerId: inboxViewer.node.id,
                      viewerType: 'organization',
                    }
                  : {
                      viewerType: 'user',
                    }

              const prev: GQLQueryThreadsListType | null = client.cache.readQuery(
                {
                  query: GQL_THREADS_LIST,
                  variables,
                },
              )

              if (prev) {
                let changed = false
                const updatedData = {
                  ...prev,
                  listThreads: {
                    ...prev.listThreads,
                    edges: prev.listThreads.edges.map(edge => {
                      if (edge.node.id === newMessage.threadId) {
                        changed = true
                        return {
                          ...edge,
                          node: {
                            ...edge.node,
                            lastMessage: newMessage,
                          },
                        }
                      }

                      return edge
                    }),
                  },
                }

                if (changed) {
                  client.cache.writeQuery({
                    query: GQL_THREADS_LIST,
                    data: updatedData,
                  })
                }
              }
            })
          } catch (error) {
            // We don't need to report an error here
          }

          if (newMessage.author.uuid === user.uuid) {
            return
          }

          if (notificationAudioRef.current) {
            if (notificationAudioRef.current.paused) {
              notificationAudioRef.current.currentTime = 0
              notificationAudioRef.current.play()
            }
          }

          const image =
            newMessage.senderKind === MessageSenderKind.Organization
              ? newMessage.sender.image
              : newMessage.sender.avatar

          setState(oldState => [
            ...(oldState.length >= MAX_ITEMS_LENGTH
              ? oldState.slice(oldState.length - (MAX_ITEMS_LENGTH - 1))
              : oldState),
            {
              id: newMessage.id,
              action: NotificationAction.NewMessage,
              senderSlug: newMessage.sender.slug,
              senderName: newMessage.sender.name,
              senderKind:
                newMessage.senderKind === MessageSenderKind.Organization
                  ? NotificationSenderKind.Organization
                  : NotificationSenderKind.User,
              imageURL: image && image.image_small_url,
              timeout: window.setTimeout(() => {
                setState(updatedState =>
                  updatedState.filter(item => item.id !== newMessage.id),
                )
              }, 5000),
            },
          ])
        }
      },
    },
  )

  return (
    <Container className={className}>
      <audio ref={notificationAudioRef} src="/sounds/notification.mp3" />
      {state.map((item, i) => {
        let itemClassName: string | undefined

        if (state.length === MAX_ITEMS_LENGTH - 1) {
          if (i === 0) {
            itemClassName = 'second'
          }
        } else if (state.length > MAX_ITEMS_LENGTH - 1) {
          if (i === 0) {
            itemClassName = 'first'
          } else if (i === 1) {
            itemClassName = 'second'
          }
        }

        return (
          <Item
            key={item.id}
            className={itemClassName}
            style={{ zIndex: 100 + i }}
          >
            <ItemCard>
              <ItemImage
                style={
                  item.imageURL
                    ? { backgroundImage: `url(${item.imageURL})` }
                    : undefined
                }
              />
              <p>
                <a href="" className="tw-medium tc-base">
                  {item.senderName}
                </a>{' '}
                enviou uma nova mensagem
              </p>
              <span className="tc-muted ts-small">Há alguns segundos</span>
            </ItemCard>
          </Item>
        )
      })}
    </Container>
  )
}

AppNotificationWatcher.displayName = 'AppNotificationWatcher'

export default AppNotificationWatcher
