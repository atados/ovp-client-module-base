import Link from 'next/link'
import React from 'react'
import styled from 'styled-components'
import { Project } from '~/redux/ducks/project'
import Icon from '../Icon'
import { Page, PageAs, Color } from '~/common'
import { defineMessages } from 'react-intl'
import { useIntl } from 'react-intl'

const Wrapper = styled.div`
  @media (min-width: 768px) {
    padding-left: 120px;
  }
`

const Thumbnail = styled.div`
  width: 100px;
  height: 100px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  border-radius: 10px;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.05);
  margin-bottom: 1rem;

  @media (min-width: 768px) {
    margin-left: -120px;
    float: left;
    margin-bottom: 0;
  }
`

const { REALIZADA } = defineMessages({
  REALIZADA: {
    id: 'REALIZADA',
    defaultMessage: 'Realizada pela ONG',
  },
})

interface ProjectPageOrganizationProps {
  readonly project: Project
}

const ProjectPageOrganization: React.FC<ProjectPageOrganizationProps> = ({
  project,
}) => {
  const intl = useIntl()

  if (!project.organization) {
    return null
  }

  return (
    <>
      <h4 id="ong" className="mb-6">
        {intl.formatMessage(REALIZADA)}
      </h4>
      <Wrapper>
        <Link
          href={Page.Organization}
          as={PageAs.Organization({
            organizationSlug: project.organization.slug,
          })}
        >
          <a className="text-gray-800 td-hover-none">
            <Thumbnail
              style={
                project.organization.image
                  ? {
                      backgroundImage: `url('${project.organization.image.image_url}')`,
                    }
                  : { backgroundColor: Color.gray[300] }
              }
            />
            <span className="h5">{project.organization.name}</span>
          </a>
        </Link>
        <p className="text-gray-600 mb-2">{project.organization.description}</p>
        {project.organization.website && (
          <a href={project.organization.website} className="truncate">
            <Icon name="public" className="mr-1" />
            {project.organization.website}
          </a>
        )}
      </Wrapper>
    </>
  )
}

ProjectPageOrganization.displayName = 'ProjectPageOrganization'

export default React.memo(ProjectPageOrganization)
