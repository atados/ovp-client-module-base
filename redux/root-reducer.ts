import { combineReducers } from 'redux'
import currentUserProfile, {
  CurrentUserProfileState,
} from '~/redux/ducks/current-user-profile'
import organization, {
  OrganizationReducerState,
} from '~/redux/ducks/organization'
import organizationApplies, {
  OrganizationAppliesReducerState,
} from '~/redux/ducks/organization-applies'
import project, { ProjectReducerState } from '~/redux/ducks/project'
import publicUser, { PublicUserReducerState } from '~/redux/ducks/public-user'
import search, { SearchReducerState } from '~/redux/ducks/search'
import user, { UserState } from '~/redux/ducks/user'
import catalogue, { CatalogueReducerState } from './ducks/catalogue'
import faq, { FAQReducerState } from './ducks/faq'
import geo, { GeolocationReducerState } from './ducks/geo'
import inbox, { InboxReducerState } from './ducks/inbox'
import inboxViewers, { InboxViewersReducerState } from './ducks/inbox-viewers'
import organizationComposer, {
  OrganizationComposerReducerState,
} from './ducks/organization-composer'
import organizationMembers, {
  OrganizationMembersReducerState,
} from './ducks/organization-members'
import organizationMembership, {
  OrganizationMembershipReducerState,
} from './ducks/organization-membership'
import projectApplications, {
  ProjectApplicationsReducerState,
} from './ducks/project-applications'
import projectComposer, {
  ProjectComposerReducerState,
} from './ducks/project-composer'
import ratings, { RatingsReducerState } from './ducks/ratings'
import searchMarks, { SearchMarksReducerState } from './ducks/search-marks'
import startup, { StartupData, StartupReducerState } from './ducks/startup'
import unratedProjects, {
  UnratedProjectsReducerState,
} from './ducks/unrated-projects'

export interface BaseRootState {
  readonly user: UserState
  readonly inbox: InboxReducerState
  readonly inboxViewers: InboxViewersReducerState
  readonly catalogue: CatalogueReducerState
  readonly project: ProjectReducerState
  readonly projectComposer: ProjectComposerReducerState
  readonly search: SearchReducerState
  readonly searchMarks: SearchMarksReducerState
  readonly publicUser: PublicUserReducerState
  readonly projectApplications: ProjectApplicationsReducerState
  readonly unratedProjects: UnratedProjectsReducerState
  readonly organization: OrganizationReducerState
  readonly organizationMembership: OrganizationMembershipReducerState
  readonly organizationComposer: OrganizationComposerReducerState
  readonly organizationApplies: OrganizationAppliesReducerState
  readonly organizationMembers: OrganizationMembersReducerState
  readonly currentUserProfile: CurrentUserProfileState
  readonly startup: StartupReducerState
  readonly faq: FAQReducerState
  readonly geo: GeolocationReducerState
  readonly ratings: RatingsReducerState
}

export interface RootState extends Omit<BaseRootState, 'startup'> {
  startup: StartupData
}

export const baseReducers = {
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
}

export default combineReducers<BaseRootState>(baseReducers)
