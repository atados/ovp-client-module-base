import { createAction, createReducer, PayloadAction } from 'redux-handy'
import { Organization } from './organization'
import { Project } from './project'
import { PublicUser } from './public-user'
import { User, UserOrganization } from './user'

interface SimpleUser {
  uuid: string
  name: string
  slug: string
  avatar?: {
    image_url: string
    image_small_url: string
  }
}

export type MessageAuthor = SimpleUser

export interface Messageviewer {
  id: string
  name: string
  slug: string
  type: 'organization'
  image?: {
    image_url: string
    small_image_url: string
  }
}

export enum MessageSenderKind {
  User = '0',
  Organization = '1',
}

interface BaseMessage {
  id: string
  threadId: string
  body: string
  createdAt: string
  author: MessageAuthor
  sending?: false
}

export interface OrganizationMessage extends BaseMessage {
  senderKind: MessageSenderKind.Organization
  sender: Organization
}

export interface UserMessage extends BaseMessage {
  senderKind: MessageSenderKind.User
  sender: User
}

export interface PendingMessage {
  id: string
  threadId: string
  body: string
  createdAt: string
  sending: true
}

export type RegisteredMessage = OrganizationMessage | UserMessage
export type Message = PendingMessage | RegisteredMessage

export enum MessageThreadable {
  User = '0',
  Organization = '1',
  Project = '2',
}

export enum InboxViewerKind {
  Organization,
  User,
}

interface InboxViewerFilter {
  id: string
  label: string
}

interface InboxUserViewer {
  id: string
  kind: InboxViewerKind.User
  slug: string
  node: User
  filters: InboxViewerFilter[]
}

interface InboxOrganizationViewer {
  id: string
  slug: string
  kind: InboxViewerKind.Organization
  node: UserOrganization
  filters: InboxViewerFilter[]
}

export type InboxViewer = InboxUserViewer | InboxOrganizationViewer

interface BaseMessageThread {
  id: string
  threadableId: string
  viwerId: string
  viewerKind: InboxViewerKind
  messages: Message[]
  lastMessage?: Message
}

interface MessageUserThread extends BaseMessageThread {
  threadable: MessageThreadable.User
  threadableNode: SimpleUser
}

interface MessageOrganizationThread extends BaseMessageThread {
  threadable: MessageThreadable.Organization
  threadableNode: Organization
}

interface MessageProjectThread extends BaseMessageThread {
  threadable: MessageThreadable.Project
  threadableNode: Project
}

export type MessageThreadType =
  | MessageUserThread
  | MessageProjectThread
  | MessageOrganizationThread

export enum InboxContextKind {
  Organization,
  User,
  Project,
}

interface InboxContextProjectType {
  kind: InboxContextKind.Project
  slug: string
  node: Project
}

interface InboxContextOrganizationType {
  kind: InboxContextKind.Organization
  slug: string
  node: Organization
}

interface InboxContextUserType {
  kind: InboxContextKind.User
  slug: string
  node: PublicUser
}

export type InboxContextType =
  | InboxContextProjectType
  | InboxContextOrganizationType
  | InboxContextUserType

export interface InboxReducerState {
  context?: InboxContextType
  threadsById: {
    [id: string]: MessageThreadType
  }
}

export const setInboxContext = createAction<InboxContextType | undefined>(
  'INBOX_CONTEXT_SET',
)
export const addMessage = createAction<Message>('INBOX_ADD_MESSAGE')

export default createReducer<InboxReducerState>(
  {
    [String(setInboxContext)]: (state, action) => ({
      ...state,
      context: action.payload,
    }),
    [String(addMessage)]: (state, action: PayloadAction<Message>) => {
      if (action.error) {
        return state
      }

      const message = action.payload as Message
      const thread = state.threadsById[message.threadId]

      return {
        ...state,
        threadsById: {
          ...state.threadsById,
          [thread.id]: {
            ...thread,
            messages: [...thread.messages, message],
          },
        },
      }
    },
  },
  {
    threadsById: {},
  },
)
