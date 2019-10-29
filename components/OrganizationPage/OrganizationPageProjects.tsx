import React, { useMemo } from 'react'
import cx from 'classnames'
import { Organization } from '~/base/redux/ducks/organization'
import useFetchAPI from '~/base/hooks/use-fetch-api'
import { useSelector } from 'react-redux'
import { RootState } from '~/base/redux/root-reducer'
import { ApiPagination } from '~/base/redux/ducks/search'
import { Project } from '~/base/redux/ducks/project'
import HorizontalProjectCard from '~/components/HorizontalProjectCard'
import PageLink from '../PageLink'
import { Color } from '~/base/common'
import ActivityIndicator from '../ActivityIndicator'

interface OrganizationPageProjectsProps {
  readonly className?: string
  readonly itemClassName?: string
  readonly organization: Organization
}

const OrganizationPageProjects: React.FC<OrganizationPageProjectsProps> = ({
  className,
  itemClassName,
  organization,
}) => {
  const viewer = useSelector((reduxState: RootState) => reduxState.user)
  const viewerIsMember = useMemo(
    () =>
      viewer && viewer.organizations.some(o => o.slug === organization.slug),
    [organization, viewer],
  )
  const projectsQuery = useFetchAPI<ApiPagination<Project>>(
    `/search/projects/?organization=${
      organization.id
    }&ordering=-published,-published_date,-created_date,closed&page_size=8&published=${
      viewerIsMember ? 'both' : 'true'
    }&closed=both`,
  )
  const projects = (projectsQuery.data && projectsQuery.data.results) || []
  const [openProjects, closedProjects] = useMemo(() => {
    const open: Project[] = []
    const closed: Project[] = []

    projects.forEach(p => {
      if (p.closed) {
        closed.push(p)
      } else {
        open.push(p)
      }
    })

    return [open, closed]
  }, [projects])

  if (!projectsQuery.loading && !projects.length) {
    return null
  }

  return (
    <div
      className={cx('bg-white border border-gray-200 rounded-lg', className)}
    >
      {projectsQuery.loading && (
        <div className="p-5 ta-center">
          <ActivityIndicator size={48} fill={Color.gray[500]} />
        </div>
      )}
      {openProjects.length > 0 && (
        <div className="pt-3 px-3">
          <h4 className="ts-medium">Vagas abertas</h4>
        </div>
      )}
      {openProjects.map(p => (
        <HorizontalProjectCard
          key={p.slug}
          project={p}
          className={cx('mb-4', itemClassName)}
        />
      ))}

      {closedProjects.length > 0 && (
        <div className="pt-3 px-3">
          <h4 className="ts-medium">Vagas encerradas</h4>
        </div>
      )}
      {closedProjects.map(p => (
        <HorizontalProjectCard
          key={p.slug}
          project={p}
          className={cx('mb-4', itemClassName)}
        />
      ))}
      {!projectsQuery.loading && (
        <div className="px-3 pb-3">
          <PageLink
            href="OrganizationProjects"
            params={{ organizationSlug: organization.slug }}
          >
            <a className="btn bg-gray-200 py-2 tc-gray-700 hover:bg-gray-300 btn--block">
              Ver todas as vagas
            </a>
          </PageLink>
        </div>
      )}
    </div>
  )
}

OrganizationPageProjects.displayName = 'OrganizationPageProjects'

export default OrganizationPageProjects