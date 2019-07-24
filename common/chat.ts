import gql from 'graphql-tag'
import { MessageThreadType } from '~/redux/ducks/inbox'

export const GQL_THREADS_LIST = gql`
  query threadsList($first: Int!, $viewerId: Int, $viewerType: ViewerType) {
    listThreads(first: $first, viewerId: $viewerId, viewerType: $viewerType)
      @connection(key: "threads", filter: ["viewerId", "viewerType"]) {
      edges {
        node {
          id
          parentType
          parentId
          threadableId
          threadable
          lastMessage {
            body
            createdAt
          }
          threadableNode {
            ... on User {
              id
              slug
              name
              avatar {
                image_url
              }
            }
            ... on Project {
              id
              name
              slug
              image {
                image_url
              }
            }
            ... on Organization {
              id
              name
              slug
              image {
                image_url
              }
            }
          }
        }
      }
    }
  }
`

export interface GQLQueryThreadsListType {
  listThreads: {
    edges: Array<{
      node: MessageThreadType
    }>
  }
}

export enum InboxScreen {
  Viewers = '0',
  Threads = '1',
  Conversation = '2',
  Context = '3',
}
