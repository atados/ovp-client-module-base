import React from 'react'
import { Project } from '~/redux/ducks/project'
import Avatar from './Avatar'
import styled from 'styled-components'
import Icon from './Icon'
import Tooltip from './Tooltip'
import PageLink from './PageLink'
import ProjectDisponibility from './ProjectDisponibility/ProjectDisponibility'

const Wrapper = styled.div`
  padding-left: 9rem;
  padding-right: 4rem;
  min-height: 6rem;
`

const Side = styled.div`
  float: right;
  margin-right: -4rem;
`

const ProjectPhoto = styled.div`
  margin-left: -9rem;
  float: left;
  margin-top: 4px;

  .ratio-body {
    box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.05);
  }
`

const Date = styled.div`
  right: -6px;
  bottom: -6px;
  line-height: 1;
`

const ProjectTypeSymbol = styled.div`
  right: -6px;
  bottom: -6px;
  padding: 6px 0;
`

interface HorizontalProjectCardProps {
  readonly className?: string
  readonly project: Project
}

const HorizontalProjectCard: React.FC<HorizontalProjectCardProps> = ({
  className,
  project,
}) => {
  return (
    <div className={className}>
      <Wrapper>
        <PageLink href="Project" params={{ slug: project.slug }}>
          <a>
            <ProjectPhoto className="ratio w-32">
              <div
                className="ratio-fill"
                style={{ paddingTop: '66.666666666%' }}
              />
              <Avatar
                image={project.image}
                className="ratio-body rounded-lg bg-cover"
              />
            </ProjectPhoto>
            <Side>
              {project.disponibility &&
                (project.disponibility.type === 'job' ? (
                  <Date className="w-10 h-10 ta-center tc-gray-800">
                    <span className="block text-medium tc-red-400 mb-2">
                      ABR
                    </span>
                    <span>5</span>
                  </Date>
                ) : (
                  <Tooltip value="Vaga recorrente">
                    <ProjectTypeSymbol className="w-10 h-10 tc-gray-700 rounded-lg ta-center text-xl">
                      <Icon name="event_available" />
                    </ProjectTypeSymbol>
                  </Tooltip>
                ))}
            </Side>
            <span className="block tw-medium text-truncate">
              {project.name}
            </span>
          </a>
        </PageLink>
        <span className="block tc-gray-900 ts-small mb-2">
          {project.description}
        </span>
        <div className="block ts-small text-truncate">
          {!project.closed && (
            <span className="tc-green-600">Vagas abertas</span>
          )}
          {!project.closed && !project.canceled && (
            <span className="tc-gray-500"> . </span>
          )}
          {project.disponibility && (
            <span className="tc-gray-700">
              <ProjectDisponibility value={project.disponibility} />
            </span>
          )}
          {project.disponibility &&
            project.address &&
            project.address.city_state && (
              <span className="tc-gray-500"> . </span>
            )}
          {project.address && project.address.city_state && (
            <span className="tc-gray-700">{project.address.city_state}</span>
          )}
        </div>
      </Wrapper>
    </div>
  )
}

HorizontalProjectCard.displayName = 'HorizontalProjectCard'

export default React.memo(HorizontalProjectCard)
