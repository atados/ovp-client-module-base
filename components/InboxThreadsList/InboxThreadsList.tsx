import React from 'react'
import styled, { StyledProps } from 'styled-components'
import { InboxScreen } from '~/common/chat'
import { InboxViewer, MessageThreadType } from '~/redux/ducks/inbox'
import InboxThread from '../InboxThread'

const Container = styled.div`
  position: absolute;
  bottom: 0;
  display: flex;
  flex-direction: column;
  background: #fff;
  top: 0;

  ${(props: StyledProps<{ show?: boolean }>) => `

  ${
    props.show
      ? `
  right: 0;
  left: 0;
  z-index: 50;
  `
      : `
  display: none;
  `
  }`}

  @media (min-width: 1100px) {
    display: flex !important;
    left: 0px;
    width: 350px;
    box-shadow: inset -1px 0 #ddd;
  }
`

const Header = styled.div`
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05), 0 1px 0px rgba(0, 0, 0, 0.15);
  height: 56px;
  padding: 10px 12px;
  z-index: 10;
  position: relative;
`

const Body = styled.div`
  flex: 1 auto;
  position: relative;
`

const ScrollableArea = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow-y: auto;
  padding-bottom: 120px;
`

// const Footer = styled.div`
//   position: absolute;
//   bottom: 0;
//   left: 0;
//   right: 0;
//   padding: 12px;
//   background: #fff;
//   z-index: 15;
//   box-shadow: inset -1px 0 #ddd;
// `

interface InboxThreadsListProps {
  readonly className?: string
  readonly currentScreen: InboxScreen
  readonly viewer: InboxViewer
  readonly currentThread?: MessageThreadType
  readonly threads: MessageThreadType[]
}

const InboxThreadsList: React.FC<InboxThreadsListProps> = ({
  className,
  threads,
  currentThread,
  viewer,
  currentScreen,
}) => {
  return (
    <Container
      className={className}
      show={currentScreen === InboxScreen.Threads}
    >
      <Header>
        <h4 className="block ts-medium mt-2 text-truncate tw-medium tc-muted-dark">
          Caixa de entrada
        </h4>
      </Header>
      <Body>
        <ScrollableArea>
          <span className="tc-muted ts-tiny mt-2 px-2 mb-1 block">
            Mostrando {threads.length} conversas
          </span>
          {threads.map(thread => (
            <InboxThread
              key={thread.id}
              thread={thread}
              active={currentThread && thread.id === currentThread.id}
              viewerSlug={viewer.slug}
            />
          ))}
        </ScrollableArea>
      </Body>
    </Container>
  )
}

InboxThreadsList.displayName = 'InboxThreadsList'
export default React.memo(InboxThreadsList)
