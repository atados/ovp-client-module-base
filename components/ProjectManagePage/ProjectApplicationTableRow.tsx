import React from 'react'
import cx from 'classnames'
import { API } from '~/types/api'
import Avatar from '~/components/Avatar'
import LinkIf from '~/components/LinkIf'
import styled from 'styled-components'
import Icon from '../Icon'
import Tooltip from '../Tooltip'
import { isNotAppliedAnymore } from '~/lib/utils/project-application-utils'
import { Page, PageAs, GlobalMessages, APIEndpoint } from '~/common'
import ActivityIndicator from '../ActivityIndicator'
import { useAPIFetcher, mutateFetchCache } from '~/hooks/use-fetch'
import { ProjectApplication } from '~/types/api-typings'
import { useToasts } from '~/components/Toasts'
import { defineMessages, useIntl, FormattedMessage } from 'react-intl'
import { pushToDataLayer } from '~/lib/tag-manager'
import { reportError } from '~/lib/utils/error'

const m = defineMessages({
  namedConfirm: {
    id: 'projectApplicationTableRow.namedConfirm',
    defaultMessage: '{firstName} foi confirmado',
  },
  unknownConfirm: {
    id: 'projectApplicationTableRow.unknownConfirm',
    defaultMessage: 'O voluntário foi confirmado',
  },
  namedRemoval: {
    id: 'projectApplicationTableRow.namedRemoval',
    defaultMessage: '{firstName} foi removido',
  },
  unknownRemoval: {
    id: 'projectApplicationTableRow.unknownRemoval',
    defaultMessage: 'O voluntário foi removido',
  },
  removeApplication: {
    id: 'projectApplicationTableRow.removeApplication',
    defaultMessage: 'Remover voluntário',
  },
})

const AvatarStyled = styled(Avatar)`
  flex: 0 0 2.5rem;
  width: 2.5rem;
  height: 2.5rem;
`

interface ProjectApplicationTableRowProps {
  readonly application: API.ProjectApplication
  readonly className?: string
  readonly projectSlug: string
  readonly readOnly?: boolean
  readonly onConfirm?: (application: API.ProjectApplication) => void
  readonly onRemove?: (application: API.ProjectApplication) => void
}

const ProjectApplicationTableRow: React.FC<ProjectApplicationTableRowProps> = ({
  className,
  application,
  projectSlug,
  readOnly,
  onConfirm,
  onRemove,
}) => {
  const { user, message, status, role } = application
  const name = user ? user.name : application.name
  const phone = user ? user.phone : application.phone
  const email = user ? user.email : application.email
  const contactColumnClassName = readOnly ? 'max-w-lg' : 'max-w-xs'
  const changeStatusFetch = useAPIFetcher<
    ProjectApplication,
    ProjectApplication['status'],
    { to: ProjectApplication['status'] }
  >((to: ProjectApplication['status']) => ({
    method: 'PATCH',
    endpoint: `/projects/${projectSlug}/applies/${application.id}/`,
    body: {
      status: to,
    },
    meta: {
      to,
    },
  }))
  const intl = useIntl()
  const toasts = useToasts()
  const handleRemoval = async () => {
    pushToDataLayer({
      event: 'application.remove',
      projectSlug,
      prevValue: application.status,
      value: 'unapplied-by-deactivation',
      applicationStatus: application.status,
      applicationUserSlug: application.user?.slug || null,
    })
    const firstName = application.user?.name.split(' ')[0]
    const toastId = toasts.add(
      intl.formatMessage(GlobalMessages.statusSaving),
      'loading',
    )
    try {
      await changeStatusFetch.fetch('unapplied-by-deactivation')
      toasts.replace(
        toastId,
        firstName
          ? intl.formatMessage(m.namedRemoval, {
              firstName,
            })
          : intl.formatMessage(m.unknownRemoval),
        'success',
      )
      mutateFetchCache<any>(
        APIEndpoint.QueryId.ProjectApplies(projectSlug),
        prevValue =>
          prevValue && {
            ...prevValue,
            data: prevValue.data.map(a => {
              if (a.id === application.id) {
                return {
                  ...application,
                  status: 'unapplied-by-deactivation',
                }
              }

              return a
            }),
          },
      )
    } catch (error) {
      toasts.replace(
        toastId,
        intl.formatMessage(GlobalMessages.internalError),
        'error',
      )
      reportError(error)
    }

    if (onRemove) {
      onRemove(application)
    }
  }
  const handleConfirmation = async () => {
    pushToDataLayer({
      event: 'application.confirm',
      projectSlug,
      prevValue: application.status,
      value: 'confirmed-volunteer',
      applicationStatus: application.status,
      applicationUserSlug: application.user?.slug || null,
    })
    const firstName = application.user?.name.split(' ')[0]
    const toastId = toasts.add(
      intl.formatMessage(GlobalMessages.statusSaving),
      'loading',
      false,
    )
    try {
      await changeStatusFetch.fetch('confirmed-volunteer')
      mutateFetchCache<any>(
        APIEndpoint.QueryId.ProjectApplies(projectSlug),
        prevValue =>
          prevValue && {
            ...prevValue,
            data: prevValue.data.map(a => {
              if (a.id === application.id) {
                return {
                  ...application,
                  status: 'confirmed-volunteer',
                }
              }

              return a
            }),
          },
      )
      toasts.replace(
        toastId,
        firstName
          ? intl.formatMessage(m.namedConfirm, {
              firstName,
            })
          : intl.formatMessage(m.unknownConfirm),
        'success',
        2000,
      )
    } catch (error) {
      reportError(error)
      toasts.replace(
        toastId,
        intl.formatMessage(GlobalMessages.internalError),
        'error',
        2000,
      )
    }

    if (onConfirm) {
      onConfirm(application)
    }
  }

  const isConfirmeable = !readOnly && application.status === 'applied'
  const isRemoveable =
    !readOnly &&
    (application.status === 'confirmed-volunteer' ||
      application.status === 'applied')

  return (
    <tr className={className}>
      <td className="px-4 py-3">
        <div className="flex">
          <LinkIf
            if={user}
            href={Page.PublicUser}
            as={PageAs.PublicUser({ slug: user && user.slug })}
          >
            <AvatarStyled
              image={user && user.avatar}
              className="rounded-full mr-3 bg-cover bg-center relative"
              fallBackClassName="bg-gray-300"
            >
              <span
                className={cx(
                  `absolute left-0 bottom-0 w-4 h-4 rounded-full z-20 border-2 border-white -ml-1 -mb-1`,
                  {
                    'bg-red-500': isNotAppliedAnymore(status),
                    'bg-yellow-500': status === 'applied',
                    'bg-green-500': status === 'confirmed-volunteer',
                  },
                )}
              />
            </AvatarStyled>
          </LinkIf>
          <div className="flex-grow">
            <LinkIf
              if={user}
              href={Page.PublicUser}
              as={PageAs.PublicUser({ slug: user && user.slug })}
            >
              <span className="text-md font-medium text-gray-800 block truncate">
                {name}
              </span>
            </LinkIf>
            {isNotAppliedAnymore(status) ? (
              <span className="text-sm block text-red-600 truncate ">
                {status === 'unapplied' ? 'Desistente' : 'Removido'}
              </span>
            ) : role ? (
              <span className="text-green-600 text-sm block truncate">
                {role.name}
              </span>
            ) : (
              <span className="text-gray-500 text-sm block truncate">
                <FormattedMessage
                  id="projectApplicationTableRow.emptyRole"
                  defaultMessage="Sem função definida"
                />
              </span>
            )}
            {message && (
              <span className="block text-sm text-gray-700 mt-1">
                {message}
              </span>
            )}
          </div>
        </div>
      </td>
      <td className={`${contactColumnClassName} px-4 py-3 truncate text-md`}>
        {phone && (
          <span
            className={`${contactColumnClassName} block text-sm text-gray-800 mt-1 truncate`}
          >
            <Icon name="phone" className="text-gray-600 mr-2" />
            {phone}
          </span>
        )}
        {email && (
          <a
            href={`mailto:${email}`}
            className={`${contactColumnClassName} block text-sm text-gray-800 mt-1 truncate hover:underline`}
          >
            <Icon name="email" className="text-gray-600 mr-2" />
            {email}
          </a>
        )}
      </td>
      {(isRemoveable || isConfirmeable) && (
        <td
          className="px-4 py-3 truncate text-lg"
          style={{ width: isConfirmeable ? '200px' : '50px' }}
        >
          {isConfirmeable && (
            <button
              type="button"
              className="btn text-white text-sm rounded-full bg-green-500 hover:bg-green-600"
              onClick={handleConfirmation}
              role="confirm-application"
            >
              <Icon name="check_circle" className="mr-1" />
              <FormattedMessage
                id="projectApplicationTableRow.confirmApplication"
                defaultMessage="Confirmar inscrição"
              />
            </button>
          )}
          {isRemoveable && (
            <Tooltip value={intl.formatMessage(m.removeApplication)}>
              <button
                type="button"
                className="btn text-gray-700 text-sm rounded-full bg-gray-300 hover:bg-red-600 hover:text-white ml-2"
                onClick={handleRemoval}
                role="remove-application"
              >
                {changeStatusFetch.loading &&
                changeStatusFetch.action?.meta?.to ===
                  'unapplied-by-deactivation' ? (
                  <ActivityIndicator fill="#fff" size={24} />
                ) : (
                  <Icon name="close" />
                )}
              </button>
            </Tooltip>
          )}
        </td>
      )}
      {(readOnly || (!isConfirmeable && !isRemoveable)) && <td></td>}
    </tr>
  )
}

ProjectApplicationTableRow.displayName = 'ProjectApplicationTableRow'

export default React.memo(ProjectApplicationTableRow)
