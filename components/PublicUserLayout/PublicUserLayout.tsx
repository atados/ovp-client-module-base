import { NextContext } from 'next'
import Link from 'next/link'
import { withRouter, WithRouterProps } from 'next/router'
import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { resolvePage } from '~/common/page'
import { NotFoundPageError } from '~/lib/next/errors'
import { fetchPublicUser, PublicUser } from '~/redux/ducks/public-user'
import { RootState } from '~/redux/root-reducer'
import Layout from '../Layout'

const Container = styled.div`
  @media (max-width: 767px) {
    padding-left: 0 !important;
    padding-right: 0 !important;
    width: auto !important;
    max-width: none !important;
  }
`

const Body = styled.div`
  flex: 1 1 auto;

  @media (min-width: 768px) {
    padding: 0 !important;
    width: auto !important;
    margin: 0;
    max-width: none !important;
  }
`
const Sidebar = styled.div`
  > .ratio {
    max-width: 200px;
    margin: 0 auto;
  }

  padding-top: 20px;
  padding-bottom: 20px;

  @media (min-width: 768px) {
    background: none !important;

    > .ratio {
      max-width: none;
    }

    width: 220px;
    min-width: 220px;
    padding: 0;
    margin: 0 40px 0 0;
  }
`

const Avatar = styled.figure`
  height: 100%;
  width: 100%;
  background-size: cover;
  background-position: center;
  border-radius: 4px;
`

const Name = styled.h1`
  font-size: 24px;
`

interface PublicUserLayoutProps {
  readonly isAuthenticatedUser?: boolean
  readonly publicUser?: PublicUser
  readonly sidebar?: React.ReactNode
  readonly children?: React.ReactNode
}

const PublicUserLayout: React.FC<PublicUserLayoutProps & WithRouterProps> = ({
  publicUser,
  isAuthenticatedUser,
  children,
  sidebar,
}) => {
  if (!publicUser) {
    return <Layout />
  }

  return (
    <Layout toolbarProps={{ fixed: true }}>
      <div className="p-toolbar">
        <Container className="container d-md-flex py-5">
          <Sidebar className="container ta-center ta-md-left">
            {sidebar || (
              <>
                <div className="ratio mb-3">
                  <div className="ratio-fill" style={{ paddingTop: '100%' }} />
                  <div className="ratio-body">
                    <Avatar
                      style={{
                        backgroundColor: publicUser.color,
                        backgroundImage: publicUser.avatar
                          ? `url('${publicUser.avatar.image_url}')`
                          : undefined,
                      }}
                    />
                  </div>
                </div>
                <Name>{publicUser.name}</Name>
                <p className="ts-small tc-muted">{publicUser.profile.about}</p>
                {isAuthenticatedUser && (
                  <Link
                    href={{
                      pathname: resolvePage('/settings-user'),
                      query: { slug: publicUser.slug },
                    }}
                    as="/configuracoes/perfil"
                  >
                    <a className="btn btn-default btn--block">Editar perfil</a>
                  </Link>
                )}
              </>
            )}
          </Sidebar>
          <Body className="container">{children}</Body>
        </Container>
      </div>
    </Layout>
  )
}

PublicUserLayout.displayName = 'PublicUserLayout'
export const getPublicUserLayoutInitialProps = async ({
  store,
  query: { slug },
}: NextContext) => {
  if (typeof slug !== 'string') {
    throw new NotFoundPageError()
  }

  try {
    const { payload, error } = await store.dispatch(fetchPublicUser(slug))

    if (error) {
      throw payload as Error
    }

    return {}
  } catch (error) {
    if (error.status === 404) {
      throw new NotFoundPageError()
    }

    throw error
  }
}

const mapStateToProps = ({ user, publicUser }: RootState) => ({
  isAuthenticatedUser: !!(
    publicUser.node &&
    user &&
    user.slug === publicUser.node.slug
  ),
  publicUser: publicUser.node,
})

export default React.memo(
  withRouter<PublicUserLayoutProps>(connect(mapStateToProps)(PublicUserLayout)),
)
