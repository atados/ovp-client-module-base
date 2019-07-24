import cx from 'classnames'
import Link from 'next/link'
import React from 'react'
import styled from 'styled-components'
import { channel } from '~/common/constants'
import { resolvePage } from '~/common/page'
import { UserOrganization } from '~/redux/ducks/user'
import { DropdownMenu, DropdownToggler } from '../Dropdown'
import DropdownWithContext from '../Dropdown/DropdownWithContext'
import Icon from '../Icon'

const Avatar = styled.div`
  float: left;
  margin-left: -41px;
  margin-top: -4px;
`
const Toggler = styled.a`
  padding-left: 45px;
  padding-right: 40px;
  height: 40px;

  .icon {
    position: absolute;
    right: 20px;
    font-size: 20px;
    line-height: 1.2;
  }
`

const Menu: React.FC<{ className?: string }> = styled(DropdownMenu)`
  left: auto;
  width: 300px;

  > a {
    padding: 7px 16px !important;
  }

  > a .icon {
    font-size: 18px;
    vertical-align: middle;
    margin-right: 10px;
    width: 20px;
    color: #666;
  }

  > a:hover .icon {
    color: ${channel.theme.colorPrimary};
  }
`

interface ToolbarOrganizationProps {
  readonly organization: UserOrganization
  readonly className?: string
  readonly theme?: 'dark' | 'light'
}

const ToolbarOrganization: React.FC<ToolbarOrganizationProps> = ({
  className,
  organization,
}) => (
  <DropdownWithContext>
    <DropdownToggler>
      <Toggler
        href={`/ong/${organization.slug}`}
        className={cx(
          className,
          'd-block bg-white rounded-full py-1 shadow tc-base tw-medium text-truncate',
        )}
      >
        <Avatar
          className="d-inline-block w-32 h-32  bg-cover rounded-circle"
          style={
            organization.image
              ? {
                  backgroundImage: `url('${
                    organization.image.image_small_url
                  }')`,
                }
              : { backgroundColor: '#ddd' }
          }
        />
        {organization.name}
        <Icon name="keyboard_arrow_down" className="dropdownArrow" />
      </Toggler>
    </DropdownToggler>
    <Menu className="mt-1 py-2">
      <Link
        href={{
          pathname: resolvePage('/organization'),
          query: { slug: organization.slug },
        }}
        as={`/ong/${organization.slug}`}
      >
        <a className="hover:text-primary hover:bg-muted d-block py-1 px-4 tc-base td-hover-none">
          <Icon name="visibility" />
          Página da ONG
        </a>
      </Link>
      <hr className="my-1" />
      <Link
        href={{
          pathname: resolvePage('/project-composer'),
          query: { organizationSlug: organization.slug },
        }}
        as={`/ong/${organization.slug}/criar-vaga`}
      >
        <a className="hover:text-primary hover:bg-muted d-block py-1 px-4 tc-base td-hover-none">
          <Icon name="add" />
          Criar vaga
        </a>
      </Link>
      <Link
        href={{
          pathname: resolvePage('/manageable-projects-list'),
          query: { organizationSlug: organization.slug },
        }}
        as={`/ong/${organization.slug}/gerenciar/vagas`}
      >
        <a className="hover:text-primary hover:bg-muted d-block py-1 px-4 tc-base td-hover-none">
          <Icon name="settings" />
          Gerenciar vagas
        </a>
      </Link>
      <hr className="my-1" />
      <Link
        href={{
          pathname: resolvePage('/organization-members'),
          query: { organizationSlug: organization.slug },
        }}
        as="/membros"
      >
        <a className="hover:text-primary hover:bg-muted d-block py-1 px-4 tc-base td-hover-none">
          <Icon name="group" />
          Membros
        </a>
      </Link>
      <Link
        href={{
          pathname: resolvePage('/organization-edit'),
          query: { slug: organization.slug },
        }}
        as={`/ong/${organization.slug}/editar`}
      >
        <a className="hover:text-primary hover:bg-muted d-block py-1 px-4 tc-base td-hover-none">
          <Icon name="edit" />
          Editar perfil da ONG
        </a>
      </Link>
    </Menu>
  </DropdownWithContext>
)

ToolbarOrganization.displayName = 'ToolbarOrganization'

export default ToolbarOrganization
