import React, { useCallback, useMemo, useState } from 'react'
import styled, { StyledProps } from 'styled-components'
import { defineMessages, useIntl } from 'react-intl'
import { Waypoint } from 'react-waypoint'
import { connect } from 'react-redux'

import MobileInscriptionButton from '~/components/ProjectPage/ProjectPageNavMobileInscriptionButton'
import InscriptionButton from '~/components/ProjectPage/ProjectPageNavInscriptionButton'
import useFetchAPIMutation from '~/hooks/use-fetch-api-mutation'
import { Project, updateProject } from '~/redux/ducks/project'
import { ProjectPageNavId } from '~/types/project'
import { RootState } from '~/redux/root-reducer'
import { User } from '~/redux/ducks/user'
import { Color } from '~/common'

import Authentication from '../Authentication'
import { useModal } from '../Modal'
import Icon from '../Icon'

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
        box-shadow: inset 0 -3px ${Color.primary[500]};
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

const {
  BOOKMARK,
  BOOKMARKED,
  STORIES,
  OVERVIEW,
  HOURS,
  DATES,
  ORGANIZATION,
  MAP,
} = defineMessages({
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
  const bookmarkMutation = useFetchAPIMutation(() => ({
    endpoint: `/projects/${project.slug}/${
      project.is_bookmarked ? 'unbookmark' : 'bookmark'
    }/`,
    method: 'POST',
  }))
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

    bookmarkMutation.mutate().then(() =>
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

  const hasVacancies = project.roles.some(
    role => role.applied_count < role.vacancies,
  )

  return (
    <div>
      <Waypoint onPositionChange={handleWaypointPositionChange} />
      <div className="container px-2 mb-4 flex lg:hidden">
        <MobileInscriptionButton
          isOwner={isOwner}
          project={project}
          hasVacancies={hasVacancies}
          handleApplication={handleApplication}
        />
        <button
          type="button"
          onClick={handleBookmarkToggle}
          disabled={bookmarkMutation.loading}
          className="btn btn-muted btn--size-3 truncate"
        >
          <Icon
            name={project.is_bookmarked ? 'favorite' : 'favorite_outline'}
            className={project.is_bookmarked ? 'text-red-600' : ''}
          />
          <span className="hidden ml-2">
            {project.is_bookmarked
              ? intl.formatMessage(BOOKMARKED)
              : intl.formatMessage(BOOKMARK)}
          </span>
        </button>
      </div>
      <Nav className="mb-6" fixed={fixed}>
        <div className="navbar navbar-expand navbar-light px-0">
          <div className="container px-2">
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
                  disabled={bookmarkMutation.loading}
                  className="btn btn-muted btn--size-3 mr-2"
                >
                  <Icon
                    name={
                      project.is_bookmarked ? 'favorite' : 'favorite_outline'
                    }
                    className={`mr-2 ${
                      project.is_bookmarked ? 'text-red-600' : ''
                    }`}
                  />
                  {project.is_bookmarked
                    ? intl.formatMessage(BOOKMARKED)
                    : intl.formatMessage(BOOKMARK)}
                </button>
              </li>
              <li>
                <InscriptionButton
                  isOwner={isOwner}
                  project={project}
                  hasVacancies={hasVacancies}
                  handleApplication={handleApplication}
                />
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
  connect((state: RootState) => ({ viewer: state.user }), {
    dispatchProjectChange: updateProject,
  })(ProjectPageNav),
)
