import React, { useMemo } from 'react'
import cx from 'classnames'
import { Organization } from '~/redux/ducks/organization'
import useFetchAPI from '~/hooks/use-fetch-api'
import { useSelector } from 'react-redux'
import { ReduxState } from '~/redux/root-reducer'
import { ApiPagination } from '~/redux/ducks/search'
import { Project } from '~/redux/ducks/project'
import HorizontalProjectCard from '~/components/HorizontalProjectCard'
import PageLink from '../PageLink'
import { Color } from '~/common'
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
  const viewer = useSelector((reduxState: ReduxState) => reduxState.user)
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
  const projects = projectsQuery.data?.results || []
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
        <div className="p-5 text-center">
          <ActivityIndicator size={48} fill={Color.gray[500]} />
        </div>
      )}
      {openProjects.length > 0 && (
        <div className="pt-4 px-4">
          <h4 className="text-lg">Vagas abertas</h4>
        </div>
      )}
      {openProjects.map(p => (
        <HorizontalProjectCard
          key={p.slug}
          project={p}
          className={cx('mb-6', itemClassName)}
        />
      ))}

      {closedProjects.length > 0 && (
        <div className="pt-4 px-4">
          <h4 className="text-lg">Vagas encerradas</h4>
        </div>
      )}
      {closedProjects.map(p => (
        <HorizontalProjectCard
          key={p.slug}
          project={p}
          className={cx('mb-6', itemClassName)}
        />
      ))}
      {!projectsQuery.loading && (
        <div className="px-4 pb-4">
          <PageLink
            href="OrganizationProjects"
            params={{ organizationSlug: organization.slug }}
          >
            <a className="btn bg-gray-200 py-3 text-gray-700 hover:bg-gray-300 btn--block">
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
