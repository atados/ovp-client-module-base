import { createAction, createReducer, PayloadAction } from 'redux-handy'
import { InboxViewer } from './inbox'

export enum ViewerRegistor {
  InboxPage,
  ToolbarMessagesDropdown,
}

export const addViewer = createAction<InboxViewerRegister>('INBOX_VIEWERS_ADD')
export const removeViewer = createAction<{
  viewerSlug: string
  registor: ViewerRegistor
}>('INBOX_VIEWERS_REMOVE')

export interface InboxViewerRegister {
  viewer: InboxViewer
  registor: ViewerRegistor
}
export type InboxViewersReducerState = InboxViewerRegister[]

// A list of inbox viewers at the same time
// One registor can have one viewer
// Once the viewer stops viewing, the component handling it must unregister it
export default createReducer<InboxViewersReducerState>(
  {
    [String(addViewer)]: (
      state,
      action: PayloadAction<InboxViewerRegister>,
    ) => {
      if (!action.error) {
        const newItem = action.payload as InboxViewerRegister
        const newState: InboxViewerRegister[] = []
        const alreadyExist = state.some(item => {
          if (
            item.viewer.id === newItem.viewer.id &&
            item.viewer.kind === newItem.viewer.kind &&
            item.registor === newItem.registor
          ) {
            return true
          }

          // We don't want more than 1 item from the same registor in the array
          if (item.registor === newItem.registor) {
            return false
          }

          newState.push(item)

          return false
        })

        if (!alreadyExist) {
          newState.push(newItem)
          return newState
        }
      }

      return state
    },
    [String(removeViewer)]: (state, action) => {
      return state.filter(
        item =>
          !(
            item.viewer.slug === action.payload.viewerSlug &&
            item.registor === action.payload.registor
          ),
      )
    },
  },
  [],
)
