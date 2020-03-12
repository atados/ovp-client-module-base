import Link from 'next/link'
import React from 'react'
import { connect } from 'react-redux'
import styled, { StyledProps } from 'styled-components'
import { InboxViewer, InboxViewerKind } from '~/redux/ducks/inbox'
import { User } from '~/redux/ducks/user'
import { ReduxState } from '~/redux/root-reducer'
import Icon from '../Icon'
import { Page, Config } from '~/common'

const Container = styled.div`
  position: fixed;
  top: ${Config.toolbar.height}px;
  left: 0;
  bottom: 0;
  width: 200px;
  background: #f0f1f2;
  box-shadow: inset -1px 0 #ddd;
  display: none;

  @media (min-width: 1100px) {
    display: block;
  }
`

const Option = styled.a`
  border: 0;
  background: none;
  padding: 10px 10px 10px 50px;
  line-height: 1;
  display: block;
  width: 100%;
  text-align: left;
  border-top: 1px solid #ddd;
  color: #333;
  position: relative;

  &:first-child {
    border-top-color: transparent;
  }

  &:hover {
    background: rgba(0, 0, 0, 0.05);
    cursor: pointer;
    color: #333;
    text-decoration: none;
  }

  ${(props: { active?: boolean }) =>
    props.active
      ? `
    background: #457dfe !important;
    color: #fff !important;
    border-top-color: #457dfe;
  `
      : ''}
`

const Avatar = styled.div`
  width: 28px;
  height: 28px;
  background-color: #fff;
  background-position: center;
  background-size: cover;
  border-radius: 50%;
  float: left;
  margin-left: -40px;

  ${(props: { active?: boolean; theme?: any }) =>
    props.active
      ? `
    position: relative;

    &::after {
      content: '';
      width: 36px;
      height: 36px;
      border: 2px solid #fff;
      position: absolute;
      border-radius: 50%;
      left: -4px;
      top: -4px;
    }
  `
      : ''}
`

const OptionName = styled.span`
  padding: 5px 0;
`

const OptionDropButton = styled.span`
  position: absolute;
  right: 10px;
  top: 0;
  bottom: 0;
  margin: auto;
  padding: 5px;
  height: 28px;
  width: 28px;
  border-radius: 50%;
`

const ChildOption = styled.button`
  padding: 2px 10px 2px 40px;
  border: 0;
  background: none;
  cursor: pointer;
  width: 100%;
  display: block;
  text-align: left;

  > span {
    display: block;
    border-radius: 20px;
    font-size: 14px;
    padding: 3px 10px;
    width: 100%;
  }

  &:hover > span {
    background: rgba(0, 0, 0, 0.05);
  }

  ${(props: StyledProps<{ active?: boolean }>) =>
    props.active
      ? `
    > span {
      background: #678 !important;
      color: #fff;
    }
  `
      : ''}
`

const Header = styled.div`
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05), 0 1px 0px rgba(0, 0, 0, 0.15);
  height: 56px;
  padding: 18px 16px;
  z-index: 10;
  position: relative;
  font-size: 16px;

  > .icon {
    font-size: 22px;
    position: relative;
    top: -4px;
    color: #666;
  }
`

const OptionChildren = styled.div`
  padding: 6px 0;
`

interface InboxFiltersProps {
  readonly className?: string
  readonly user: User
  readonly viewer: InboxViewer
}

const InboxFilters: React.FC<InboxFiltersProps> = ({
  className,
  viewer,
  user,
}) => {
  return (
    <Container className={className}>
      <Header>
        <Icon name="inbox" className="mr-2" />
        Caixa de entrada
      </Header>
      <div>
        <Link href={`${'/inbox'}?viewerSlug=me`} as="/mensagens/me">
          <Option
            href="/mensagens/me"
            active={viewer.kind === InboxViewerKind.User}
          >
            <Avatar
              active={viewer.kind === InboxViewerKind.User}
              style={
                user.avatar
                  ? {
                      backgroundImage: `url('${user.avatar.image_url}')`,
                    }
                  : { backgroundColor: user.profile.color }
              }
            />
            <OptionName className="truncate block">Eu</OptionName>
          </Option>
        </Link>
        {user.organizations.map(organization => {
          const active =
            viewer.kind === InboxViewerKind.Organization &&
            viewer.id === String(organization.id)
          return (
            <React.Fragment key={organization.slug}>
              <Link
                href={{
                  pathname: Page.Inbox,
                  query: { viewerSlug: organization.slug },
                }}
                as={`/mensagens/${organization.slug}`}
              >
                <Option
                  href={`/mensagens/${organization.slug}`}
                  active={active}
                >
                  <Avatar
                    active={active}
                    style={
                      organization.image
                        ? {
                            backgroundImage: `url('${organization.image.image_small_url}')`,
                          }
                        : undefined
                    }
                  />
                  <OptionName className="truncate block">
                    {organization.name}
                  </OptionName>
                  <OptionDropButton
                    className={`btn btn-text${active ? '-white' : ''}`}
                  >
                    <Icon name="keyboard_arrow_down" />
                  </OptionDropButton>
                </Option>
              </Link>
              {viewer.filters.length > 0 && (
                <OptionChildren>
                  {viewer.filters.map(filter => (
                    <Link
                      href={{
                        pathname: Page.Inbox,
                        query: {
                          filter: filter.id,
                          viewerSlug: organization.slug,
                        },
                      }}
                      as={`/mensaagens/${organization.slug}/?filter=${filter.id}`}
                    >
                      <ChildOption active>
                        <span className="truncate block">
                          Voluntários por brumadinho
                        </span>
                      </ChildOption>
                    </Link>
                  ))}
                </OptionChildren>
              )}
            </React.Fragment>
          )
        })}
      </div>
    </Container>
  )
}

InboxFilters.displayName = 'InboxFilters'

const mapStateToProps = ({ user }: ReduxState) => ({
  user,
})
export default connect(mapStateToProps)(InboxFilters)
