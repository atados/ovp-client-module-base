import React from 'react'
import cx from 'classnames'
import Layout from '../Layout'
import { FormattedMessage } from 'react-intl'
import PageLink from '../PageLink'
import ViewerSettingsNavItem from '~/components/ViewerSettings/ViewerSettingsNavItem'
import { Page } from '~/base/common'
import { withRouter } from 'next/router'
import { WithRouterProps } from 'next/dist/client/with-router'

interface ViewerSettingsLayoutProps {
  readonly className?: string
}

const ViewerSettingsLayout: React.FC<
  ViewerSettingsLayoutProps & WithRouterProps
> = ({ className, children, router }) => {
  return (
    <Layout className={cx('bg-gray-200', className)}>
      <div className="container py-5">
        <div className="row">
          <div className="col-md-3 mb-4">
            <PageLink href="ViewerSettings" passHref>
              <ViewerSettingsNavItem
                icon="person"
                active={router.pathname === Page.ViewerSettings}
              >
                <FormattedMessage
                  id="viewerSettings.profile"
                  defaultMessage="Meu perfil de voluntário"
                />
              </ViewerSettingsNavItem>
            </PageLink>
            <PageLink href="ViewerSettingsPassword" passHref>
              <ViewerSettingsNavItem
                icon="lock"
                active={router.pathname === Page.ViewerSettingsPassword}
              >
                <FormattedMessage
                  id="viewerSettings.password"
                  defaultMessage="Alterar senha"
                />
              </ViewerSettingsNavItem>
            </PageLink>
            <PageLink href="ViewerSettingsNewsletter" passHref>
              <ViewerSettingsNavItem
                icon="email"
                active={router.pathname === Page.ViewerSettingsNewsletter}
              >
                <FormattedMessage
                  id="viewerSettings.newsletter"
                  defaultMessage="Newsletter"
                />
              </ViewerSettingsNavItem>
            </PageLink>
            <PageLink href="ViewerOrganizations" passHref>
              <ViewerSettingsNavItem
                icon="group"
                active={router.pathname === Page.ViewerOrganizations}
              >
                <FormattedMessage
                  id="viewerSettings.organizations"
                  defaultMessage="ONGs que sou membro"
                />
              </ViewerSettingsNavItem>
            </PageLink>
          </div>
          <div className="col-md-9">{children}</div>
        </div>
      </div>
    </Layout>
  )
}

ViewerSettingsLayout.displayName = 'ViewerSettingsLayout'

export default withRouter(ViewerSettingsLayout)
