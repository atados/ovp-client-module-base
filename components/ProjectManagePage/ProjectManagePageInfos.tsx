import useIntl from '~/hooks/use-intl'
import React from 'react'
import styled from 'styled-components'
import { colors } from '~/common/constants'
import { formatDisponibility } from '~/lib/project/utils'
import { Project } from '~/redux/ducks/project'
import Icon from '../Icon'
import VolunteerIcon from '../Icon/VolunteerIcon'

const Info = styled.div`
  min-height: 180px;
  vertical-align: top;

  .ratio-body {
    border-radius: 10px;
    padding: 24px;
  }

  .icon {
    color: #fff;
    font-size: 24px;
    height: 24px;
    line-height: 1;
  }

  hr {
    margin: 5px 0;
    border-color: rgba(255, 255, 255, 0.2);
    background: rgba(255, 255, 255, 0.2);
  }
`

const Infos = styled.div`
  @media (max-width: 768px) {
    width: 100%;
    margin: 0;
    overflow-x: auto;
    white-space: nowrap;
    display: block;

    &::-webkit-scrollbar {
      display: none;
    }

    .col-md-6 {
      padding-left: 0;
      display: inline-block;
      width: auto;
      vertical-align: top;
    }

    ${Info} {
      width: 300px;
    }
  }
`

const InfoValue = styled.span`
  font-size: 32px;
  color: #fff;
  font-weight: 500;
  display: block;
  line-height: 1.2;
`
const InfoLabel = styled.span`
  font-size: 14px;
  color: #fff;
  font-weight: 500;
`

interface ProjectManagePageInfosProps {
  readonly className?: string
  readonly project: Project
}

const ProjectManagePageInfos: React.FC<ProjectManagePageInfosProps> = ({
  className,
  project,
}) => {
  const intl = useIntl()

  return (
    <Infos className={`row mb-4${className ? ` ${className}` : ''}`}>
      <div className="col-md-6 col-lg-3 mb-md-3 mb-lg-0">
        <Info className="ratio">
          <div className="ratio-fill" style={{ paddingTop: '70%' }} />
          <div style={{ backgroundColor: colors[0] }} className="ratio-body">
            <VolunteerIcon
              width={24}
              height={24}
              fill="#fff"
              className="mb-2"
            />
            <InfoValue>
              {project.applied_count}{' '}
              <span className="tw-normal tc-light ts-large">
                / {project.max_applies_from_roles}
              </span>
            </InfoValue>
            <InfoLabel>Inscritos</InfoLabel>
            <hr />
            <span className="ts-small tc-light">
              {project.applied_count > project.max_applies_from_roles ? (
                <>
                  <span className="tc-white">
                    +{project.applied_count - project.max_applies_from_roles}
                  </span>{' '}
                  acima da meta
                </>
              ) : (
                `${project.max_applies_from_roles -
                  project.applied_count} voluntários até a meta`
              )}
            </span>
          </div>
        </Info>
      </div>
      <div className="col-md-6 col-lg-3 mb-md-3 mb-lg-0">
        <Info className="ratio">
          <div className="ratio-fill" style={{ paddingTop: '70%' }} />
          <div style={{ backgroundColor: colors[1] }} className="ratio-body">
            <Icon name="favorite" className="mb-2" />
            <InfoValue>{project.bookmark_count}</InfoValue>
            <InfoLabel>Favoritadas</InfoLabel>
            <hr />
            <span className="ts-small tc-light">Pessoas que favoritaram</span>
          </div>
        </Info>
      </div>
      <div className="col-md-6 col-lg-3">
        <Info className="ratio">
          <div className="ratio-fill" style={{ paddingTop: '70%' }} />
          <div style={{ backgroundColor: colors[2] }} className="ratio-body">
            <Icon name="event" className="mb-2" />
            <InfoValue className="text-truncate">
              {project.disponibility &&
                formatDisponibility(project.disponibility, intl)}
            </InfoValue>
            <InfoLabel>Disponibilidade</InfoLabel>
            <hr />
            <span className="d-block mt-1 ts-small text-truncate tc-light">
              {project.disponibility &&
                (project.disponibility.type === 'work'
                  ? project.disponibility.work.description
                  : `${project.disponibility.job.dates.length} datas`)}
            </span>
          </div>
        </Info>
      </div>
      <div className="col-md-6 col-lg-3">
        <Info className="ratio">
          <div className="ratio-fill" style={{ paddingTop: '70%' }} />
          <div style={{ backgroundColor: colors[3] }} className="ratio-body">
            <Icon name="place" className="mb-2" />
            <InfoValue className="text-truncate">
              {project.address &&
                (project.address.city_state || project.address.typed_address)}
            </InfoValue>
            <InfoLabel>Endereço</InfoLabel>
            <hr />
            <span className="text-truncate ts-small tc-light">
              {(project.address && project.address.typed_address2) || '...'}
            </span>
          </div>
        </Info>
      </div>
    </Infos>
  )
}

ProjectManagePageInfos.displayName = 'ProjectManagePageInfos'

export default React.memo(ProjectManagePageInfos)
