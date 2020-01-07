import Link from 'next/link'
import React from 'react'
import { defineMessages } from 'react-intl'
import styled from 'styled-components'
import { UserOrganization } from '~/base/redux/ducks/user'
import { Page, PageAs, Color } from '~/common'
import { useIntl } from 'react-intl'
import Icon from '../Icon'
import ToolbarDropdown from './ToolbarDropdown'

const ToolbarDropdownStyled = styled(ToolbarDropdown)`
  .toolbar-dropdown-anchor {
    border-radius: 9999px !important;
    color: #333 !important;
    font-weight: normal !important;
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding-left: 45px !important;
    padding-right: 40px !important;
    height: 40px;

    .icon {
      position: absolute;
      right: 10px;
      top: 8px;
      font-size: 20px;
      line-height: 1.2;
    }

    &.active {
      border-radius: 6px 6px 0 0 !important;
    }
  }

  .toolbar-dropdown-menu {
    width: 300px;
    height: auto;
  }
`

const Avatar = styled.div`
  float: left;
  margin-left: -41px;
  margin-top: -2px;
`

const NavPills = styled.div`
  left: auto;
  width: 300px;

  a {
    padding: 7px 5px 7px 16px !important;
  }

  a .icon {
    font-size: 18px;
    vertical-align: middle;
    margin-right: 10px;
    width: 32px;
    height: 32px;
    text-align: center;
    color: ${Color.gray[700]};
    background: ${Color.gray[200]};
    border-radius: 50%;
    line-height: 1.8;
  }

  a:hover .icon {
    color: ${Color.primary[700]};
    background-color: ${Color.gray[300]};
  }
`

interface ToolbarOrganizationDropdownProps {
  readonly className?: string
  readonly organization?: UserOrganization
  readonly theme?: 'dark' | 'light'
}

const m = defineMessages({
  imOrganization: {
    id: 'toolbar.dropdown.organization.title',
    defaultMessage: 'Sou uma ONG',
  },
  page: {
    id: 'toolbarOrganizationDropdown.page',
    defaultMessage: 'Página da ONG',
  },
  newProject: {
    id: 'toolbarOrganizationDropdown.newProject',
    defaultMessage: 'Criar vaga',
  },
  manageProjects: {
    id: 'toolbarOrganizationDropdown.manageProjects',
    defaultMessage: 'Gerenciar vagas',
  },
  members: {
    id: 'toolbarOrganizationDropdown.members',
    defaultMessage: 'Membros',
  },
  editOrganization: {
    id: 'toolbarOrganizationDropdown.editOrganization',
    defaultMessage: 'Editar ONG',
  },
})

const ToolbarOrganizationDropdown: React.FC<ToolbarOrganizationDropdownProps> = ({
  className,
  organization,
}) => {
  const intl = useIntl()

  if (!organization) {
    return (
      <Link href={Page.OrganizationOnboarding}>
        <a className="nav-link">{intl.formatMessage(m.imOrganization)}</a>
      </Link>
    )
  }

  return (
    <ToolbarDropdownStyled
      href={organization ? Page.Organization : Page.OrganizationOnboarding}
      linkAs={
        organization
          ? PageAs.Organization({ organizationSlug: organization.slug })
          : undefined
      }
      className={className}
      anchorClassName={organization ? 'toolbar-dropdown-anchor bg-white' : ''}
      menuClassName="toolbar-dropdown-menu"
      title={
        organization ? (
          <>
            <Avatar
              className="inline-block w-8 h-8  bg-cover bg-center rounded-full"
              style={
                organization.image
                  ? {
                      backgroundImage: `url('${organization.image.image_small_url}')`,
                    }
                  : { backgroundColor: '#ddd' }
              }
            />
            {organization.name}
            <Icon name="keyboard_arrow_down" className="dropdownArrow" />
          </>
        ) : (
          intl.formatMessage(m.imOrganization)
        )
      }
    >
      {organization && (
        <NavPills className="py-3">
          <Link
            href={Page.Organization}
            as={PageAs.Organization({
              organizationSlug: organization.slug,
            })}
          >
            <a className="hover:text-primary hover:bg-gray-200 block py-2 px-5 text-gray-800 td-hover-none">
              <Icon name="visibility" />
              {intl.formatMessage(m.page)}
            </a>
          </Link>
          <hr className="my-1" />
          <Link
            href={Page.OrganizationNewProject}
            as={PageAs.OrganizationNewProject({
              stepId: 'inicio',
              organizationSlug: organization.slug,
            })}
          >
            <a className="hover:text-primary hover:bg-gray-200 block py-2 px-5 text-gray-800 td-hover-none">
              <Icon name="add" />
              {intl.formatMessage(m.newProject)}
            </a>
          </Link>
          <Link
            href={Page.OrganizationDashboardProjectsList}
            as={PageAs.OrganizationDashboardProjectsList({
              organizationSlug: organization.slug,
            })}
          >
            <a className="hover:text-primary hover:bg-gray-200 block py-2 px-5 text-gray-800 td-hover-none">
              <Icon name="settings" />
              {intl.formatMessage(m.manageProjects)}
            </a>
          </Link>
          <hr className="my-1" />
          <Link
            href={Page.OrganizationDashboardMembers}
            as={PageAs.OrganizationDashboardMembers({
              organizationSlug: organization.slug,
            })}
          >
            <a className="hover:text-primary hover:bg-gray-200 block py-2 px-5 text-gray-800 td-hover-none">
              <Icon name="group" />
              {intl.formatMessage(m.members)}
            </a>
          </Link>
          <Link
            href={Page.OrganizationEdit}
            as={PageAs.OrganizationEdit({
              organizationSlug: organization.slug,
              stepId: 'basics',
            })}
          >
            <a className="hover:text-primary hover:bg-gray-200 block py-2 px-5 text-gray-800 td-hover-none">
              <Icon name="edit" />
              {intl.formatMessage(m.editOrganization)}
            </a>
          </Link>
        </NavPills>
      )}
      {!organization && <div className="p-4">Faça o cadastro da sua ONG</div>}
    </ToolbarDropdownStyled>
  )
}
ToolbarOrganizationDropdown.displayName = 'ToolbarOrganizationDropdown'

export default React.memo(ToolbarOrganizationDropdown)
