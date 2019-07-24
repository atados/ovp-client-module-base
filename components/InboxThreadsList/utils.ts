import { InboxViewer, MessageThreadType } from '~/redux/ducks/inbox'

export function filterThreads(
  threadsMap: { [id: string]: MessageThreadType },
  viewer: InboxViewer,
) {
  return Object.keys(threadsMap)
    .map(threadId => threadsMap[threadId])
    .filter(thread => {
      return thread.viwerId === viewer.id && thread.viewerKind === viewer.kind
    })
}
