import { Project } from '~/redux/ducks/project'
import { User } from '~/redux/ducks/user'
import { ApiPagination } from '~/base/redux/ducks/search'
import { FetchHookResultBase } from 'react-fetch-json-hook/lib/use-fetch'

export function doesUserHaveAccessToProject(user: User, project: Project) {
  return (
    project.owner.uuid === user.uuid ||
    user.organizations.some(
      organization => project.organization!.slug === organization.slug,
    )
  )
}

export const fetchMoreProjects = (
  result: FetchHookResultBase<ApiPagination<Project>>,
) => {
  if (!result.loading && result.data && result.data.next) {
    const { next: nextPageURI } = result.data

    return {
      uri: nextPageURI.replace('http://', 'https://'),
      updateData: (nextData, prevData) => ({
        ...nextData,
        next: nextData.next,
        results: [...prevData.results, ...nextData.results],
      }),
    }
  }
}
