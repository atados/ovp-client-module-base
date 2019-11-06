import React, { useState } from 'react'
import { NextPage } from 'next'
import { NotFoundPageError } from '../lib/next/errors'
import { fetchOrganization } from '../redux/ducks/organization'
import { throwActionError } from '../lib/utils/redux'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../redux/root-reducer'
import Layout from '../components/Layout'
import ActivityIndicator from '../components/ActivityIndicator'
import { Link } from '../components/RouterSwitch'
import useFetchAPI from '../hooks/use-fetch-api'
import Icon from '../components/Icon'
import { Color } from '../common'
import { useModal } from '../components/Modal'
import Authentication from '../components/Authentication'
import {
  FormattedMessage,
  FormattedHTMLMessage,
  defineMessages,
  useIntl,
} from 'react-intl'
import Meta from '../components/Meta'
import { logout } from '../redux/ducks/user'
import { joinOrganization } from '../redux/ducks/organization-membership'

interface OrganizationJoinPageProps {
  readonly organizationSlug: string
  readonly userSlug: string
}

interface OrganizationJoinPageState {
  loading: boolean
  error?: null | string
}

const m = defineMessages({
  metaTitle: {
    id: 'organizationJoin.metaTitle',
    defaultMessage: 'Convite para ser membro',
  },
})

const OrganizationJoinPage: NextPage<OrganizationJoinPageProps> = ({
  organizationSlug,
  userSlug,
}) => {
  const intl = useIntl()
  const { viewer, organization } = useSelector((reduxState: RootState) => ({
    viewer: reduxState.user,
    organization:
      reduxState.organization.slug === organizationSlug
        ? reduxState.organization.node
        : undefined,
  }))
  const [state, setState] = useState<OrganizationJoinPageState>({
    loading: false,
  })
  const dispatchToRedux = useDispatch()
  const { data: user } = useFetchAPI(`/public-users/${userSlug}`)
  const openAuthenticationModal = useModal({
    id: 'Authentication',
    component: Authentication,
    cardClassName: 'p-5',
  })
  const handleClick = async () => {
    if (!organization) {
      throw new Error('Organization not loaded')
    }

    if (!viewer) {
      openAuthenticationModal()
      return
    }

    if (viewer.slug !== userSlug) {
      dispatchToRedux(logout())
      openAuthenticationModal()
      return
    }

    setState({ loading: true })
    try {
      const action = await dispatchToRedux(joinOrganization(organization.slug))
      if ((action as any).error) {
        throw (action as any).payload
      }

      setState({ loading: false })
    } catch (error) {
      setState({
        loading: false,
        error: error.payload
          ? error.payload.detail || error.message
          : error.message,
      })
    }
  }

  return (
    <Layout className="bg-gray-300">
      <Meta title={intl.formatMessage(m.metaTitle)} />
      <div className="py-10 container">
        <div className="bg-white max-w-lg rounded-lg shadow-lg p-5 mx-auto">
          {!organization && (
            <ActivityIndicator size={32} fill="rgba(0,0,0,.5)" />
          )}
          {organization && user && (
            <>
              <div className="ta-center mb-4">
                <figure
                  className="w-16 h-16 rounded-full inline-block vertical-align-middle mb-0"
                  style={
                    user.avatar
                      ? {
                          backgroundSize: 'contain',
                          backgroundPosition: 'center',
                          backgroundImage: `url('${user.avatar.image_medium_url}')`,
                        }
                      : { backgroundColor: Color.gray[300] }
                  }
                />
                <Icon
                  name="add"
                  className="text-3xl vertical-align-middle mx-3"
                />
                <figure
                  className="w-16 h-16 rounded-full inline-block vertical-align-middle mb-0"
                  style={
                    organization.image
                      ? {
                          backgroundSize: 'contain',
                          backgroundPosition: 'center',
                          backgroundImage: `url('${organization.image.image_medium_url}')`,
                        }
                      : { backgroundColor: Color.gray[300] }
                  }
                />
              </div>
              <h2 className="ta-center">
                <FormattedHTMLMessage
                  id="organizationJoin.title"
                  defaultMessage={`<span class="tw-normal">Um convite por</span> {organizationName}`}
                  values={{ organizationName: organization.name }}
                />
              </h2>
              <p className="mb-3 ta-center">
                <FormattedMessage
                  id="organizationJoin.description"
                  defaultMessage="
                Você foi convidado para participar dessa ONG. Ao participar você
                vai poder criar e gerenciar vagas e editar a ONG."
                />
              </p>
              {viewer && viewer.slug !== userSlug && (
                <span className="tc-red-700 mb-2 block ta-center">
                  <FormattedHTMLMessage
                    id="organizationJoin.differentAccount"
                    defaultMessage="Você não esta logado como <b>{firstName}</b>"
                    values={{ firstName: user.name && user.name.split(' ')[0] }}
                  />
                </span>
              )}
              <button
                type="button"
                className={`btn btn--block btn--size-3 ${
                  viewer && viewer.slug === userSlug
                    ? 'btn-success'
                    : viewer
                    ? 'btn-outline-error'
                    : 'btn-outline-primary'
                } mb-3`}
                onClick={handleClick}
                disabled={state.loading}
              >
                {viewer && viewer.slug !== userSlug && (
                  <>
                    <Icon name="person_pin" className="mr-2" />
                    <FormattedMessage
                      id="organizationJoin.changeAccount"
                      defaultMessage="Troque de conta"
                    />
                  </>
                )}
                {!viewer && (
                  <>
                    <Icon name="vpn_key" className="mr-2" />
                    <FormattedMessage
                      id="organizationJoin.login"
                      defaultMessage="Entre na sua conta"
                    />
                  </>
                )}
                {viewer && viewer.slug === userSlug && (
                  <FormattedMessage
                    id="organizationJoin.accept"
                    defaultMessage="Aceitar convite para ser membro"
                  />
                )}
                {state.loading && (
                  <ActivityIndicator size={24} fill="#fff" className="ml-2" />
                )}
              </button>
              {viewer && userSlug !== viewer.slug}
              <Link href="/">
                <a className="tc-muted tw-normal btn--size-3 btn btn--block btn-text">
                  <FormattedMessage
                    id="organizationJoin.deny"
                    defaultMessage="Não tenho interesse"
                  />
                </a>
              </Link>
              {state.error && (
                <span className="block tc-red-700 mt-3 rounded-lg bg-red-200 p-3">
                  <Icon name="error" className="mr-1" />
                  {state.error}
                </span>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  )
}

OrganizationJoinPage.displayName = 'OrganizationJoinPage'
OrganizationJoinPage.getInitialProps = async ({
  query: { organizationSlug, user_slug: userSlug },
  store,
}) => {
  if (typeof organizationSlug !== 'string') {
    throw new NotFoundPageError()
  }

  if (typeof userSlug !== 'string') {
    throw new NotFoundPageError()
  }

  await store
    .dispatch(fetchOrganization(organizationSlug))
    .catch(throwActionError)

  return { organizationSlug, userSlug }
}

export default OrganizationJoinPage
