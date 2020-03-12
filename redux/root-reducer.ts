import { combineReducers, Reducer } from 'redux'
import currentUserProfile from '~/redux/ducks/current-user-profile'
import organization from '~/redux/ducks/organization'
import organizationApplies from '~/redux/ducks/organization-applies'
import project from '~/redux/ducks/project'
import publicUser from '~/redux/ducks/public-user'
import search from '~/redux/ducks/search'
import user from '~/redux/ducks/user'
import catalogue from './ducks/catalogue'
import faq from './ducks/faq'
import geo from './ducks/geo'
import inbox from './ducks/inbox'
import inboxViewers from './ducks/inbox-viewers'
import organizationComposer from './ducks/organization-composer'
import organizationMembers from './ducks/organization-members'
import organizationMembership from './ducks/organization-membership'
import projectApplications from './ducks/project-applications'
import projectComposer from './ducks/project-composer'
import ratings from './ducks/ratings'
import searchMarks from './ducks/search-marks'
import startup from './ducks/startup'
import unratedProjects from './ducks/unrated-projects'

export const reducers = {
  startup,
  inbox,
  inboxViewers,
  faq,
  user,
  geo,
  catalogue,
  project,
  projectComposer,
  projectApplications,
  unratedProjects,
  search,
  searchMarks,
  publicUser,
  ratings,
  organization,
  organizationMembership,
  organizationComposer,
  organizationApplies,
  organizationMembers,
  currentUserProfile,
} as const

export type ReducerDict = { [reducerName: string]: Reducer }
export type ExtractReduxStateType<T extends ReducerDict> = {
  [reducerName in keyof T]: ReturnType<T[reducerName]>
}
export type ReduxState = ExtractReduxStateType<typeof reducers>
export type RootState = ReduxState

export default combineReducers(reducers)
