import moment from 'moment'
import React from 'react'
import styled from 'styled-components'
import { Project } from '~/redux/ducks/project'
import Icon from '../Icon'
import { defineMessages } from 'react-intl'
import { useIntl } from 'react-intl'

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
  line-height: 1.3;
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

const EventCalendarMonth = styled.div`
  padding: 2px 0;
`

const {
  VAGA,
  VAGA_DESCRICAO,
  DESCRICAO_HORARIO,
  HORAS_SEMANAIS,
  DISTANCIA,
  RECORRENTE,
  PONTUAL,
  HORARIOS,
  DATAS,
} = defineMessages({
  VAGA: {
    id: 'VAGA',
    defaultMessage: 'Vaga',
  },
  VAGA_DESCRICAO: {
    id: 'VAGA_DESCRICAO',
    defaultMessage:
      'Essa vaga acontece em datas específicas. Confira as datas abaixo e o que vai acontecer.',
  },
  DESCRICAO_HORARIO: {
    id: 'DESCRICAO_HORARIO',
    defaultMessage:
      'Leia abaixo as descrições de horários para atuar nessa vaga.',
  },
  HORAS_SEMANAIS: {
    id: 'HORAS_SEMANAIS',
    defaultMessage: 'Horas semanais',
  },
  DISTANCIA: {
    id: 'DISTANCIA',
    defaultMessage: 'Você pode atuar à distância',
  },
  RECORRENTE: {
    id: 'RECORRENTE',
    defaultMessage: 'RECORRENTE',
  },
  PONTUAL: {
    id: 'PONTUAL',
    defaultMessage: 'PONTUAL',
  },
  HORARIOS: {
    id: 'HORARIOS',
    defaultMessage: 'Horários',
  },
  DATAS: {
    id: 'DATAS',
    defaultMessage: 'Datas',
  },
})

interface ProjectPageDisponibilityProps {
  readonly project: Project
}

const ProjectPageDisponibility: React.FC<ProjectPageDisponibilityProps> = ({
  project,
}) => {
  const intl = useIntl()

  return (
    project.disponibility && (
      <>
        <span
          id="como-participar"
          className="text-secondary-500 font-medium block mb-1"
        >
          {intl.formatMessage(VAGA)}{' '}
          {project.disponibility.type === 'work'
            ? intl.formatMessage(RECORRENTE)
            : intl.formatMessage(PONTUAL)}{' '}
        </span>
        <h4 className="mb-2">
          {project.disponibility.type === 'work'
            ? intl.formatMessage(HORARIOS)
            : intl.formatMessage(DATAS)}
        </h4>
        {project.disponibility.type === 'job' && (
          <>
            <p className="mb-6 text-gray-600">
              {intl.formatMessage(VAGA_DESCRICAO)}
            </p>

            {project.disponibility.job.dates.map((jobDate, i) => {
              const momentStartDate = moment(jobDate.start_date)
              const momentEndDate = moment(jobDate.end_date)
              return (
                <EventDate key={`${jobDate.name}${i}`} className="mb-4">
                  <EventCalendarDate>
                    <EventCalendarMonth className="bg-red-500 rounded-t-lg text-red-200 text-xs">
                      {momentStartDate.format('MMMM').substr(0, 3)}
                    </EventCalendarMonth>
                    {momentStartDate.date()}
                  </EventCalendarDate>
                  <EventDateText>{momentStartDate.format('LL')}</EventDateText>
                  <h4>{jobDate.name}</h4>
                  <p className="text-sm text-gray-700">
                    {momentStartDate.format('LT')}
                    <Icon name="arrow_forward" className="mx-1" />
                    {momentEndDate.format('LT')}
                  </p>
                </EventDate>
              )
            })}
          </>
        )}
        {project.disponibility.type === 'work' && (
          <>
            <p className="text-gray-600 mb-6">
              {intl.formatMessage(DESCRICAO_HORARIO)}
            </p>
            <p className="text-xl">
              <Icon name="event" className="mr-2" />
              {project.disponibility.work.description}
            </p>
            <p className="text-xl">
              <Icon name="access_time" className="mr-2" />
              {project.disponibility.work.weekly_hours}{' '}
              {intl.formatMessage(HORAS_SEMANAIS)}
            </p>
            {project.disponibility.work.can_be_done_remotely && (
              <p className="text-xl">
                <Icon name="public" className="mr-2" />{' '}
                {intl.formatMessage(DISTANCIA)}
              </p>
            )}
          </>
        )}
        <hr className="mt-6 mb-6" />
      </>
    )
  )
}

ProjectPageDisponibility.displayName = 'ProjectPageDisponibility'

export default React.memo(ProjectPageDisponibility)
