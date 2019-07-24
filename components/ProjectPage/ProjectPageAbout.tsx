import React from 'react'
import { Project } from '~/redux/ducks/project'
import Markdown from '../Markdown'

interface ProjectPageAboutProps {
  readonly project: Project
}

const ProjectPageAbout: React.FC<ProjectPageAboutProps> = ({ project }) => (
  <>
    <h4 className="mb-2">Sobre a vaga</h4>
    <Markdown value={project.details} className="ts-medium" />
    <hr className="my-4" />
  </>
)

ProjectPageAbout.displayName = 'ProjectPageAbout'

export default React.memo(ProjectPageAbout)
