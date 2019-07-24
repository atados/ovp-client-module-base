import Link from 'next/link'
import React from 'react'
import styled from 'styled-components'
import { resolvePage } from '~/common/page'
import { Project } from '~/redux/ducks/project'
import { UserOrganization } from '~/redux/ducks/user'
import { FormComposerMode } from '../FormComposer/FormComposer'
import Icon from '../Icon'

const Container = styled.div`
  background: #fff;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1), 0 1px rgba(0, 0, 0, 0.05);
`

const Navbar = styled.nav`
  border-top: 1px solid #eee;

  .nav-link {
    padding-top: 9px;
    padding-bottom: 9px;
  }
`

interface ProjectManagePageHeaderProps {
  readonly className?: string
  readonly project: Project
  readonly organization?: UserOrganization
}

const ProjectManagePageHeader: React.FC<ProjectManagePageHeaderProps> = ({
  project,
  organization,
  className,
}) => (
  <Container className={className}>
    <div className="container">
      <Navbar className="navbar navbar-expand navbar-light px-0">
        <div className="mr-auto" />
        <ul className="navbar-nav">
          <li className="mr-2">
            <Link
              href={{
                pathname: resolvePage('/project-composer'),
                query: {
                  mode: FormComposerMode.EDIT,
                  organizationSlug: organization && organization.slug,
                  projectSlug: project.slug,
                },
              }}
              as={
                organization
                  ? `/ong/${organization.slug}/vagas/editar/${project.slug}`
                  : `/minhas-vagas/editar/${project.slug}`
              }
            >
              <a className="btn btn-primary btn--size-3">
                <Icon name="edit" className="mr-2" />
                Editar vaga
              </a>
            </Link>
          </li>
          <li className="mr-2">
            <Link
              href={`${resolvePage('/project')}?slug=${project.slug}`}
              as={`/vaga/${project.slug}`}
            >
              <a className="btn btn-muted btn--size-3">
                <Icon name="visibility" className="mr-2" />
                Visualizar
              </a>
            </Link>
          </li>
          <li className="mr-2">
            <Link
              href={{
                pathname: resolvePage('/project-composer'),
                query: {
                  mode: FormComposerMode.DUPLICATE,
                  organizationSlug: organization && organization.slug,
                  projectSlug: project.slug,
                },
              }}
              as={
                organization
                  ? `/ong/${organization && organization.slug}/vagas/duplicar/${
                      project.slug
                    }`
                  : `/minhas-vagas/duplicar/${project.slug}/`
              }
            >
              <a className="btn btn-muted btn--size-3">
                <Icon name="file_copy" className="mr-2" />
                Duplicar vaga
              </a>
            </Link>
          </li>
        </ul>
      </Navbar>
    </div>
  </Container>
)

ProjectManagePageHeader.displayName = 'ProjectManagePageHeader'

export default ProjectManagePageHeader
