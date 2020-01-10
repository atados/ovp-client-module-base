import Link from 'next/link'
import React from 'react'
import styled from 'styled-components'
import { withIntl } from '~/lib/intl'
import { APP_URL } from '~/common/constants'
import { pushToDataLayer } from '~/lib/tag-manager'
import { Organization } from '~/redux/ducks/organization'
import { Page, PageAs } from '~/common'
import { WithIntlProps } from 'react-intl'

const Header = styled.div`
  position: relative;
  border-radius: 3px;
  background: #eee;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  margin-bottom: 8px;
`
const HeaderInner = styled.div`
  border-radius: 3px;
  border: 1px solid rgba(0, 0, 0, 0.05);
`
const Name = styled.h4`
  font-size: 1.125rem;
  margin-bottom: 5px;
  font-weight: 500;
`

const Anchor = styled.a`
  color: #383536;

  &:hover {
    color: #383536;
  }
`

const Description = styled.p`
  color: #5a606e;
  height: 84px;
  overflow: hidden;
  margin-bottom: 1rem;
  font-size: 14px;
  line-height: 1.5;
`

const Info = styled.span`
  text-transform: uppercase;
  font-size: 14px;
  font-weight: 500;
  display: block;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  margin-bottom: 5px;
`

export const styles = {
  Header,
  HeaderInner,
  Name,
  Info,
  Anchor,
  Description,
}

interface OrganizationCardProps {
  readonly className?: string
  readonly organization: Organization
}

class OrganizationCard extends React.Component<
  OrganizationCardProps & WithIntlProps<any>
> {
  public handleLinkClick = () => {
    const { organization } = this.props

    pushToDataLayer({
      event: 'organization.card.click',
      'gtm.elementUrl': `https://${APP_URL}/vaga/${organization.slug}`,
      text: organization.name,
      slug: organization.slug,
    })
  }

  public link = (children: React.ReactNode) => {
    const { organization } = this.props

    return (
      <Link
        href={Page.Organization}
        as={PageAs.Organization({ organizationSlug: organization.slug })}
      >
        <Anchor
          href={`/ong/${organization.slug}`}
          onClick={this.handleLinkClick}
        >
          {children}
        </Anchor>
      </Link>
    )
  }

  public render() {
    const { organization, className } = this.props

    return (
      <div className={className}>
        {this.link(
          <Header
            className="ratio"
            style={{
              backgroundColor: organization.image ? '#fff' : undefined,
              backgroundImage: organization.image
                ? `url('${organization.image.image_medium_url ||
                    organization.image.image_url}')`
                : undefined,
            }}
          >
            <HeaderInner
              className="ratio-fill"
              style={{ paddingTop: '100%' }}
            />
          </Header>,
        )}
        {organization.address && (
          <Info
            title={`${organization.address.city_state &&
              `${organization.address.city_state}, `} ${
              organization.address.typed_address
            }`}
            className="w-full text-secondary-500"
          >
            {organization.address.city_state &&
              `${organization.address.city_state}, `}
            {organization.address.typed_address}
          </Info>
        )}
        {this.link(<Name className="truncate">{organization.name}</Name>)}
        <Description>{organization.description}</Description>
      </div>
    )
  }
}

export default withIntl<OrganizationCardProps>(OrganizationCard)
