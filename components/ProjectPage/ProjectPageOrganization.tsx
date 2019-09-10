import Link from 'next/link'
import React from 'react'
import styled from 'styled-components'
import { resolvePage } from '~/common/page'
import { Project } from '~/redux/ducks/project'
import Icon from '../Icon'
import { defineMessages } from 'react-intl'
import useIntl from '~/hooks/use-intl'

const Wrapper = styled.div`
  padding-left: 120px;
`

const Thumbnail = styled.div`
  width: 100px;
  height: 100px;
  background-size: cover;
  background-position: center;
  background-color: #ddd;
  border-radius: 10px;
  margin-left: -120px;
  float: left;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.05);
`

interface ProjectPageOrganizationProps {
  readonly project: Project
}

const { REALIZADA } = defineMessages({
  REALIZADA: {
    id: 'REALIZADA',
    defaultMessage: 'Realizada pela ONG',
  },
})

const ProjectPageOrganization: React.FC<ProjectPageOrganizationProps> = ({
  project,
}) => {
  const intl = useIntl()

  if (!project.organization) {
    return null
  }

  return (
    <>
      <h4 id="ong" className="mb-4">
        {intl.formatMessage(REALIZADA)}
      </h4>
      <Wrapper>
        <Link
          href={{
            pathname: resolvePage('/organization'),
            query: { slug: project.organization.slug },
          }}
          as={`/ong/${project.organization.slug}`}
        >
          <a className="tc-base td-hover-none">
            <Thumbnail
              style={
                project.organization.image
                  ? {
                      backgroundImage: `url('${
                        project.organization.image.image_url
                      }')`,
                    }
                  : { backgroundColor: '#eee' }
              }
            />
            <span className="h5">{project.organization.name}</span>
          </a>
        </Link>
        <p className="tc-muted mb-2">{project.organization.description}</p>
        {project.organization.website && (
          <a href={project.organization.website}>
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
