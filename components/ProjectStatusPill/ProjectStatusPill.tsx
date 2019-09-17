import cx from 'classnames'
import React from 'react'
import styled from 'styled-components'
import { Project } from '~/redux/ducks/project'
import { defineMessages, useIntl } from 'react-intl'

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

const m = defineMessages({
  closed: {
    id: 'projectStatusPill.closed',
    defaultMessage: 'Encerrada',
  },
  canceled: {
    id: 'projectStatusPill.canceled',
    defaultMessage: 'Cancelada',
  },
  unpublished: {
    id: 'projectStatusPill.unpublished',
    defaultMessage: 'Em revisão',
  },
  published: {
    id: 'projectStatusPill.published',
    defaultMessage: 'Publicada',
  },
})

interface ProjectStatusPillProps {
  readonly className?: string
  readonly project: Project
}

const ProjectStatusPill: React.FC<ProjectStatusPillProps> = ({
  className,
  project,
}) => {
  const intl = useIntl()
  return (
    <Pill
      className={cx(className, {
        'status-default': !project.published && !project.closed,
        'status-closed': project.closed || project.canceled,
      })}
    >
      <Indicator className="mr-1" />{' '}
      {intl.formatMessage(
        project.closed
          ? m.closed
          : project.canceled
          ? m.canceled
          : !project.published
          ? m.unpublished
          : m.published,
      )}
    </Pill>
  )
}

ProjectStatusPill.displayName = 'ProjectStatusPill'

export default ProjectStatusPill
