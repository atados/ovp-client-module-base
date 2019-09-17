import Link from 'next/link'
import React from 'react'
import { defineMessages } from 'react-intl'
import styled from 'styled-components'
import { channel } from '~/base/common/constants'
import { UserOrganization } from '~/base/redux/ducks/user'
import { Page, PageAs } from '~/common'
import { useIntl } from 'react-intl'
import Icon from '../Icon'
import ToolbarDropdown from './ToolbarDropdown'
import { StepIds } from '../FormComposer/FormComposer'

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
    padding: 7px 16px !important;
    border-radius: 4px;
  }

  a .icon {
    font-size: 18px;
    vertical-align: middle;
    margin-right: 10px;
    width: 20px;
    color: #666;
  }

  a:hover .icon {
    color: ${channel.theme.color.primary[500]};
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

const ToolbarOrganizationDropdown: React.FC<
  ToolbarOrganizationDropdownProps
> = ({ className, organization }) => {
  const intl = useIntl()

  if (!organization) {
    return (
      <Link
        href={Page.NewOrganization}
        as={PageAs.NewOrganization({ stepId: StepIds.Introduction })}
      >
        <a className="nav-link">{intl.formatMessage(m.imOrganization)}</a>
      </Link>
    )
  }

  return (
    <ToolbarDropdownStyled
      href={organization ? Page.Organization : Page.NewOrganization}
      linkAs={
        organization
          ? PageAs.Organization({ organizationSlug: organization.slug })
          : PageAs.NewOrganization({ stepId: StepIds.Introduction })
      }
      className={className}
      anchorClassName={organization ? 'toolbar-dropdown-anchor bg-white' : ''}
      menuClassName="toolbar-dropdown-menu"
      title={
        organization ? (
          <>
            <Avatar
              className="inline-block w-8 h-8  bg-cover rounded-circle"
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
        <NavPills>
          <div className="p-2">
            <Link
              href={Page.Organization}
              as={PageAs.Organization({
                organizationSlug: organization.slug,
              })}
            >
              <a className="hover:text-primary hover:bg-muted block py-1 px-4 tc-base td-hover-none">
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
              <a className="hover:text-primary hover:bg-muted block py-1 px-4 tc-base td-hover-none">
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
              <a className="hover:text-primary hover:bg-muted block py-1 px-4 tc-base td-hover-none">
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
              <a className="hover:text-primary hover:bg-muted block py-1 px-4 tc-base td-hover-none">
                <Icon name="group" />
                {intl.formatMessage(m.members)}
              </a>
            </Link>
            <Link
              href={Page.OrganizationEdit}
              as={PageAs.OrganizationEdit({
                organizationSlug: organization.slug,
              })}
            >
              <a className="hover:text-primary hover:bg-muted block py-1 px-4 tc-base td-hover-none">
                <Icon name="edit" />
                {intl.formatMessage(m.editOrganization)}
              </a>
            </Link>
          </div>
        </NavPills>
      )}
      {!organization && <div className="p-4">Faça o cadastro da sua ONG</div>}
    </ToolbarDropdownStyled>
  )
}
ToolbarOrganizationDropdown.displayName = 'ToolbarOrganizationDropdown'

export default React.memo(ToolbarOrganizationDropdown)
