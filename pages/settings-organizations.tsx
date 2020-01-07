import React from 'react'
import { NextPage } from 'next'
import {
  ViewerSettingsLayout,
  getViewerSettingsInitialProps,
} from '~/components/ViewerSettings'
import Icon from '../components/Icon'
import { defineMessages, useIntl } from 'react-intl'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/root-reducer'
import PageLink from '../components/PageLink'
import { Color } from '../common'
import Meta from '../components/Meta'

const m = defineMessages({
  title: {
    id: 'pages.settingsOrganizations.title',
    defaultMessage: 'ONGs que eu sou membro',
  },
})

const SettingsNewsletterPage: NextPage<{}> = () => {
  const viewer = useSelector((state: RootState) => state.user!)
  const intl = useIntl()

  return (
    <ViewerSettingsLayout>
      <Meta title={intl.formatMessage(m.title)} />
      <div className="bg-white shadow rounded-lg">
        <div className="p-3">
          <h4 className="font-normal mb-0 text-xl leading-loose">
            <Icon
              name="group"
              className="bg-gray-200 rounded-full w-10 h-10 text-center mr-4"
            />
            {intl.formatMessage(m.title)}
          </h4>
          <div className="row py-4">
            {viewer.organizations.map(o => (
              <div key={o.slug} className="col-md-4 mb-6">
                <PageLink
                  href="Organization"
                  params={{ organizationSlug: o.slug }}
                >
                  <a className="block border rounded-lg p-3 td-hover-none mb-6">
                    <figure
                      className="w-16 h-16 rounded-full block bg-cover bg-center"
                      style={
                        o.image
                          ? { backgroundImage: `url('${o.image.image_url}')` }
                          : { backgroundColor: Color.gray[500] }
                      }
                    ></figure>
                    <b className="text-gray-800">{o.name}</b>
                    <span className="text-gray-600 text-sm block">
                      {o.description}
                    </span>
                  </a>
                </PageLink>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ViewerSettingsLayout>
  )
}

SettingsNewsletterPage.displayName = 'SettingsNewsletterPage'
SettingsNewsletterPage.getInitialProps = getViewerSettingsInitialProps

export default SettingsNewsletterPage
