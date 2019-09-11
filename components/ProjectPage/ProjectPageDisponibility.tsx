import moment from "moment";
import React from "react";
import styled from "styled-components";
import { Project } from "~/redux/ducks/project";
import Icon from "../Icon";
import { defineMessages } from "react-intl";
import useIntl from "~/hooks/use-intl";

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
    content: "";
    border-radius: 10px 10px 0 0;
    background: #e05167;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    height: 18px;
  }
`;

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
`;

const EventDateText = styled.span`
  color: #e05167;
  font-weight: 500;
  margin-bottom: 2px;
  display: block;
`;

const {
  VAGA,
  VAGA_DESCRICAO,
  DESCRICAO_HORARIO,
  HORAS_SEMANAIS,
  DISTANCIA,
  RECORRENTE,
  PONTUAL,
  HORARIOS,
  DATAS
} = defineMessages({
  VAGA: {
    id: "VAGA",
    defaultMessage: "Vaga"
  },
  VAGA_DESCRICAO: {
    id: "VAGA_DESCRICAO",
    defaultMessage:
      "Essa vaga acontece em datas específicas. Confira as datas abaixo e o que vai acontecer."
  },
  DESCRICAO_HORARIO: {
    id: "DESCRICAO_HORARIO",
    defaultMessage:
      "Leia abaixo as descrições de horários para atuar nessa vaga."
  },
  HORAS_SEMANAIS: {
    id: "HORAS_SEMANAIS",
    defaultMessage: "Horas semanais"
  },
  DISTANCIA: {
    id: "DISTANCIA",
    defaultMessage: "Você pode atuar à distância"
  },
  RECORRENTE: {
    id: "RECORRENTE",
    defaultMessage: "RECORRENTE"
  },
  PONTUAL: {
    id: "PONTUAL",
    defaultMessage: "PONTUAL"
  },
  HORARIOS: {
    id: "HORARIOS",
    defaultMessage: "Horários"
  },
  DATAS: {
    id: "DATAS",
    defaultMessage: "Datas"
  }
});

interface ProjectPageDisponibilityProps {
  readonly project: Project;
}

const ProjectPageDisponibility: React.FC<ProjectPageDisponibilityProps> = ({
  project
}) => {
  const intl = useIntl();

  return (
    project.disponibility && (
      <>
        <span
          id="como-participar"
          className="tc-secondary-500 tw-medium block mb-1"
        >
          {intl.formatMessage(VAGA)}{" "}
          {project.disponibility.type === "work"
            ? intl.formatMessage(RECORRENTE)
            : intl.formatMessage(PONTUAL)}{" "}
        </span>
        <h4 className="mb-2">
          {project.disponibility.type === "work"
            ? intl.formatMessage(HORARIOS)
            : intl.formatMessage(DATAS)}
        </h4>
        {project.disponibility.type === "job" && (
          <>
            <p className="mb-4 tc-muted">
              {intl.formatMessage(VAGA_DESCRICAO)}
            </p>

            {project.disponibility.job.dates.map((jobDate, i) => (
              <EventDate key={`${jobDate.name}${i}`} className="mb-3">
                <EventCalendarDate>
                  {moment(jobDate.start_date).date()}
                </EventCalendarDate>
                <EventDateText>
                  {moment(jobDate.start_date).format("LL")}
                </EventDateText>
                <h4>{jobDate.name}</h4>
                <p />
              </EventDate>
            ))}
          </>
        )}
        {project.disponibility.type === "work" && (
          <>
            <p className="tc-muted mb-4">
              {intl.formatMessage(DESCRICAO_HORARIO)}
            </p>
            <p className="ts-large">
              <Icon name="event" className="mr-2" />
              {project.disponibility.work.description}
            </p>
            <p className="ts-large">
              <Icon name="access_time" className="mr-2" />
              {project.disponibility.work.weekly_hours}
              {intl.formatMessage(HORAS_SEMANAIS)}
            </p>
            {project.disponibility.work.can_be_done_remotely && (
              <p className="ts-large">
                <Icon name="public" className="mr-2" />
                {intl.formatMessage(DISTANCIA)}
              </p>
            )}
          </>
        )}
        <hr className="mt-4 mb-4" />
      </>
    )
  );
};

ProjectPageDisponibility.displayName = "ProjectPageDisponibility";

export default React.memo(ProjectPageDisponibility);
