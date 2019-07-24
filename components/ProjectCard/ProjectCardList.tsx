import * as React from 'react'
import styled, { keyframes } from 'styled-components'
import ProjectCard from '~/components/ProjectCard'
import { range } from '~/lib/utils/array'
import { Project } from '~/redux/ducks/project'

const blink = keyframes`
  0% {
   opacity: 1;
 }

  50% {
  opacity: 0.5;
 }

  100% {
  opacity: 1;
 }
`
const NodePlaceholder = styled.span`
  display: block;
  height: 380px;
  width: 100%;
  background: #eee;
  border-radius: 3px;
  animation: ${blink} 1s ease-in-out 0s infinite normal;
`

interface ProjectCardListProps {
  readonly fetching?: boolean
  readonly className?: string
  readonly projects: Project[]
  readonly size?: ProjectCardListSize
}

export enum ProjectCardListSize {
  WIDE,
}

const ProjectCardList: React.SFC<ProjectCardListProps> = ({
  className,
  projects,
  size,
  fetching,
}) => {
  const itemClassName = `col-sm-6 col-lg-${
    size === ProjectCardListSize.WIDE ? '4' : '3'
  } mb-4`
  return (
    <div className={`row${className ? ` ${className}` : ''}`}>
      {projects.map(project => (
        <div key={project.slug} className={itemClassName}>
          <ProjectCard {...project} />
        </div>
      ))}

      {fetching &&
        range<React.ReactNode>(20, i => (
          <div key={i} className={itemClassName}>
            <NodePlaceholder />
          </div>
        ))}
    </div>
  )
}

ProjectCardList.displayName = 'ProjectCardList'

export default ProjectCardList
