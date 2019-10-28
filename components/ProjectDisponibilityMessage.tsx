import React from 'react'
import { Disponibility } from '../redux/ducks/project'
import { formatDisponibility } from '../lib/project/utils'
import { useIntl } from 'react-intl'

interface ProjectDisponibilityMessageProps {
  readonly value: Disponibility
}

const ProjectDisponibilityMessage: React.FC<
  ProjectDisponibilityMessageProps
> = ({ value }) => {
  const intl = useIntl()
  return <>{formatDisponibility(value, intl)}</>
}

ProjectDisponibilityMessage.displayName = 'ProjectDisponibilityMessage'

export default ProjectDisponibilityMessage
