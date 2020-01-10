import React from 'react'
import styled from 'styled-components'
import { Project } from '~/redux/ducks/project'
import ProjectStatusPill from '../ProjectStatusPill'
import { Color } from '~/common'

const ProjectImage = styled.figure`
  height: 140px;

  @media (min-width: 768px) {
    width: 150px;
    height: 100px;
    margin: 0 24px 0 -150px !important;
    float: left;
    border-radius: 10px;
  }
`

const Body = styled.div`
  @media (min-width: 768px) {
    padding-left: 150px;
    min-height: 100px;
  }
`

interface ProjectManagePageHeaderProps {
  readonly project: Project
}

const ProjectManagePageHeader: React.FC<ProjectManagePageHeaderProps> = ({
  project,
}) => (
  <div className="bg-white">
    <div className="container px-2">
      <div className="py-5">
        <Body>
          <ProjectImage
            className="-mt-5 mb-5 -mx-2 lg:mr-6 bg-cover bg-center rounded-b-lg"
            style={
              project.image
                ? { backgroundImage: `url('${project.image.image_url}')` }
                : { backgroundColor: Color.gray[500] }
            }
          />
          <h1 className="text-xl font-medium mb-1">{project.name}</h1>
          <p className="text-gray-700 mb-2">{project.description}</p>
          <ProjectStatusPill project={project} horizontal />
        </Body>
      </div>
    </div>
  </div>
)

ProjectManagePageHeader.displayName = 'ProjectManagePageHeader'

export default ProjectManagePageHeader
