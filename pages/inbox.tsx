import { NextPageContext, NextPage } from 'next'
import React from 'react'
import { useQuery } from 'react-apollo-hooks'
import styled, { StyledProps } from 'styled-components'
import {
  GQL_THREADS_LIST,
  GQLQueryThreadsListType,
  InboxScreen,
} from '~/common/chat'
import InboxConversation from '~/components/InboxConversation'
import InboxConversationContext from '~/components/InboxConversationContext'
import InboxThreadsList from '~/components/InboxThreadsList'
import { filterThreads } from '~/components/InboxThreadsList/utils'
import Layout from '~/components/Layout'
import Meta from '~/components/Meta'
import OrganizationLayout from '~/components/OrganizationLayout/OrganizationLayout'
import { NotFoundPageError } from '~/lib/next/errors'
import { resolveViewer } from '~/lib/utils/inbox'
import {
  InboxContextKind,
  InboxContextType,
  InboxViewer,
  InboxViewerKind,
  MessageThreadable,
  MessageThreadType,
  setInboxContext,
} from '~/redux/ducks/inbox'
import { addViewer, ViewerRegistor } from '~/redux/ducks/inbox-viewers'
import { RootState } from '~/redux/root-reducer'
import { Config } from '../common'

const { useState, useEffect, useMemo } = React

const Page = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  ${(props: StyledProps<{ viewerKind: InboxViewerKind }>) => `
    top: ${(props.viewerKind === InboxViewerKind.Organization ? 50 : 0) +
      Config.toolbar.height}px
  `};
`

interface InboxPageProps {
  readonly className?: string
  readonly viewer: InboxViewer
  readonly threadId?: string
  readonly initialScreen: InboxScreen
}

interface InboxPageState {
  currentScreen: InboxScreen
}

const InboxPage: NextPage<InboxPageProps> = ({
  initialScreen,
  viewer,
  threadId,
}) => {
  const [state, setState] = useState<InboxPageState>({
    currentScreen: initialScreen,
  })
  const { data, error } = useQuery<GQLQueryThreadsListType>(GQL_THREADS_LIST, {
    variables: {
      first: 20,
      viewerId:
        viewer.kind === InboxViewerKind.Organization
          ? parseInt(viewer.id, 10)
          : undefined,
      viewerType:
        viewer.kind === InboxViewerKind.Organization ? 'organization' : 'user',
    },
  })

  if (error) {
    throw error
  }
  const threads: MessageThreadType[] = useMemo(() => {
    const arr: MessageThreadType[] = []
    if (data && data.listThreads) {
      data.listThreads.edges.forEach(edge => arr.push(edge.node))
    }
    return arr
  }, [data])
  const currentThread = useMemo(() => {
    const thread = threads.find(t => t.id === threadId)
    if (thread) {
      thread.messages = []
    }
    return thread
  }, [threadId])

  useEffect(() => {
    if (state.currentScreen !== initialScreen) {
      setState({ currentScreen: initialScreen })
    }
  }, [initialScreen])

  const children = (
    <>
      <Meta title="Caixa de entrada" />

      <Page viewerKind={viewer.kind}>
        <InboxThreadsList
          currentThread={currentThread}
          viewer={viewer}
          threads={threads}
          currentScreen={state.currentScreen}
        />
        <InboxConversation
          thread={currentThread}
          threadsList={threads}
          viewer={viewer}
        />
        <InboxConversationContext />
      </Page>
    </>
  )

  return viewer.kind === InboxViewerKind.Organization ? (
    <OrganizationLayout
      layoutProps={{ disableFooter: true }}
      isViewerMember
      organization={viewer.node}
    >
      {children}
    </OrganizationLayout>
  ) : (
    <Layout disableFooter>{children}</Layout>
  )
}

InboxPage.displayName = 'InboxPage'

InboxPage.getInitialProps = async ({ store, query }: NextPageContext) => {
  const { user, inbox } = store.getState() as RootState

  if (
    !user ||
    !Config.chat.enabled ||
    (Config.chat.beta && !user.chat_enabled)
  ) {
    throw new NotFoundPageError()
  }

  const viewer = resolveViewer(query.viewerSlug as string, user)
  let { threadId } = query as { threadId: string | undefined }

  if (!viewer) {
    throw new NotFoundPageError()
  }

  // Add Viewer
  store.dispatch(addViewer({ viewer, registor: ViewerRegistor.InboxPage }))

  let initialScreen = InboxScreen.Threads
  if (typeof threadId !== 'string') {
    const filteredThreads = filterThreads(inbox.threadsById, viewer)
    threadId = filteredThreads.length > 0 ? filteredThreads[0].id : undefined
  } else {
    initialScreen = InboxScreen.Conversation
  }

  let dispatchedContext = false
  if (threadId) {
    const thread = inbox.threadsById[threadId]

    if (thread) {
      dispatchedContext = true
      store.dispatch(
        setInboxContext({
          kind:
            thread.threadable === MessageThreadable.Organization
              ? InboxContextKind.Organization
              : thread.threadable === MessageThreadable.Project
              ? InboxContextKind.Project
              : InboxContextKind.User,
          slug: thread.threadableNode.slug,
          node: thread.threadableNode,
        } as InboxContextType),
      )
    }
  }

  if (inbox.context && !dispatchedContext) {
    store.dispatch(setInboxContext(undefined))
  }

  return {
    viewer,
    threadId,
    initialScreen,
  }
}

export default InboxPage
