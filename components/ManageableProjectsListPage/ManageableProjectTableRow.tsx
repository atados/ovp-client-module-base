import React from 'react'
import { API } from '~/types/api'
import styled from 'styled-components'
import { Page, PageAs, Color } from '~/common'
import Link from 'next/link'
import ProjectStatusPill from '~/components/ProjectStatusPill'
import {
  DropdownWithContext,
  DropdownToggler,
  DropdownMenu,
} from '~/components/Dropdown'
import { useIntl, defineMessages } from 'react-intl'
import Icon from '../Icon'

const Thumbnail = styled.figure`
  width: 72px;
  height: 72px;
  border-radius: 4px;
  margin: 0;
  background-size: cover;
  background-position: center;
`

const DropdownAnchor = styled.a`
  display: block;
  padding: 7px 12px;
  cursor: pointer;
  color: #333;
  font-size: 16px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;

  &:hover {
    background: ${Color.primary[500]};
    color: #fff;
    text-decoration: none;
  }
`

const ContextMenu = styled(DropdownMenu)`
  left: auto;
  width: 200px;
  text-align: left;
  padding: 5px 0;
`

const ProjectHead = styled.div`
  padding-left: 90px;

  > a {
    color: #333;
  }

  > a > figure {
    float: left;
    margin-left: -90px;
    margin-top: 3px;
  }
`

const m = defineMessages({
  manageProject: {
    id: 'pages.manageableProjectList.manageProject',
    defaultMessage: 'Gerenciar vaga',
  },
  editProject: {
    id: 'pages.manageableProjectList.editProject',
    defaultMessage: 'Editar vaga',
  },
  duplicateProject: {
    id: 'pages.manageableProjectList.duplicateProject',
    defaultMessage: 'Duplicar vaga',
  },
  viewProject: {
    id: 'pages.manageableProjectList.viewProject',
    defaultMessage: 'Visualizar vaga',
  },
})
interface ManageableProjectTableRowProps {
  readonly className?: string
  readonly project: API.Project
  readonly fromOrganization?: API.UserOrganization
}

const ManageableProjectTableRow: React.FC<ManageableProjectTableRowProps> = ({
  className,
  project,
  fromOrganization,
}) => {
  const intl = useIntl()
  return (
    <tr className={className}>
      <td className="pl-5">
        <ProjectHead>
          <Link
            href={
              fromOrganization
                ? Page.OrganizationDashboardProject
                : Page.ViewerProjectDashboard
            }
            as={
              fromOrganization
                ? PageAs.OrganizationDashboardProject({
                    organizationSlug: fromOrganization.slug,
                    projectSlug: project.slug,
                  })
                : PageAs.ViewerProjectDashboard({
                    projectSlug: project.slug,
                  })
            }
          >
            <a>
              <Thumbnail
                style={
                  project.image
                    ? {
                        backgroundImage: `url('${project.image.image_medium_url}')`,
                      }
                    : {
                        backgroundColor: Color.gray[300],
                      }
                }
              />
              <span className="text-lg font-medium block">{project.name}</span>
            </a>
          </Link>
          <span className="text-sm text-gray-600 block mb-1">
            {project.description}
          </span>
        </ProjectHead>
      </td>
      <td style={{ width: 100 }} className="text-left">
        <span className="text-xl">
          {project.applied_count}
          <span className="text-sm text-gray-600">
            {' '}
            / {project.max_applies_from_roles || 0}
          </span>
        </span>
        <span className="font-medium text-gray-500 text-xs block">
          INSCRITOS
        </span>
      </td>
      <td style={{ width: 100 }} className="text-right">
        <ProjectStatusPill project={project} />
      </td>
      <td style={{ width: 250 }} className="pr-5">
        <Link
          href={
            fromOrganization
              ? Page.OrganizationDashboardProject
              : Page.ViewerProjectDashboard
          }
          as={
            fromOrganization
              ? PageAs.OrganizationDashboardProject({
                  organizationSlug: fromOrganization.slug,
                  projectSlug: project.slug,
                })
              : PageAs.ViewerProjectDashboard({
                  projectSlug: project.slug,
                })
          }
        >
          <a className="btn bg-primary-500 text-white hover:bg-primary-600 hover:text-white px-3 rounded-full">
            <Icon name="settings" className="mr-1" />
            {intl.formatMessage(m.manageProject)}
          </a>
        </Link>
        <DropdownWithContext className="inline-block ml-2">
          <DropdownToggler>
            <button className="btn bg-gray-300 hover:bg-gray-400 rounded-full">
              <Icon name="keyboard_arrow_down" />
            </button>
          </DropdownToggler>
          <ContextMenu>
            <Link
              href={
                fromOrganization
                  ? Page.OrganizationEditProject
                  : Page.EditProject
              }
              as={
                fromOrganization
                  ? PageAs.OrganizationEditProject({
                      projectSlug: project.slug,
                      organizationSlug: fromOrganization.slug,
                      stepId: 'geral',
                    })
                  : PageAs.EditProject({
                      projectSlug: project.slug,
                      stepId: 'geral',
                    })
              }
              passHref
            >
              <DropdownAnchor className="dropdown-item">
                {intl.formatMessage(m.editProject)}
              </DropdownAnchor>
            </Link>
            <Link
              href={
                fromOrganization
                  ? Page.OrganizationDuplicateProject
                  : Page.DuplicateProject
              }
              as={
                fromOrganization
                  ? PageAs.OrganizationDuplicateProject({
                      projectSlug: project.slug,
                      organizationSlug: fromOrganization.slug,
                      stepId: 'geral',
                    })
                  : PageAs.DuplicateProject({
                      projectSlug: project.slug,
                      stepId: 'geral',
                    })
              }
              passHref
            >
              <DropdownAnchor className="dropdown-item">
                {intl.formatMessage(m.duplicateProject)}
              </DropdownAnchor>
            </Link>

            <Link
              href={Page.Project}
              as={PageAs.Project({ slug: project.slug })}
              passHref
            >
              <DropdownAnchor className="dropdown-item">
                {intl.formatMessage(m.viewProject)}
              </DropdownAnchor>
            </Link>
          </ContextMenu>
        </DropdownWithContext>
      </td>
    </tr>
  )
}

ManageableProjectTableRow.displayName = 'ManageableProjectTableRow'

export default React.memo(ManageableProjectTableRow)
