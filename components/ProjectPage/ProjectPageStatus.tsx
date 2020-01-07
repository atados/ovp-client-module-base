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
    <div className="bg-red-500 text-white relative z-10">
      <div className="container px-2 py-2 text-center font-medium">
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
