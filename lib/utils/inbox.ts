import { InboxViewer, InboxViewerKind } from '~/redux/ducks/inbox'
import { User } from '~/redux/ducks/user'

export function resolveViewer(
  viewerSlug: string,
  user: User,
): InboxViewer | null {
  if (viewerSlug === 'me') {
    return {
      id: user.uuid,
      slug: 'me',
      kind: InboxViewerKind.User,
      node: user,
      filters: [],
    }
  } else {
    const organization = user.organizations.find(o => o.slug === viewerSlug)
    if (organization) {
      return {
        id: String(organization.id),
        slug: organization.slug,
        kind: InboxViewerKind.Organization,
        node: organization,
        filters: [],
      }
    }
  }

  return null
}
