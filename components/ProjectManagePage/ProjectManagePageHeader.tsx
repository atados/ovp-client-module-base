import React from 'react'
import styled from 'styled-components'
import { Project } from '~/redux/ducks/project'
import ProjectStatusPill from '../ProjectStatusPill'
import { Color } from '~/base/common'

const Thumbnail = styled.figure`
  height: 180px;
  margin: -52px -1rem 2rem;

  @media (min-width: 768px) {
    width: 140px;
    height: 100px;
    margin: 0 0 0 -140px;
    float: left;

    > span {
      border-radius: 10px;
    }
  }
`

const Body = styled.div`
  @media (min-width: 768px) {
    padding-left: 140px;
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
    <div className="container">
      <div className="py-4">
        <ProjectStatusPill project={project} className="float-right" />
        <Body>
          <Thumbnail className="mr-lg-4">
            <span
              className="block bg-cover h-full"
              style={
                project.image
                  ? { backgroundImage: `url('${project.image.image_url}')` }
                  : { backgroundColor: Color.gray[500] }
              }
            />
          </Thumbnail>
          <h1 className="h4 mb-2">{project.name}</h1>
          <p className="mb-0">{project.description}</p>
        </Body>
      </div>
    </div>
  </div>
)

ProjectManagePageHeader.displayName = 'ProjectManagePageHeader'

export default ProjectManagePageHeader
