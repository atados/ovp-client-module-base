import React from 'react'
import cx from 'classnames'
import { API } from '~/types/api'
import Avatar from '~/components/Avatar'
import LinkIf from '~/components/LinkIf'
import styled from 'styled-components'
import Icon from '../Icon'
import Tooltip from '../Tooltip'
import { isNotAppliedAnymore } from '~/lib/utils/project-application-utils'
import { Page, PageAs } from '~/common'
import ActivityIndicator from '../ActivityIndicator'

const AvatarStyled = styled(Avatar)`
  flex: 0 0 2.5rem;
  width: 2.5rem;
  height: 2.5rem;
`

interface ProjectApplicationTableRowProps {
  readonly application: API.ProjectApplication
  readonly className?: string
  readonly readOnly?: boolean
  readonly removing?: boolean
  readonly onConfirm?: (application: API.ProjectApplication) => void
  readonly onRemove?: (application: API.ProjectApplication) => void
}

const ProjectApplicationTableRow: React.FC<ProjectApplicationTableRowProps> = ({
  className,
  application,
  readOnly,
  onConfirm,
  onRemove,
  removing,
}) => {
  const { user, message, status, role } = application
  const name = user ? user.name : application.name
  const phone = user ? user.phone : application.phone
  const email = user ? user.email : application.email
  const contactColumnClassName = readOnly ? 'max-w-lg' : 'max-w-xs'

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
                Sem cargo definido
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
      {!readOnly ? (
        <td className="px-4 py-3 truncate text-lg" style={{ width: '200px' }}>
          <button
            type="button"
            className="btn text-white text-sm rounded-full bg-green-500 hover:bg-green-600"
            onClick={onConfirm ? () => onConfirm(application) : undefined}
            role="confirm-application"
          >
            <Icon name="check_circle" className="mr-1" />
            Confirmar inscrição
          </button>
          <Tooltip value="Remover inscrição">
            <button
              type="button"
              className="btn text-gray-700 text-sm rounded-full bg-gray-300 hover:bg-red-600 hover:text-white ml-2"
              onClick={onRemove ? () => onRemove(application) : undefined}
            >
              <Icon name="close" />
            </button>
          </Tooltip>
        </td>
      ) : onRemove && !readOnly ? (
        <td className="px-4 py-3 truncate text-lg" style={{ width: '80px' }}>
          <Tooltip value="Remover inscrição">
            <button
              type="button"
              className="btn text-gray-700 text-sm rounded-full bg-gray-300 hover:bg-red-600 hover:text-white ml-2"
              onClick={() => onRemove(application)}
            >
              {removing ? (
                <ActivityIndicator fill="#333" size={24} />
              ) : (
                <Icon name="close" />
              )}
            </button>
          </Tooltip>
        </td>
      ) : (
        <td></td>
      )}
    </tr>
  )
}

ProjectApplicationTableRow.displayName = 'ProjectApplicationTableRow'

export default ProjectApplicationTableRow
