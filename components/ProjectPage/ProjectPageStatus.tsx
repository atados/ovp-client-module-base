import React from 'react'
import Icon from '../Icon'
import { FormattedMessage } from 'react-intl'
import { Project } from '~/base/redux/ducks/project'

interface ProjectPageStatusProps {
  readonly project: Project
}

const ProjectPageStatus: React.FC<ProjectPageStatusProps> = ({ project }) => {
  if (!project.canceled && !project.closed) {
    return null
  }

  return (
    <div className="bg-red-500 text-white">
      <div className="container py-1 ta-center tw-medium">
        <Icon name={project.canceled ? 'close' : 'history'} className="mr-2" />
        {project.canceled ? (
          <FormattedMessage
            id="projectPageStatus.cancelled"
            defaultMessage="Infelizmente essa vaga não vai acontecer mais :("
          />
        ) : (
          <FormattedMessage
            id="projectPageStatus.closed"
            defaultMessage="Essa vaga foi encerrada"
          />
        )}
      </div>
    </div>
  )
}

ProjectPageStatus.displayName = 'ProjectPageStatus'

export default ProjectPageStatus
