import moment from 'moment'
import React from 'react'
import styled from 'styled-components'
import { Project } from '~/redux/ducks/project'
import Icon from '../Icon'

const EventCalendarDate = styled.span`
  width: 64px;
  height: 64px;
  border-radius: 10px;
  background: #e6ebec;
  display: block;
  position: relative;
  font-size: 32px;
  font-weight: 500;
  text-align: center;
  padding-top: 15px;

  &::before {
    content: '';
    border-radius: 10px 10px 0 0;
    background: #e05167;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    height: 18px;
  }
`

const EventDate = styled.div`
  padding-left: 78px;
  padding-top: 3px;
  min-height: 64px;

  ${EventCalendarDate} {
    float: left;
    margin-left: -78px;
    margin-top: -3px;
  }

  > h4 {
    font-size: 20px;
  }
`

const EventDateText = styled.span`
  color: #e05167;
  font-weight: 500;
  margin-bottom: 2px;
  display: block;
`

interface ProjectPageDisponibilityProps {
  readonly project: Project
}

const ProjectPageDisponibility: React.FC<ProjectPageDisponibilityProps> = ({
  project,
}) =>
  project.disponibility && (
    <>
      <span
        id="como-participar"
        className="tc-secondary tw-medium d-block mb-1"
      >
        VAGA {project.disponibility.type === 'work' ? 'RECORRENTE' : 'PONTUAL'}
      </span>
      <h4 className="mb-2">
        {project.disponibility.type === 'work' ? 'Horários' : 'Datas'}
      </h4>
      {project.disponibility.type === 'job' && (
        <>
          <p className="mb-4 tc-muted">
            Essa vaga acontece em datas específicas. Confira as datas abaixo e o
            que vai acontecer.
          </p>

          {project.disponibility.job.dates.map(jobDate => (
            <EventDate key={jobDate.name} className="mb-3">
              <EventCalendarDate>
                {moment(jobDate.start_date).date()}
              </EventCalendarDate>
              <EventDateText>
                {moment(jobDate.start_date).format('LL')}
              </EventDateText>
              <h4>{jobDate.name}</h4>
              <p />
            </EventDate>
          ))}
        </>
      )}
      {project.disponibility.type === 'work' && (
        <>
          <p className="tc-muted mb-4">
            Leia abaixo as descrições de horários para atuar nessa vaga.
          </p>
          <p className="ts-large">
            <Icon name="event" className="mr-2" />
            {project.disponibility.work.description}
          </p>
          <p className="ts-large">
            <Icon name="access_time" className="mr-2" />
            {project.disponibility.work.weekly_hours} Horas semanais
          </p>
          {project.disponibility.work.can_be_done_remotely && (
            <p className="ts-large">
              <Icon name="public" className="mr-2" />
              Você pode atuar à distância
            </p>
          )}
        </>
      )}
      <hr className="mt-4 mb-4" />
    </>
  )

ProjectPageDisponibility.displayName = 'ProjectPageDisponibility'

export default React.memo(ProjectPageDisponibility)
