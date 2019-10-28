import Link from 'next/link'
import React from 'react'
import styled from 'styled-components'
import { Project } from '~/redux/ducks/project'
import { UserOrganization } from '~/redux/ducks/user'
import Icon from '../Icon'
import { defineMessages } from 'react-intl'
import { useIntl } from 'react-intl'
import { Page, PageAs } from '~/base/common'

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

const ButtonCol = styled.div`
  > a {
    width: 100%;
    display: block;
    white-space: nowrap;
  }
`

interface ProjectManagePageHeaderProps {
  readonly className?: string
  readonly project: Project
  readonly organization?: UserOrganization
}

const { EDITAR, VISUALIZAR, DUPLICAR } = defineMessages({
  EDITAR: {
    id: 'EDITAR',
    defaultMessage: 'Editar vaga',
  },
  VISUALIZAR: {
    id: 'VISUALIZAR',
    defaultMessage: 'Visualizar',
  },
  DUPLICAR: {
    id: 'DUPLICAR',
    defaultMessage: 'Duplicar vaga',
  },
})

const ProjectManagePageHeader: React.FC<ProjectManagePageHeaderProps> = ({
  project,
  organization,
  className,
}) => {
  const intl = useIntl()
  const editButton = (
    <Link
      href={organization ? Page.OrganizationEditProject : Page.EditProject}
      as={
        organization
          ? PageAs.OrganizationEditProject({
              projectSlug: project.slug,
              organizationSlug: organization.slug,
              stepId: 'geral',
            })
          : PageAs.EditProject({
              projectSlug: project.slug,
              stepId: 'geral',
            })
      }
      passHref
    >
      <a className="btn btn-muted btn--size-3">
        <Icon name="edit" className="mr-2" />
        {intl.formatMessage(EDITAR)}
      </a>
    </Link>
  )
  const duplicateButton = (
    <Link
      href={
        organization ? Page.OrganizationDuplicateProject : Page.DuplicateProject
      }
      as={
        organization
          ? PageAs.OrganizationDuplicateProject({
              projectSlug: project.slug,
              organizationSlug: organization.slug,
              stepId: 'geral',
            })
          : PageAs.DuplicateProject({
              projectSlug: project.slug,
              stepId: 'geral',
            })
      }
      passHref
    >
      <a className="btn btn-muted btn--size-3">
        <Icon name="file_copy" className="mr-2" />
        {intl.formatMessage(DUPLICAR)}
      </a>
    </Link>
  )

  return (
    <Container className={className}>
      <div className="container">
        <Navbar className="block md:flex navbar navbar-expand navbar-light px-0">
          <div className="mr-auto" />

          <Link
            href={`${'/project'}?slug=${project.slug}`}
            as={`/vaga/${project.slug}`}
          >
            <a className="btn btn-primary btn--size-3 w-full block mb-2 md:hidden">
              <Icon name="visibility" className="mr-2" />
              {intl.formatMessage(VISUALIZAR)}
            </a>
          </Link>
          <div className="row md:hidden">
            <ButtonCol className="col-6">{editButton}</ButtonCol>
            <ButtonCol className="col-6">{duplicateButton}</ButtonCol>
          </div>
          <ul className="navbar-nav hidden md:flex">
            <li className="mr-2">
              <Link
                href={`${'/project'}?slug=${project.slug}`}
                as={`/vaga/${project.slug}`}
              >
                <a className="btn btn-primary btn--size-3">
                  <Icon name="visibility" className="mr-2" />
                  {intl.formatMessage(VISUALIZAR)}
                </a>
              </Link>
            </li>
            <li className="mr-2">{editButton}</li>
            <li className="mr-2">{duplicateButton}</li>
          </ul>
        </Navbar>
      </div>
    </Container>
  )
}

ProjectManagePageHeader.displayName = 'ProjectManagePageHeader'

export default ProjectManagePageHeader
