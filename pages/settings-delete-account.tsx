import React from 'react'
import {
  ViewerSettingsLayout,
  getViewerSettingsInitialProps,
} from '~/components/ViewerSettings'
import Icon from '../components/Icon'
import { FormattedMessage, useIntl, defineMessages } from 'react-intl'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../redux/root-reducer'
import useFetchAPIMutation from '../hooks/use-fetch-api-mutation'
import { logout } from '../redux/ducks/user'
import { NextPage } from 'next'
import Meta from '../components/Meta'
import { pushToDataLayer } from '../lib/tag-manager'
import Router from 'next/router'

const m = defineMessages({
  metaTitle: {
    id: 'settingsDeleteAccount.metaTitle',
    defaultMessage: 'Desativar minha conta',
  },

  areYouSure: {
    id: 'areYouSure',
    defaultMessage: 'Tem certeza?',
  },
})

const SettingsDeleteAccountPage: NextPage<{}> = () => {
  const intl = useIntl()
  const dispatchToRedux = useDispatch()
  const viewer = useSelector((state: RootState) => state.user!)
  const updateViewerMutation = useFetchAPIMutation(() => ({
    endpoint: '/users/current-user/',
    method: 'PATCH',
  }))
  const handleSubmit = async () => {
    if (!confirm(intl.formatMessage(m.areYouSure))) {
      return
    }
    if (!updateViewerMutation.loading) {
      await updateViewerMutation.mutate({
        deleted: true,
      })
      pushToDataLayer({
        event: 'user.deleteAccount',
      })

      dispatchToRedux(logout())
      Router.push('/')
    }
  }

  if (!viewer) {
    return null
  }

  return (
    <ViewerSettingsLayout>
      <Meta title={intl.formatMessage(m.metaTitle)} />
      <div className="bg-white shadow rounded-lg">
        <div className="py-4 px-4">
          <h4 className="font-normal mb-0 text-xl leading-loose">
            <Icon
              name="close"
              className="bg-gray-200 rounded-full w-10 h-10 text-center mr-4"
            />
            {intl.formatMessage(m.metaTitle)}
          </h4>
          <div className="border rounded-lg mt-12 max-w-sm p-3 mx-auto mb-12 border-red-500">
            <h4 className="font-normal text-xl text-center">
              <FormattedMessage
                id="settingsDeleteAccount.title"
                defaultMessage="Quero encerrar minha conta"
              />
            </h4>
            <p className="text-center">
              <FormattedMessage
                id="settingsDeleteAccount.description"
                defaultMessage="Ao encerrar sua conta, seu perfil não aparecerá mais em nossa plataforma."
                values={{ email: <b>{viewer.email}</b> }}
              />
            </p>
            <button
              type="button"
              className="btn text-white w-full block bg-red-500"
              onClick={handleSubmit}
              disabled={updateViewerMutation.loading}
            >
              <FormattedMessage
                id="settingsDeleteAccount.submit"
                defaultMessage="Quero encerrar minha conta"
              />{' '}
              <Icon name="close" className="ml-1" />
            </button>
          </div>
        </div>
      </div>
    </ViewerSettingsLayout>
  )
}

SettingsDeleteAccountPage.displayName = 'SettingsDeleteAccountPage'
SettingsDeleteAccountPage.getInitialProps = getViewerSettingsInitialProps

export default SettingsDeleteAccountPage
