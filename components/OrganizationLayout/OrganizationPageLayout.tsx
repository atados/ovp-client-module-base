import Link from 'next/link'
import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { APP_SHARE_URL, channel } from '~/common/constants'
import { ShareList } from '~/components/Share'
import { Organization } from '~/redux/ducks/organization'
import { RootState } from '~/redux/root-reducer'
import Icon from '../Icon'
import VolunteerIcon from '../Icon/VolunteerIcon'
import Layout from '../Layout'
import { useModal } from '../Modal'
import OrganizationLayout from './OrganizationLayout'
import OrganizationLayoutNav from './OrganizationLayoutNav'

const Sidebar = styled.div`
  width: 200px;
  min-width: 200px;
  margin-right: 24px;
  margin-top: 24px;
  min-height: 600px;
`

const SidebarBody = styled.div``

const Avatar = styled.figure`
  width: 200px;
  height: 200px;
  background-color: #fff;
  background-size: cover;
  background-position: center;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.05);
  border-radius: 3px;
`

const Name = styled.h1`
  font-size: 24px;
`

const Body = styled.div`
  flex: 1 1 auto;
  padding-top: 24px;
  padding-bottom: 2rem;
`

const CausesBar = styled.div`
  height: 4px;
  display: flex;
`
const CausesBarItem = styled.span`
  height: 100%;
  display: block;
`

const CoverInfo = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  border-bottom: 1px solid #ddd;
`

const CoverInfoItem = styled.li`
  display: inline-block;
  border-right: 1px solid #eee;
  padding: 0 16px 10px 16px;

  &:first-child {
    padding-left: 0;
  }

  &:last-child {
    border-right-width: 0;
  }
`

const CoverInfoItemValue = styled.h3`
  font-weight: normal;
  font-size: 24px;
  margin-bottom: 0;
`

const CoverInfoItemLabel = styled.span`
  font-size: 13px;
  color: #666;
  font-weight: 500;
`

const ActionsNav = styled.div`
  padding: 10px 0;
`

const VolunteerButton = styled.a`
  > svg {
    margin: -3px 0;
  }
`

interface CoverInfoType {
  fetching?: boolean
  count: number
}

interface OrganizationPageLayoutProps {
  readonly className?: string
  readonly applies?: CoverInfoType
  readonly projects?: CoverInfoType
  readonly organization: Organization
  readonly isCurrentUserMember: boolean
  readonly header?: React.ReactNode | false
}
const OrganizationPageLayout: React.FC<OrganizationPageLayoutProps> = ({
  className,
  children,
  organization,
  isCurrentUserMember,
  applies,
  header,
}) => {
  if (!organization) {
    return <Layout disableFooter />
  }

  const openShareModal = useModal({
    id: 'Share',
    component: ShareList,
    componentProps: {
      subtitle: organization.name,
      url: `${APP_SHARE_URL}/ong/${organization.slug}`,
      meta: {
        title: organization.name,
        description: organization.description,
      },
    },
  })

  return (
    <OrganizationLayout
      className={className}
      organization={organization}
      isCurrentUserMember={isCurrentUserMember}
    >
      <div className="container flex">
        <Sidebar className="hidden md:block">
          <SidebarBody>
            <Avatar
              style={
                !organization.image
                  ? { backgroundColor: organization.color }
                  : {
                      backgroundImage: `url('${organization.image.image_url}')`,
                    }
              }
            />
            <Name>{organization.name}</Name>
            <p className="ts-small tc-muted-dark mb-2">
              {organization.description}
            </p>
            {!organization.published && (
              <span className="badge badge-secondary mb-1">ONG em revisão</span>
            )}
            {organization.address && organization.address.city_state && (
              <span className="block ts-small tc-muted-dark mb-3">
                <Icon name="place" className="mr-1" />
                {organization.address.city_state}
              </span>
            )}
            <OrganizationLayoutNav
              onShare={openShareModal}
              organization={organization}
            />
          </SidebarBody>
        </Sidebar>
        <Body>
          {header === false
            ? undefined
            : header || (
                <>
                  <CoverInfo>
                    <CoverInfoItem>
                      <CoverInfoItemValue>
                        {organization.projects_count || 0}
                      </CoverInfoItemValue>
                      <CoverInfoItemLabel>VAGAS CRIADAS</CoverInfoItemLabel>
                    </CoverInfoItem>
                    <CoverInfoItem>
                      <CoverInfoItemValue>
                        {!applies || applies.fetching
                          ? 'Carregando...'
                          : applies.count}
                      </CoverInfoItemValue>
                      <CoverInfoItemLabel>
                        VOLUNTÁRIOS ENGAJADOS
                      </CoverInfoItemLabel>
                    </CoverInfoItem>
                  </CoverInfo>

                  <ActionsNav>
                    <a
                      href={`mailto:${organization.contact_email}`}
                      className="btn btn--size-2 btn-text tc-primary-500  mr-2"
                    >
                      <Icon name="mail" className="mr-2" />
                      Enviar email
                    </a>
                    <Link
                      href={{
                        pathname: '/organization-projects',
                        query: { slug: organization.slug },
                      }}
                      as={`/ong/${organization.slug}/vagas`}
                    >
                      <VolunteerButton
                        href={`/ong/${organization.slug}/vagas`}
                        className="btn btn-text tc-primary-500 btn--size-2"
                      >
                        <VolunteerIcon
                          width={16}
                          height={16}
                          fill={channel.theme.color.primary[500]}
                          className="mr-2 d-inline-block"
                        />
                        Quero voluntariar
                      </VolunteerButton>
                    </Link>
                  </ActionsNav>
                  <CausesBar className="mb-3">
                    {organization.causes.map(cause => (
                      <CausesBarItem
                        key={cause.id}
                        style={{
                          backgroundColor: cause.color,
                          width: `${100 / organization.causes.length}%`,
                        }}
                      />
                    ))}
                  </CausesBar>
                </>
              )}
          {children}
        </Body>
      </div>
    </OrganizationLayout>
  )
}

OrganizationPageLayout.displayName = 'OrganizationPageLayout'

interface MappedProps {
  applies: CoverInfoType
}

const mapStateToProps = ({ organizationApplies }: RootState): MappedProps => ({
  applies: {
    fetching: organizationApplies.fetching,
    count: organizationApplies.payload
      ? organizationApplies.payload.applied_count
      : 0,
  },
})

export default connect<MappedProps>(mapStateToProps)(OrganizationPageLayout)
