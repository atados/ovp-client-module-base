import React from 'react'
import { connect } from 'react-redux'
import ActivityIndicator from '~/components/ActivityIndicator'
import RouterSwitch from '~/components/RouterSwitch'
import { Location } from '~/components/RouterSwitch/RouterSwitch'
import { fetchCurrentUserProfile } from '~/redux/ducks/current-user-profile'
import { Project } from '~/redux/ducks/project'
import { User } from '~/redux/ducks/user'
import { RootState } from '~/redux/root-reducer'
import ProjectApplicationFinish from './ProjectApplicationFinish'
import ProjectApplicationForm from './ProjectApplicationForm'
import ProjectApplicatUserForm from './ProjectApplicationUserForm'

export interface ProjectApplicationProps {
  readonly className?: string
  readonly roleId: number
  readonly project: Project
  readonly currentUser?: User | null
  readonly location: Location
  readonly onMount?: (payload: undefined) => any
}

interface ProjectApplicationState {
  readonly fixedLocation?: Location
}

class ProjectApplication extends React.Component<
  ProjectApplicationProps,
  ProjectApplicationState
> {
  public router: RouterSwitch | null

  public state: ProjectApplicationState = {}

  public async componentDidMount() {
    const { onMount } = this.props
    if (onMount) {
      await onMount(undefined)
    }
  }

  public renderLoading = () => {
    return (
      <div className="p-5 ta-center">
        <ActivityIndicator size={100} />
      </div>
    )
  }

  public handleUserFormFinish = () => {
    this.setState({
      fixedLocation: {
        path: '/application-new',
      },
    })
  }

  public handleApplicationFinish = () => {
    this.setState({
      fixedLocation: {
        path: '/finish',
      },
    })
  }

  public render() {
    const { className, location, project, roleId } = this.props
    const { fixedLocation } = this.state

    return (
      <RouterSwitch
        className={className}
        location={fixedLocation || location}
        disableBackButton
        routes={[
          {
            path: '/loading',
            component: this.renderLoading,
          },
          {
            path: '/user',
            component: ProjectApplicatUserForm,
            props: {
              onFinish: this.handleUserFormFinish,
            },
          },
          {
            path: '/application',
            component: ProjectApplicationForm,
            props: {
              roleId,
              project,
              roles: project.roles,
              onFinish: this.handleApplicationFinish,
            },
          },
          {
            path: '/finish',
            component: ProjectApplicationFinish,
            props: {
              project,
              new: true,
            },
          },
          {
            path: '/application-registry',
            component: ProjectApplicationFinish,
            props: {
              project,
            },
          },
        ]}
      />
    )
  }
}

export default React.memo(
  connect(
    (
      {
        user: currentUser,
        currentUserProfile: { node: publicUser },
      }: RootState,
      { project }: ProjectApplicationProps,
    ) => {
      return {
        currentUser,
        location: {
          path:
            !publicUser || !currentUser
              ? '/loading'
              : !currentUser.phone ||
                !publicUser.profile ||
                !publicUser.profile.birthday_date ||
                !publicUser.profile.gender ||
                !publicUser.profile.address
              ? '/user'
              : project && project.current_user_is_applied
              ? '/application-registry'
              : '/application',
        },
      }
    },
    { onMount: fetchCurrentUserProfile },
  )(ProjectApplication),
)
