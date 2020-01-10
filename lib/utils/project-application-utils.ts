import { ProjectApplicationStatus } from '~/redux/ducks/project'

export const isNotAppliedAnymore = (
  status: ProjectApplicationStatus,
): boolean => {
  return (
    status === 'not-volunteer' ||
    status === 'unapplied-by-deactivation' ||
    status === 'unapplied'
  )
}
