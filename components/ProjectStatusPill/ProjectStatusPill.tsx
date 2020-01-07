import cx from 'classnames'
import React from 'react'
import styled from 'styled-components'
import { Project } from '~/redux/ducks/project'
import { defineMessages, useIntl } from 'react-intl'
import moment from 'moment'

const Indicator = styled.span`
  display: inline-block;
  width: 8px;
  height: 8px;
  background: #3ba950;
  border-radius: 50%;
  vertical-align: 2px;
`

const Pill = styled.span`
  color: #259600;
  display: inline-block;
  border-radius: 16px;
  padding: 0 5px;
  white-space: nowrap;
  font-weight: 500;

  &.status-default {
    color: #444;

    > ${Indicator} {
      background: #999;
    }
  }

  &.status-closed {
    color: #d6002a;

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
  readonly horizontal?: boolean
  readonly project: Project
}

const ProjectStatusPill: React.FC<ProjectStatusPillProps> = ({
  className,
  project,
  horizontal,
}) => {
  const intl = useIntl()
  const date =
    !project.closed && project.published_date
      ? project.published_date
      : project.closed_date
  return (
    <div className="inline-block">
      <Pill
        className={cx(className, {
          'status-default': !project.published && !project.closed,
          'status-closed': project.closed || project.canceled,
          'px-0': horizontal,
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

      {date && (
        <span
          className={`text-sm font-normal text-gray-500 text-center ${
            !horizontal ? 'block' : ''
          }`}
        >
          {horizontal && ' - '}
          {moment(date).fromNow()}
        </span>
      )}
    </div>
  )
}

ProjectStatusPill.displayName = 'ProjectStatusPill'

export default ProjectStatusPill
