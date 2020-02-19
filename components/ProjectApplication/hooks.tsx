import { useSelector } from 'react-redux'
import { RootState } from '~/redux/root-reducer'
import { reportError } from '~/lib/utils/error'
import { Project } from '~/redux/ducks/project'
import { useModal } from '~/components/Modal'
import ProjectApplication, {
  ProjectApplicationProps,
} from '~/components/ProjectApplication/ProjectApplication'
import ProjectApplicationRegistry from '~/components/ProjectApplication/ProjectApplicationRegistry'
import CompleteViewerProfileForm from '~/components/CompleteViewerProfileForm'
import useModalManager from '~/hooks/use-modal-manager'
import Authentication from '~/components/Authentication'
import ConfirmEmailBeforeProceeding from '~/components/EmailConfirmation/ConfirmEmailBeforeProceeding'
import { Config } from '~/common'

export function useProjectApplication() {
  const viewer = useSelector((state: RootState) => state.user)
  const modalManager = useModalManager()
  const openApplicationRegistryModal = useModal({
    id: 'ProjectApplicationRegistry',
    component: ProjectApplicationRegistry,
    cardClassName: 'p-4',
  })
  const openApplicationModal = useModal<ProjectApplicationProps>({
    id: 'ProjectApplication',
    component: ProjectApplication,
  })
  const openCompleteViewerInformationModal = useModal({
    id: 'CompleteViewerProfileForm',
    component: CompleteViewerProfileForm,
  })
  const openConfirmEmailBeforeProceedingModal = useModal({
    id: 'ConfirmEmailBeforeProceeding',
    component: ConfirmEmailBeforeProceeding,
  })
  const openAuthenticationModal = useModal({
    id: 'Authentication',
    component: Authentication,
    cardClassName: 'p-4',
  })

  return (project: Project, defaultRoleId?: number) => {
    const onApply = () =>
      openApplicationModal({
        project,
        defaultRoleId,
        next: () => {
          modalManager.close('ProjectApplication')
          openApplicationRegistryModal({ project, defaultRoleId })
        },
      })

    if (!viewer) {
      openAuthenticationModal({
        onAuthenticate: () => {
          modalManager.close('Authentication')
          onApply()
        },
      })
      return
    }

    if (
      !viewer.is_email_verified &&
      Config.application.require.emailConfirmation
    ) {
      openConfirmEmailBeforeProceedingModal()
      return
    }

    if (project.current_user_is_applied) {
      openApplicationRegistryModal({ project, defaultRoleId })
      return
    }

    if (viewer.profile) {
      if (
        !viewer.phone ||
        !viewer.profile ||
        !viewer.profile.birthday_date ||
        !viewer.profile.gender ||
        !viewer.profile.address
      ) {
        openCompleteViewerInformationModal({
          next: onApply,
        })
      } else {
        onApply()
      }
    } else {
      reportError(
        `Viewer Profile is ${JSON.stringify(
          viewer,
        )} at useProjectApplication. Ignored user info.`,
      )
      onApply()
    }
  }
}
