import { Cause, Skill } from '~/common/channel'

export interface StartupDataStats {
  readonly volunteers: number
  readonly organizations: number
}

export interface StartupAction {
  type: 'STARTUP'
  payload: StartupData
}

export interface StartupData {
  readonly causes: Cause[]
  readonly skills: Skill[]
  readonly stats: StartupDataStats
}

export type StartupReducerState = StartupData | null

export default (state: StartupReducerState = null, action: StartupAction) => {
  if (action.type === 'STARTUP') {
    return action.payload!
  }

  return state
}
