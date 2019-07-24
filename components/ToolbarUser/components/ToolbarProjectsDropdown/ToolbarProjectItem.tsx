import Link from 'next/link'
import * as React from 'react'
import { InjectedIntlProps } from 'react-intl'
import styled from 'styled-components'
import { resolvePage } from '~/common/page'
import Icon from '~/components/Icon'
import { useModal } from '~/components/Modal'
import ProjectRate from '~/components/ProjectRate'
import VolunteersRate from '~/components/ProjectRate/VolunteersRate'
import { formatDisponibility } from '~/lib/project/utils'
import { Project } from '~/redux/ducks/project'
import { PublicUserApplication } from '~/redux/ducks/public-user'

const Thumbnail = styled.figure`
  margin: 0;
  width: 64px;
  height: 64px;
  background: #eeee;
  border-radius: 4px;
  background-size: cover;
  background-position: center;
  float: right;
  margin-right: -78px;
`

const Name = styled.h4`
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 0;
`

const Container = styled.div`
  background: #f5f6f7;
  border-radius: 10px;
  padding: 12px;
`

const Body = styled.a`
  padding-right: 76px;
  display: block;
  color: #333;
  cursor: pointer;

  &:hover,
  &:focus {
    color: #333;
    text-decoration: none;
  }
`

const VolunteersRatingButton = styled.button`
  width: 100%;
  display: block;
  text-align: left;
  padding: 0;
  margin: 0;
  background: none;
  border: 0;

  &:focus {
    outline: none;
  }
`

interface ToolbarProjectItemProps {
  readonly application?: PublicUserApplication
  readonly project?: Project
  readonly asVolunteersRatingLink?: boolean
  readonly className?: string
}

const ToolbarProjectItem: React.SFC<
  ToolbarProjectItemProps & InjectedIntlProps
> = ({
  className,
  application,
  project: fixedProject,
  intl,
  asVolunteersRatingLink,
}) => {
  const project = application ? application.project : fixedProject
  const openVolunteersRateModal = useModal({
    id: 'VolunteersRate',
    component: VolunteersRate,
  })
  const openProjectRateModal = useModal({
    id: 'ProjectRate',
    component: ProjectRate,
  })

  if (!project) {
    return null
  }

  const body = (
    <Body
      as={asVolunteersRatingLink ? 'div' : 'a'}
      href={asVolunteersRatingLink ? `/vaga/${project.slug}` : undefined}
    >
      <Thumbnail
        style={{
          backgroundImage: project.image
            ? `url('${project.image.image_url}')`
            : undefined,
        }}
      />
      <span className="d-block ts-small tc-muted-dark">
        {project.disponibility &&
          formatDisponibility(project.disponibility, intl, true)}
      </span>
      <Name className="text-truncate mb-1">{project.name}</Name>
      <p className="ts-small mb-2 tc-muted text-truncate">
        {project.description}
      </p>

      {application && application.role && (
        <span className="d-block ts-small tc-muted-dark">
          <Icon name="person" className="mr-2" />
          {application.role.name}
        </span>
      )}
    </Body>
  )

  return (
    <Container className={className}>
      {asVolunteersRatingLink ? (
        <VolunteersRatingButton
          type="button"
          onClick={() => openVolunteersRateModal({ project })}
        >
          {body}
        </VolunteersRatingButton>
      ) : (
        <Link
          href={`${resolvePage('/project')}?slug=${project.slug}`}
          as={`/vaga/${project.slug}`}
        >
          {body}
        </Link>
      )}
      {application && application.project_rating && (
        <>
          <hr className="mb-1 mt-3" />
          <button
            type="button"
            className="btn btn-text btn--block"
            onClick={() =>
              openProjectRateModal({
                rating: application.project_rating,
              })
            }
          >
            Avaliar
          </button>
        </>
      )}
    </Container>
  )
}

ToolbarProjectItem.displayName = 'ToolbarProjectItem'
ToolbarProjectItem.defaultProps = {
  className: undefined,
}

export default ToolbarProjectItem
