import Link from 'next/link'
import React, { useCallback } from 'react'
import styled from 'styled-components'
import { resolvePage } from '~/common/page'
import { PublicUserApplication } from '~/redux/ducks/public-user'
import Icon from '../Icon'

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
  application: { project },
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

  return (
    <div
      className={`${active ? 'rounded-lg shadow-lg' : ''} ${className || ''}`}
    >
      <Link
        href={{
          pathname: resolvePage('/project'),
          query: { slug: project.slug },
        }}
        as={`/vaga/${project.slug}`}
      >
        <a
          className={`tc-base td-hover-none d-block p-2 pl-5 ${
            active ? '' : 'hover:bg-muted'
          }`}
          onClick={onClick}
        >
          <div
            className={`w-48 h-48 d-block rounded -ml-3 float-left bg-cover mr-3 ${
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
              className={`btn btn-muted w-36 h-36 rounded-full p-0 float-right ${
                active ? 'bg-primary tc-white' : ''
              }`}
            >
              <Icon name={active ? 'check' : 'keyboard_arrow_down'} />
            </button>
            <span className="ts-medium tw-medium text-truncate d-block">
              {project.name}
            </span>
            <span className="tc-muted ts-small text-truncate d-block">
              {project.description}
            </span>
          </div>
        </a>
      </Link>
      {active && (
        <>
          <hr className="my-0" />
          <Actions className="py-1 animate-slideInUp">
            <button
              onClick={handleClick}
              className="btn btn--block py-1 px-2 ta-left hover:bg-muted"
            >
              <Icon name="assignment" className="mr-2" />
              Ver minha inscrição
            </button>
            <Link
              href={{ pathname: '/project', query: { slug: project.slug } }}
              as={`/vaga/${project.slug}`}
            >
              <a className="btn btn--block py-1 px-2 ta-left hover:bg-muted tc-base tw-normal">
                <Icon name="launch" className="mr-2" />
                Ir para página da vaga
              </a>
            </Link>
            <button className="btn btn--block py-1 px-2 ta-left hover:bg-muted">
              <Icon name="person" className="mr-2" />
              Contatar resposável
            </button>
          </Actions>
        </>
      )}
    </div>
  )
}

ToolbarApplicationsItem.displayName = 'ToolbarApplicationsItem'

export default React.memo(ToolbarApplicationsItem)
