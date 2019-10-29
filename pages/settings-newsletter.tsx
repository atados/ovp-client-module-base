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
import useTriggerableFetchApi from '../hooks/use-trigglerable-fetch-api'
import { updateViewer } from '../redux/ducks/user'
import { EmptyFunction } from '~/lib/utils/function'
import { NextPage } from 'next'
import Meta from '../components/Meta'
import { pushToDataLayer } from '../lib/tag-manager'

const SettingsNewsletterPage: NextPage<{}> = () => {
  const dispatchToRedux = useDispatch()
  const viewer = useSelector((state: RootState) => state.user!)
  const updateViewerTrigger = useTriggerableFetchApi('/users/current-user/', {
    method: 'PATCH',
  })
  const isSubscribed = viewer.is_subscribed_to_newsletter
  const handleNewsletterToggle = async () => {
    if (!updateViewerTrigger.loading) {
      await updateViewerTrigger.trigger({
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

  return (
    <ViewerSettingsLayout>
      <Meta title="Newsletter" />
      <div className="bg-white shadow rounded-lg">
        <div className="py-3 px-3">
          <label htmlFor="newsletter-input-toggler" className="float-right">
            <span className="vertical-align-middle mr-3">
              <FormattedMessage
                id="pages.settingsNewsletter.subscribed"
                defaultMessage="Inscrito na newsletter"
              />
            </span>
            <ToggleSwitch
              className="vertical-align-middle"
              id="newsletter-input-toggler"
              height={32}
              checked={isSubscribed}
              onChange={EmptyFunction}
            />
          </label>
          <h4 className="tw-normal mb-0 text-xl leading-loose">
            <Icon
              name="email"
              className="bg-gray-200 rounded-full w-10 h-10 ta-center mr-3"
            />
            <FormattedMessage
              id="pages.settingsNewsletter.title"
              defaultMessage="Newsletter"
            />
          </h4>
          <div className="border rounded-lg mt-5 max-w-sm p-3 mx-auto mb-5">
            <h4 className="tw-normal ts-large ta-center">
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
              className={`btn tc-white w-full block ${
                isSubscribed
                  ? 'bg-red-500 hover:bg-red-600'
                  : 'bg-green-500 hover:bg-green-600'
              }`}
              onClick={handleNewsletterToggle}
              disabled={updateViewerTrigger.loading}
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
