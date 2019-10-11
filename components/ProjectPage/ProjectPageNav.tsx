import Link from 'next/link'
import React, { useCallback, useMemo, useState } from 'react'
import { connect } from 'react-redux'
import { Waypoint } from 'react-waypoint'
import styled, { StyledProps } from 'styled-components'
import { Page, PageAs } from '~/common'
import useTriggerableFetchApi from '~/hooks/use-trigglerable-fetch-api'
import { Project, updateProject } from '~/redux/ducks/project'
import { User } from '~/redux/ducks/user'
import { RootState } from '~/redux/root-reducer'
import { ProjectPageNavId } from '~/types/project'
import Authentication from '../Authentication'
import Icon from '../Icon'
import VolunteerIcon from '../Icon/VolunteerIcon'
import { useModal } from '../Modal'
import { channel } from '~/base/common/constants'
import { defineMessages } from 'react-intl'
import { useIntl } from 'react-intl'

interface NavProps {
  fixed?: boolean
}
const Nav = styled.div`
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
  height: 64px;
  position: relative;

  .navbar {
    padding: 0;
    overflow-y: visible;
    overflow-x: auto;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  ${(props: StyledProps<NavProps>) => `
    .nav-link {
      padding: 20px 12px;
      white-space: nowrap;

      &.active {
        font-weight: 500;
        box-shadow: inset 0 -3px ${channel.theme.color.primary[500]};
      }
    }

    ${
      props.fixed
        ? `
    > .navbar {
      position: fixed;
      left: 0;
      right: 0;
      top: 0;
      background: #fff;
      height: 64px;
      border: 0;
      z-index: 20;
      box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);
    }
  `
        : `
      > .navbar {
        position: absolute;
        left: 0;
        right: 0;
        z-index: 9;
      }

      > .navbar > .container {
        position: relative;

        &::before {
          content: '';
          position: absolute;
          left: 10px;
          right: 10px;
          top: 0;
          background: #eee;
          height: 1px;
          display: block;
        }
      }
  `
    }
  `};
`

const ActionButton = styled.a`
  position: relative;

  > svg {
    margin: -6px 10px -3px 0;
  }

  @media (min-width: 768px) {
    min-width: 352px;
  }
`

const {
  GERENCIAR_VAGA,
  QUERO_INSCREVER,
  VER_INSCRICAO,
  BOOKMARK,
  BOOKMARKED,
  STORIES,
  OVERVIEW,
  HOURS,
  DATES,
  ORGANIZATION,
  MAP,
} = defineMessages({
  GERENCIAR_VAGA: {
    id: 'GERENCIAR_VAGA',
    defaultMessage: 'Gerenciar vaga',
  },
  QUERO_INSCREVER: {
    id: 'QUERO_INSCREVER',
    defaultMessage: 'Quero me inscrever',
  },
  VER_INSCRICAO: {
    id: 'VER_INSCRICAO',
    defaultMessage: 'Ver minha inscrição',
  },
  BOOKMARK: {
    id: 'projectPageNav.bookmark',
    defaultMessage: 'Favoritar',
  },
  BOOKMARKED: {
    id: 'projectPageNav.bookmarked',
    defaultMessage: 'Favoritado',
  },
  ORGANIZATION: {
    id: 'projectPageNav.ngo',
    defaultMessage: 'ONG',
  },
  STORIES: {
    id: 'projectPageNav.stories',
    defaultMessage: 'Histórias',
  },
  OVERVIEW: {
    id: 'projectPageNav.overview',
    defaultMessage: 'Visão geral',
  },

  HOURS: {
    id: 'projectPageNav.hours',
    defaultMessage: 'Horários',
  },
  DATES: {
    id: 'projectPageNav.dates',
    defaultMessage: 'Datas',
  },
  MAP: {
    id: 'projectPageNav.map',
    defaultMessage: 'Ver no mapa',
  },
})
export interface ProjectPageNavItem {
  id: string
  name: string
}

interface ProjectPageNavProps {
  readonly className?: string
  readonly project: Project
  readonly isOwner?: boolean
  readonly onNavItemClick: (id: string, event: React.MouseEvent<any>) => void
  readonly activeNavItemId?: string
  readonly viewer?: User | null
  readonly onApply: () => void
  readonly dispatchProjectChange: (
    changes: Partial<Project> & { slug: string },
  ) => void
}

const ProjectPageNav: React.FC<ProjectPageNavProps> = ({
  project,
  isOwner,
  viewer,
  activeNavItemId,
  dispatchProjectChange,
  onApply,
  onNavItemClick,
}) => {
  const intl = useIntl()
  const [fixed, setFixed] = useState(false)
  const nav: ProjectPageNavItem[] = useMemo(() => {
    return [
      project.posts.length > 0 && {
        id: ProjectPageNavId.Stories,
        name: intl.formatMessage(STORIES),
      },
      {
        id: ProjectPageNavId.Overview,
        name: intl.formatMessage(OVERVIEW),
      },
      {
        id: ProjectPageNavId.Organization,
        name: intl.formatMessage(ORGANIZATION),
      },
      {
        id: ProjectPageNavId.Disponibility,
        name:
          project.disponibility && project.disponibility.type === 'work'
            ? intl.formatMessage(HOURS)
            : intl.formatMessage(DATES),
      },
      {
        id: ProjectPageNavId.Address,
        name: intl.formatMessage(MAP),
      },
    ].filter(Boolean) as ProjectPageNavItem[]
  }, [project])
  const handleWaypointPositionChange = useCallback(
    (waypointState: Waypoint.CallbackArgs) => {
      if (fixed !== (waypointState.currentPosition === Waypoint.above)) {
        setFixed(waypointState.currentPosition === Waypoint.above)
      }
    },
    [fixed],
  )
  const bookmarkTrigger = useTriggerableFetchApi(
    `/projects/${project.slug}/${
      project.is_bookmarked ? 'unbookmark' : 'bookmark'
    }/`,
    {
      method: 'POST',
    },
  )
  const openAuthentication = useModal({
    id: 'Authentication',
    component: Authentication,
    cardClassName: 'p-5',
  })
  const handleBookmarkToggle = () => {
    if (!viewer) {
      openAuthentication()
      return
    }

    bookmarkTrigger.trigger().then(() =>
      dispatchProjectChange({
        slug: project.slug,
        is_bookmarked: !project.is_bookmarked,
      }),
    )
  }

  const handleApplication = (event: React.MouseEvent) => {
    event.preventDefault()
    onApply()
  }

  return (
    <div>
      <Waypoint onPositionChange={handleWaypointPositionChange} />
      <div className="container mb-3 flex lg:hidden">
        {isOwner ? (
          <Link
            href={
              project.organization
                ? Page.OrganizationDashboardProject
                : Page.ViewerProjectDashboard
            }
            as={
              project.organization
                ? PageAs.OrganizationDashboardProject({
                    organizationSlug: project.organization.slug,
                    projectSlug: project.slug,
                  })
                : PageAs.ViewerProjectDashboard({ projectSlug: project.slug })
            }
            passHref
          >
            <ActionButton className="btn btn-primary btn--size-3 flex-grow mr-2">
              <Icon name="settings" className="mr-2" />
              {intl.formatMessage(GERENCIAR_VAGA)}
            </ActionButton>
          </Link>
        ) : !project.closed && !project.canceled ? (
          <ActionButton
            as="button"
            className={`btn ${
              project.current_user_is_applied
                ? 'btn-outline-primary'
                : 'btn-primary'
            } btn--size-3 flex-grow mr-2`}
            onClick={handleApplication}
          >
            {!project.current_user_is_applied ? (
              <>
                <VolunteerIcon width={20} height={20} fill="#fff" />
                {intl.formatMessage(QUERO_INSCREVER)}
              </>
            ) : (
              <>
                <Icon name="assignment" className="mr-2" />
                {intl.formatMessage(VER_INSCRICAO)}
              </>
            )}
          </ActionButton>
        ) : null}
        <button
          type="button"
          onClick={handleBookmarkToggle}
          disabled={bookmarkTrigger.loading}
          className="btn btn-muted btn--size-3 text-truncate"
        >
          <Icon
            name={project.is_bookmarked ? 'favorite' : 'favorite_outline'}
            className={`mr-2 ${project.is_bookmarked ? 'tc-error' : ''}`}
          />
          {project.is_bookmarked
            ? intl.formatMessage(BOOKMARKED)
            : intl.formatMessage(BOOKMARK)}
        </button>
      </div>
      <Nav className="mb-4" fixed={fixed}>
        <div className="navbar navbar-expand navbar-light px-0">
          <div className="container">
            <ul className="navbar-nav">
              {nav.map(item => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className={`nav-link ${
                      item.id === activeNavItemId ? 'active' : ''
                    }`}
                    onClick={event => onNavItemClick(item.id, event)}
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mr-auto" />
            <ul className="navbar-nav hidden lg:flex">
              <li>
                <button
                  type="button"
                  onClick={handleBookmarkToggle}
                  disabled={bookmarkTrigger.loading}
                  className="btn btn-muted btn--size-3 mr-2"
                >
                  <Icon
                    name={
                      project.is_bookmarked ? 'favorite' : 'favorite_outline'
                    }
                    className={`mr-2 ${
                      project.is_bookmarked ? 'tc-error' : ''
                    }`}
                  />
                  {project.is_bookmarked
                    ? intl.formatMessage(BOOKMARKED)
                    : intl.formatMessage(BOOKMARK)}
                </button>
              </li>
              <li>
                {isOwner ? (
                  <Link
                    href={
                      project.organization
                        ? Page.OrganizationDashboardProject
                        : Page.ViewerProjectDashboard
                    }
                    as={
                      project.organization
                        ? PageAs.OrganizationDashboardProject({
                            organizationSlug: project.organization.slug,
                            projectSlug: project.slug,
                          })
                        : PageAs.ViewerProjectDashboard({
                            projectSlug: project.slug,
                          })
                    }
                    passHref
                  >
                    <ActionButton className="btn btn-primary btn--size-3">
                      <Icon name="settings" className="mr-2" />
                      {intl.formatMessage(GERENCIAR_VAGA)}
                    </ActionButton>
                  </Link>
                ) : (
                  !project.closed &&
                  !project.canceled && (
                    <ActionButton
                      as="button"
                      className={`btn ${
                        project.current_user_is_applied
                          ? 'btn-outline-primary'
                          : 'btn-primary'
                      } btn--size-3`}
                      onClick={handleApplication}
                    >
                      {!project.current_user_is_applied ? (
                        <>
                          <VolunteerIcon width={20} height={20} fill="#fff" />
                          {intl.formatMessage(QUERO_INSCREVER)}
                        </>
                      ) : (
                        <>
                          <Icon name="assignment" className="mr-2" />
                          {intl.formatMessage(VER_INSCRICAO)}
                        </>
                      )}
                    </ActionButton>
                  )
                )}
              </li>
            </ul>
          </div>
        </div>
      </Nav>
    </div>
  )
}

ProjectPageNav.displayName = 'ProjectPageNav'

export default React.memo(
  connect(
    (state: RootState) => ({ viewer: state.user }),
    { dispatchProjectChange: updateProject },
  )(ProjectPageNav),
)
