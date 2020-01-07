import React from 'react'
import { Project } from '~/redux/ducks/project'
import Markdown from '../Markdown'
import { defineMessages } from 'react-intl'
import { useIntl } from 'react-intl'

interface ProjectPageAboutProps {
  readonly project: Project
}

const ProjectPageAbout: React.FC<ProjectPageAboutProps> = ({ project }) => {
  const intl = useIntl()

  const { SOBRE } = defineMessages({
    SOBRE: {
      id: 'SOBRE',
      defaultMessage: 'Sobre a vaga',
    },
  })

  return (
    <>
      <h4 className="mb-2">{intl.formatMessage(SOBRE)}</h4>
      <Markdown value={project.details} className="text-lg" />
      <hr className="my-6" />
    </>
  )
}

ProjectPageAbout.displayName = 'ProjectPageAbout'

export default React.memo(ProjectPageAbout)
