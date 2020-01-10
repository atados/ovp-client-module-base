import React, { useEffect, useState } from 'react'
import { useQuery } from 'react-apollo-hooks'
import { connect } from 'react-redux'
import styled from 'styled-components'
import ToolbarDropdown from '~/components/Toolbar/ToolbarDropdown'
import { GQL_THREADS_LIST, GQLQueryThreadsListType } from '~/common/chat'
import Icon from '~/components/Icon'
import ErrorStatusbar from '~/components/Statusbar/ErrorStatusbar'
import { hasQuerySucceeded } from '~/lib/utils/graphql'
import { resolveViewer } from '~/lib/utils/inbox'
import { InboxViewer, InboxViewerKind } from '~/redux/ducks/inbox'
import {
  addViewer,
  removeViewer,
  ViewerRegistor,
} from '~/redux/ducks/inbox-viewers'
import { User } from '~/redux/ducks/user'
import { RootState } from '~/redux/root-reducer'
import ToolbarMessagesThread from './ToolbarMessagesThread'

const Header = styled.div`
  height: 36px;
  box-shadow: 0 1px rgba(0, 0, 0, 0.15);
  z-index: 10;
  position: relative;
  padding: 0 0.75rem;

  > h4 {
    font-size: 14px;
    margin: 0;
  }

  > .icon {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: 36px;
    display: block;
    line-height: 2;
    text-align: center;
    background: #fff;
    border-top-left-radius: 4px;

    &::after {
      content: '';
      position: absolute;
      top: 5px;
      bottom: 7px;
      right: -1px;
      width: 1px;
      background: rgba(0, 0, 0, 0.1);
    }
  }
`

const ViewerSelector = styled.div`
  padding-left: 32px;
  padding-top: 5px;
  padding-bottom: 5px;
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  height: 100%;
  white-space: nowrap;

  &::-webkit-scrollbar {
    display: none;
  }
`

const Viewer = styled.button`
  height: 24px;
  padding: 5px 12px;
  border-radius: 14px;
  font-size: 13px;
  margin-right: 0.5rem;

  &.btn-text {
    background: #f6f7f8;

    &:hover {
      background: #e7e8e9;
    }
  }
`

const Body = styled.div`
  position: absolute;
  top: 36px;
  left: 0;
  bottom: 0;
  right: 0;
  overflow-y: auto;
`

interface ToolbarMessagesDropdownProps {
  readonly className?: string
  readonly user: User
  readonly onRegisterViewer: (viewer: InboxViewer) => any
  readonly onUnregisterViewer: (viewerSlug: string) => any
}

interface ToolbarMessagesDropdownState {
  readonly viewer: InboxViewer
  readonly fetch?: boolean
}

const ToolbarMessagesDropdown: React.FC<ToolbarMessagesDropdownProps> = ({
  className,
  user,
  onRegisterViewer,
  onUnregisterViewer,
}) => {
  const [state, setState] = useState<ToolbarMessagesDropdownState>(() => ({
    viewer: resolveViewer('me', user)!,
  }))

  useEffect(() => {
    onRegisterViewer(state.viewer)

    return () => onUnregisterViewer(state.viewer.slug)
  }, [state.viewer])

  const threadsQuery = useQuery<GQLQueryThreadsListType>(GQL_THREADS_LIST, {
    skip: !state.fetch,
    variables: {
      first: 20,
      viewerId:
        state.viewer.kind === InboxViewerKind.Organization
          ? state.viewer.node.id
          : undefined,
      viewerType:
        state.viewer.kind === InboxViewerKind.Organization
          ? 'organization'
          : 'user',
    },
  })

  const { viewer } = state
  return (
    <ToolbarDropdown className={className} title="Mensagens" href="/mensagens">
      <Header>
        <Icon name="email" className="text-primary-500" />
        <ViewerSelector>
          <Viewer
            className={`btn btn-${
              viewer.kind === InboxViewerKind.User ? 'primary' : 'text'
            }`}
            onClick={() =>
              setState({
                fetch: true,
                viewer: resolveViewer('me', user)!,
              })
            }
          >
            Minhas mensagens
          </Viewer>
          {user.organizations.map(organization => (
            <Viewer
              key={organization.id}
              className={`btn btn-${
                viewer.kind === InboxViewerKind.Organization &&
                viewer.node.id === organization.id
                  ? 'primary'
                  : 'text'
              }`}
              onClick={() =>
                setState({
                  fetch: true,
                  viewer: resolveViewer(organization.slug, user)!,
                })
              }
            >
              {organization.name}
            </Viewer>
          ))}
        </ViewerSelector>
      </Header>
      <Body>
        <ErrorStatusbar error={threadsQuery.error} />
        {hasQuerySucceeded(threadsQuery) &&
          threadsQuery.data!.listThreads.edges.map(edge => (
            <ToolbarMessagesThread
              key={edge.node.id}
              thread={edge.node}
              viewerSlug={viewer.slug}
            />
          ))}
      </Body>
    </ToolbarDropdown>
  )
}

ToolbarMessagesDropdown.displayName = 'ToolbarMessagesDropdown'

export default connect(
  (state: RootState) => ({ user: state.user! }),
  dispatch => ({
    onRegisterViewer: (viewer: InboxViewer) =>
      dispatch(
        addViewer({ viewer, registor: ViewerRegistor.ToolbarMessagesDropdown }),
      ),
    onUnregisterViewer: (viewerSlug: string) =>
      dispatch(
        removeViewer({
          viewerSlug,
          registor: ViewerRegistor.ToolbarMessagesDropdown,
        }),
      ),
  }),
)(ToolbarMessagesDropdown)
