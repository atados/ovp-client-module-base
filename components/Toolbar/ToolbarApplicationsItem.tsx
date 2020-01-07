import Link from 'next/link'
import React, { useCallback } from 'react'
import styled from 'styled-components'
import { PublicUserApplication } from '~/redux/ducks/public-user'
import Icon from '../Icon'
import { Page, PageAs } from '~/base/common'
import { FormattedMessage } from 'react-intl'

const Actions = styled.div`
  button {
    font-size: 16px;
    font-weight: normal;
  }

  .icon {
    width: 28px;
    font-size: 21px;
    color: #666;
    vertical-align: middle;
  }
`

interface ToolbarApplicationsItemProps {
  readonly className?: string
  readonly onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => any
  readonly onOpenApplication?: () => any
  readonly application: PublicUserApplication
  readonly active: boolean
}

const ToolbarApplicationsItem: React.FC<ToolbarApplicationsItemProps> = ({
  className,
  onClick,
  onOpenApplication,
  application,
  active,
}) => {
  const handleClick = useCallback(
    event => {
      event.preventDefault()

      if (onOpenApplication) {
        onOpenApplication()
      }
    },
    [onOpenApplication],
  )

  const { project } = application

  return (
    <div
      className={`${active ? 'rounded-lg shadow-lg' : ''} ${className || ''}`}
    >
      <Link href={Page.Project} as={PageAs.Project({ slug: project.slug })}>
        <a
          className={`text-base td-hover-none block p-2 pl-8 ${
            active ? '' : 'hover:bg-gray-200'
          }`}
          onClick={onClick}
        >
          <div
            className={`w-12 h-12 block rounded -ml-4 float-left bg-cover bg-center mr-4 ${
              !project.image ? 'bg-muted' : ''
            }`}
            style={
              project.image
                ? {
                    backgroundImage: `url('${project.image.image_medium_url}')`,
                  }
                : undefined
            }
          />
          <div className="flex-grow">
            <button
              className={`btn btn-muted w-10 h-10 rounded-full p-0 float-right ${
                active ? 'bg-primary-500 text-white' : ''
              }`}
            >
              <Icon name={active ? 'check' : 'keyboard_arrow_down'} />
            </button>
            <span className="text-lg font-medium truncate block">
              {project.name}
            </span>
            <span className="text-gray-600 text-sm truncate block">
              {application.status === 'applied' && (
                <>
                  <span className="text-green-500 font-medium bg-green-100 px-2">
                    <FormattedMessage
                      id="toolbarApplicationsItem.applied"
                      defaultMessage="Inscrito"
                    />
                  </span>
                  <span className="text-gray-500"> . </span>
                </>
              )}

              {project.description}
            </span>
          </div>
        </a>
      </Link>
      {active && (
        <>
          <hr className="my-0" />
          <Actions className="py-2 animate-slideInUp">
            {application.status === 'applied' && (
              <button
                onClick={handleClick}
                className="btn btn--block py-2 px-3 text-left hover:bg-gray-200"
              >
                <Icon name="assignment" className="mr-2" />
                <FormattedMessage
                  id="toolbarApplicationsItem.viewApplication"
                  defaultMessage="Ver minha inscrição"
                />
              </button>
            )}
            <Link
              href={Page.Project}
              as={PageAs.Project({ slug: project.slug })}
            >
              <a className="btn btn--block py-2 px-3 text-left hover:bg-gray-200 text-base font-normal">
                <Icon name="launch" className="mr-2" />
                <FormattedMessage
                  id="toolbarApplicationsItem.viewPage"
                  defaultMessage="Ir para página da vaga"
                />
              </a>
            </Link>
          </Actions>
        </>
      )}
    </div>
  )
}

ToolbarApplicationsItem.displayName = 'ToolbarApplicationsItem'

export default React.memo(ToolbarApplicationsItem)
