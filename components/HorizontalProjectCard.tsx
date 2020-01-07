import React from 'react'
import { Project, JobDisponibility } from '~/redux/ducks/project'
import Avatar from './Avatar'
import styled from 'styled-components'
import Icon from './Icon'
import Tooltip from './Tooltip'
import PageLink from './PageLink'
import ProjectDisponibility from './ProjectDisponibility/ProjectDisponibility'
import { findNearestDate } from '../lib/project/utils'
import moment from 'moment'

const Wrapper = styled.div`
  @media (min-width: 768px) {
    padding-left: 9rem;
  }

  padding-right: 4rem;
  min-height: 6rem;
`

const Side = styled.div`
  float: right;
  margin-right: -4rem;
`

const ProjectPhoto = styled.div`
  margin-bottom: 1rem;

  @media (max-width: 767px) {
    width: 50% !important;
  }

  @media (min-width: 768px) {
    margin-left: -9rem;
    margin-bottom: 0;
    float: left;
  }

  margin-top: 4px;

  .ratio-body {
    box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.05);
  }
`

const DateStyled = styled.div`
  right: -6px;
  bottom: -6px;
  line-height: 1;
`

const ProjectTypeSymbol = styled.div`
  right: -6px;
  bottom: -6px;
  padding: 6px 0;
`

const renderDisponibility = (disponibility: JobDisponibility) => {
  const nextDate = findNearestDate(disponibility)
  if (!nextDate) {
    return null
  }

  const date = moment(nextDate.start_date)
  return (
    nextDate && (
      <>
        <span className="block text-medium text-red-400 mb-2">
          {date.format('MMMM').substr(0, 3)}
        </span>
        <span className="text-gray-800">{date.date()}</span>
      </>
    )
  )
}

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
                className="ratio-body rounded-lg bg-cover bg-center"
                fallBackClassName="bg-gray-200"
              />
            </ProjectPhoto>
            <Side>
              {project.disponibility &&
                (project.disponibility.type === 'job' ? (
                  <DateStyled className="w-10 h-10 text-center">
                    {renderDisponibility(project.disponibility)}
                  </DateStyled>
                ) : (
                  <Tooltip value="Vaga recorrente">
                    <ProjectTypeSymbol className="w-10 h-10 text-gray-700 rounded-lg text-center text-xl">
                      <Icon name="event_available" />
                    </ProjectTypeSymbol>
                  </Tooltip>
                ))}
            </Side>
            <span className="block font-medium truncate">{project.name}</span>
          </a>
        </PageLink>
        <span className="block text-gray-900 text-sm mb-2">
          {project.description}
        </span>
        <div className="block text-sm truncate">
          {!project.closed && (
            <span className="text-green-600">Vagas abertas</span>
          )}
          {!project.closed && !project.canceled && (
            <span className="text-gray-500"> . </span>
          )}
          {project.disponibility && (
            <span className="text-gray-700">
              <ProjectDisponibility value={project.disponibility} />
            </span>
          )}
          {project.disponibility &&
            project.address &&
            project.address.city_state && (
              <span className="text-gray-500"> . </span>
            )}
          {project.address && project.address.city_state && (
            <span className="text-gray-700">{project.address.city_state}</span>
          )}
        </div>
      </Wrapper>
    </div>
  )
}

HorizontalProjectCard.displayName = 'HorizontalProjectCard'

export default React.memo(HorizontalProjectCard)
