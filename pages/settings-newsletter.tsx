import React from 'react'
import {
  ViewerSettingsLayout,
  getViewerSettingsInitialProps,
} from '~/components/ViewerSettings'
import Icon from '../components/Icon'
import { FormattedMessage } from 'react-intl'
import ToggleSwitch from '../components/ToggleSwitch'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../redux/root-reducer'
import useFetchAPIMutation from '../hooks/use-fetch-api-mutation'
import { updateViewer } from '../redux/ducks/user'
import { EmptyFunction } from '~/lib/utils/function'
import { NextPage } from 'next'
import Meta from '../components/Meta'
import { pushToDataLayer } from '../lib/tag-manager'

const SettingsNewsletterPage: NextPage<{}> = () => {
  const dispatchToRedux = useDispatch()
  const viewer = useSelector((state: RootState) => state.user!)
  const updateViewerMutation = useFetchAPIMutation(body => ({
    endpoint: '/users/current-user/',
    method: 'PATCH',
    body,
  }))
  const isSubscribed = viewer && viewer.is_subscribed_to_newsletter
  const handleNewsletterToggle = async () => {
    if (!updateViewerMutation.loading) {
      await updateViewerMutation.mutate({
        is_subscribed_to_newsletter: !isSubscribed,
      })
      pushToDataLayer({
        event: isSubscribed ? 'newsletter.unsubscribe' : 'newsletter.subscribe',
      })

      dispatchToRedux(
        updateViewer({
          is_subscribed_to_newsletter: !isSubscribed,
        }),
      )
    }
  }

  if (!viewer) {
    return null
  }

  return (
    <ViewerSettingsLayout>
      <Meta title="Newsletter" />
      <div className="bg-white shadow rounded-lg">
        <div className="py-4 px-4">
          <label htmlFor="newsletter-input-toggler" className="float-right">
            <span className="align-middle mr-4">
              <FormattedMessage
                id="pages.settingsNewsletter.subscribed"
                defaultMessage="Inscrito na newsletter"
              />
            </span>
            <ToggleSwitch
              className="align-middle"
              id="newsletter-input-toggler"
              height={32}
              checked={isSubscribed}
              onChange={EmptyFunction}
            />
          </label>
          <h4 className="font-normal mb-0 text-xl leading-loose">
            <Icon
              name="email"
              className="bg-gray-200 rounded-full w-10 h-10 text-center mr-4"
            />
            <FormattedMessage
              id="pages.settingsNewsletter.title"
              defaultMessage="Newsletter"
            />
          </h4>
          <div className="border rounded-lg mt-12 max-w-sm p-3 mx-auto mb-12">
            <h4 className="font-normal text-xl text-center">
              {isSubscribed ? (
                <FormattedMessage
                  id="settingsNewsletter.subscribed"
                  defaultMessage="Você está inscrito na newsletter"
                />
              ) : (
                <FormattedMessage
                  id="settingsNewsletter.subscribeTitle"
                  defaultMessage="Inscreva-se na newsletter"
                />
              )}
            </h4>
            <p>
              <FormattedMessage
                id="settingsNewsletter.description"
                defaultMessage="Enviamos uma newsletter semanal para o seu email ({email}) com as
                vagas da semana que mais se encaixam com o seu perfil."
                values={{ email: <b>{viewer.email}</b> }}
              />
            </p>
            <button
              type="button"
              className={`btn text-white w-full block ${
                isSubscribed
                  ? 'bg-red-500 hover:bg-red-600'
                  : 'bg-green-500 hover:bg-green-600'
              }`}
              onClick={handleNewsletterToggle}
              disabled={updateViewerMutation.loading}
            >
              {isSubscribed ? (
                <>
                  <FormattedMessage
                    id="settingsNewsletter.unsubscribe"
                    defaultMessage="Não quero mais receber"
                  />{' '}
                  <Icon name="close" className="ml-1" />
                </>
              ) : (
                <>
                  <FormattedMessage
                    id="settingsNewsletter.subscribe"
                    defaultMessage="Quero começar a receber"
                  />{' '}
                  <Icon name="email" className="ml-1" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </ViewerSettingsLayout>
  )
}

SettingsNewsletterPage.displayName = 'SettingsNewsletterPage'
SettingsNewsletterPage.getInitialProps = getViewerSettingsInitialProps

export default SettingsNewsletterPage
