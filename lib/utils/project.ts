import { Project } from '~/redux/ducks/project'
import { User } from '~/redux/ducks/user'

export function doesUserHaveAccessToProject(user: User, project: Project) {
  return (
    project.owner.uuid === user.uuid ||
    user.organizations.some(
      organization => project.organization!.slug === organization.slug,
    )
  )
}
