import Link from 'next/link'
import { withRouter, WithRouterProps } from 'next/router'
import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { resolvePage } from '~/common/page'
import { User } from '~/redux/ducks/user'
import { RootState } from '~/redux/root-reducer'

const Nav = styled.div`
  @media (min-width: 768px) {
    border-right: 1px solid #ddd;
  }

  .nav-link {
    color: #444;
    font-size: 16px;

    &:hover {
      color: #222;
    }
  }

  .nav-link.active,
  .nav-link:hover {
    background: rgba(0, 0, 0, 0.04);
  }

  .nav-link.active {
    color: #222 !important;
    box-shadow: -3px 0 ${props => props.theme.colorSecondary};
  }
`

const OrganizationAvatar = styled.div`
  width: 24px;
  height: 24px;
`

interface UserSettingsNavProps {
  readonly user?: User
}

const UserSettingsNav: React.FC<UserSettingsNavProps & WithRouterProps> = ({
  user,
  router,
}) =>
  user ? (
    <Nav>
      <div className="mb-4">
        <div className="px-2 py-1 tw-medium">Minha Conta</div>
        <Link
          href={{
            pathname: resolvePage('/settings-user'),
            query: { slug: user.slug },
          }}
          as="/configuracoes/perfil"
        >
          <a
            className={`px-2 py-1 nav-link ${
              router!.pathname === resolvePage('/settings-user') ? 'active' : ''
            }`}
          >
            Perfil público
          </a>
        </Link>

        <Link
          href={{
            pathname: resolvePage('/settings-password'),
            query: { slug: user.slug },
          }}
          as="/configuracoes/alterar-senha"
        >
          <a
            className={`px-2 py-1 nav-link ${
              router!.pathname === resolvePage('/settings-password')
                ? 'active'
                : ''
            }`}
          >
            Alterar senha
          </a>
        </Link>
        <Link
          href={{
            pathname: resolvePage('/settings-organizations'),
            query: { slug: user.slug },
          }}
          as="/configuracoes/ongs"
        >
          <a
            className={`px-2 py-1 nav-link ${
              router!.pathname === resolvePage('/settings-organizations')
                ? 'active'
                : ''
            }`}
          >
            ONGs que você é responsável
          </a>
        </Link>
      </div>
      {user.organizations.length > 0 && (
        <div className="d-none d-md-block">
          <div className="px-2 py-1 tw-medium">ONGs</div>
          {user.organizations.map(organization => (
            <Link
              key={organization.slug}
              href={{
                pathname: resolvePage('/organization'),
                query: { slug: organization.slug },
              }}
              as={`/ong/${organization.slug}`}
            >
              <a className="px-2 py-1 nav-link text-truncate">
                <OrganizationAvatar
                  className="avatar"
                  style={
                    organization.image
                      ? {
                          backgroundImage: `url('${
                            organization.image.image_small_url
                          }')`,
                        }
                      : undefined
                  }
                />
                {organization.name}
              </a>
            </Link>
          ))}
        </div>
      )}
    </Nav>
  ) : null

UserSettingsNav.displayName = 'UserSettingsNav'

const mapStateToProps = ({ user }: RootState) => ({
  user,
})

export default withRouter<UserSettingsNavProps>(
  connect(mapStateToProps)(UserSettingsNav),
)
