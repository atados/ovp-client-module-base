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
          className={`tc-base td-hover-none block p-2 pl-5 ${
            active ? '' : 'hover:bg-muted'
          }`}
          onClick={onClick}
        >
          <div
            className={`w-12 h-12 block rounded -ml-3 float-left bg-cover mr-3 ${
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
                active ? 'bg-primary-500 tc-white' : ''
              }`}
            >
              <Icon name={active ? 'check' : 'keyboard_arrow_down'} />
            </button>
            <span className="ts-medium tw-medium text-truncate block">
              {project.name}
            </span>
            <span className="tc-muted ts-small text-truncate block">
              {application.status === 'applied' && (
                <>
                  <span className="tc-green-500 tw-medium bg-green-100 px-1">
                    <FormattedMessage
                      id="toolbarApplicationsItem.applied"
                      defaultMessage="Inscrito"
                    />
                  </span>
                  <span className="tc-gray-500"> . </span>
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
          <Actions className="py-1 animate-slideInUp">
            {application.status === 'applied' && (
              <button
                onClick={handleClick}
                className="btn btn--block py-1 px-2 ta-left hover:bg-muted"
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
              <a className="btn btn--block py-1 px-2 ta-left hover:bg-muted tc-base tw-normal">
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
