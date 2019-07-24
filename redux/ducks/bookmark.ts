import { createAction } from 'redux-handy'
import { fetchAPI } from '~/lib/fetch/fetch.server'
import { pushToDataLayer } from '~/lib/tag-manager'
import { RootState } from '../root-reducer'
import { NodeKind } from './search'

interface BookmarkActionPayload {
  slug: string
  nodeKind: NodeKind
}
export const bookmark = createAction<
  BookmarkActionPayload,
  boolean,
  BookmarkActionPayload
>(
  'BOOKMARK',
  async ({ nodeKind, slug }, { getState }) => {
    const { user } = getState() as RootState

    if (!user) {
      throw new Error('You must be logged in to bookmark')
    }

    await fetchAPI(
      `/${
        nodeKind === NodeKind.Project ? 'projects' : 'organizations'
      }/${slug}/bookmark/`,
      { method: 'POST', sessionToken: user.token },
    )

    pushToDataLayer({
      event: `${
        nodeKind === NodeKind.Project ? 'project' : 'organization'
      }.bookmark`,
      slug,
    })

    return true
  },
  ({ nodeKind, slug }) => ({ slug, nodeKind }),
)

export const unbookmark = createAction<
  BookmarkActionPayload,
  boolean,
  BookmarkActionPayload
>(
  'UNBOOKMARK',
  async ({ nodeKind, slug }, { getState }) => {
    const { user } = getState() as RootState

    if (!user) {
      throw new Error('You must be logged in to unbookmark')
    }

    await fetchAPI(
      `/${
        nodeKind === NodeKind.Project ? 'projects' : 'organizations'
      }/${slug}/unbookmark/`,
      { method: 'POST', sessionToken: user.token },
    )

    pushToDataLayer({
      event: `${
        nodeKind === NodeKind.Project ? 'project' : 'organization'
      }.unbookmark`,
      slug,
    })

    return true
  },
  ({ slug, nodeKind }) => ({ slug, nodeKind }),
)
