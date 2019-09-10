import React from 'react'
import styled from 'styled-components'
import { Project } from '~/redux/ducks/project'
import ProjectStatusPill from '../ProjectStatusPill'

const Thumbnail = styled.figure`
  width: 100px;
  height: 100px;
  border-radius: 10px;
  margin-left: -120px;
  float: left;
`

const Body = styled.div`
  padding-left: 120px;
  min-height: 100px;
`

interface ProjectManagePageHeaderProps {
  readonly project: Project
}

const ProjectManagePageHeader: React.FC<ProjectManagePageHeaderProps> = ({
  project,
}) => (
  <div className="pt-5 bg-white">
    <div className="container">
      <div className="py-4">
        <ProjectStatusPill project={project} className="float-right" />
        <Body>
          <Thumbnail
            className="mr-3 bg-cover bg-gray-200"
            style={
              project.image
                ? { backgroundImage: `url('${project.image.image_url}')` }
                : { backgroundColor: '#ddd' }
            }
          />
          <h1 className="h4 mb-2">{project.name}</h1>
          <p className="mb-0">{project.description}</p>
        </Body>
      </div>
    </div>
  </div>
)

ProjectManagePageHeader.displayName = 'ProjectManagePageHeader'

export default ProjectManagePageHeader
