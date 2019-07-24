import cx from 'classnames'
import React from 'react'
import styled from 'styled-components'
import { Project } from '~/redux/ducks/project'

const Indicator = styled.span`
  display: inline-block;
  width: 8px;
  height: 8px;
  background: #3ba950;
  border-radius: 50%;
  vertical-align: 2px;
`

const Pill = styled.span`
  color: #3ba950;
  background: #d1ffda;
  display: inline-block;
  height: 32px;
  border-radius: 16px;
  padding: 5px 16px;
  white-space: nowrap;

  &.status-default {
    color: #444;
    background: #e0e1e2;

    > ${Indicator} {
      background: #999;
    }
  }

  &.status-closed {
    color: #d6002a;
    background: #ffd5dd;

    > ${Indicator} {
      background: #d6002a;
    }
  }
`

interface ProjectStatusPillProps {
  readonly className?: string
  readonly project: Project
}

const ProjectStatusPill: React.FC<ProjectStatusPillProps> = ({
  className,
  project,
}) => (
  <Pill
    className={cx(className, {
      'status-default': !project.published && !project.closed,
      'status-closed': project.closed || project.canceled,
    })}
  >
    <Indicator className="mr-1" />{' '}
    {project.closed
      ? 'Encerrada'
      : project.canceled
      ? 'Cancelada'
      : !project.published
      ? 'Em revisão'
      : 'Publicada'}
  </Pill>
)

ProjectStatusPill.displayName = 'ProjectStatusPill'

export default ProjectStatusPill
