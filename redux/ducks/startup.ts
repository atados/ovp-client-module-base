import { Cause, Skill } from './channel'

export interface StartupDataStats {
  readonly volunteers: number
  readonly organizations: number
}

export interface StartupData {
  readonly causes: Cause[]
  readonly skills: Skill[]
  readonly stats: StartupDataStats
}

const initialState: StartupData = {
  causes: [],
  skills: [],
  stats: { volunteers: 0, organizations: 0 },
}
export default (state: StartupData = initialState) => state
