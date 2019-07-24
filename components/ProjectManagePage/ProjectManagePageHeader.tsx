import React from 'react'
import styled from 'styled-components'
import { Project } from '~/redux/ducks/project'
import ProjectStatusPill from '../ProjectStatusPill'

const Thumbnail = styled.figure`
  width: 100px;
  height: 100px;
  border-radius: 10px;
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
        <div className="media">
          <Thumbnail
            className="mr-3 bg-cover"
            style={
              project.image
                ? { backgroundImage: `url('${project.image.image_url}')` }
                : { backgroundColor: '#ddd' }
            }
          />
          <div className="media-body ml-2">
            <h1 className="h4 mb-2">{project.name}</h1>
            <p className="text-truncate mb-0">{project.description}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
)

ProjectManagePageHeader.displayName = 'ProjectManagePageHeader'

export default ProjectManagePageHeader
