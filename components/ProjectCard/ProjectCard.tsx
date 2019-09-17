import Link from 'next/link'
import React from 'react'
import { WithIntlProps, defineMessages } from 'react-intl'
import styled from 'styled-components'
import { Page, PageAs } from '~/common'
import { APP_URL, channel } from '~/common/constants'
import Icon from '~/components/Icon'
import { withIntl } from '~/lib/intl'
import { formatDisponibility } from '~/lib/project/utils'
import { pushToDataLayer } from '~/lib/tag-manager'
import { Project } from '~/redux/ducks/project'

const Container = styled.div``
const Header = styled.div`
  position: relative;
  border-radius: 3px;
  background: #eee;
  background-size: cover;
  background-position: center;
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

const Author = styled.span`
  color: #bbb;
  display: block;
  font-size: 13px;
  margin-bottom: 5px;
`

const Description = styled.p`
  color: #5a606e;
  height: 84px;
  overflow: hidden;
  margin-bottom: 1rem;
  font-size: 14px;
`

const Info = styled.span`
  display: inline-block;
  font-size: 12px;
  border-radius: 4px;
  padding: 2px 6px;
  font-weight: 500;
  vertical-align: top;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  border-radius: 1000px;

  > span {
    vertical-align: top;
  }
`

const Footer = styled.div`
  margin: 0 -5px;

  > .col-md-6 {
    padding: 0 5px;
  }
`

const Counter = styled.div`
  position: absolute;
  left: 8px;
  bottom: 8px;
  padding: 5px 12px;
  background: ${channel.theme.color.primary[500]};
  color: #fff;
  font-size: 14px;
  height: 30px;
  border-radius: 15px;
  vertical-align: top;

  > img {
    height: 18px;
    vertical-align: top;
  }

  > span {
    display: inline-block;
  }
`

const Pills = styled.div`
  position: absolute;
  right: 8px;
  bottom: 8px;
`

const Pill = styled.span`
  padding: 5px 12px;
  background: #fff;
  font-size: 14px;
  height: 30px;
  border-radius: 15px;
  vertical-align: top;
  display: inline-block;

  > img {
    vertical-align: top;
  }

  > span {
    display: inline-block;
  }

  &.pill-secondary {
    color: #ca5200;
    background: #ffeee3;
  }

  & + & {
    margin-left: 6px;
  }
`

const m = defineMessages({
  by: {
    id: 'projectCard.by',
    defaultMessage: 'por',
  },
})

export const styles = {
  Name,
  Description,
  Header,
  HeaderInner,
  Author,
  Info,
  Footer,
  Counter,
  Pill,
}

interface ProjectCardProps extends Project {
  readonly className?: string
}

class ProjectCard extends React.Component<
  ProjectCardProps & WithIntlProps<any>
> {
  public handleLinkClick = () => {
    const { slug, name } = this.props
    pushToDataLayer({
      event: 'project.card.click',
      'gtm.elementUrl': `https://${APP_URL}/vaga/${slug}`,
      text: name,
      slug,
    })
  }

  public link = (children: React.ReactNode) => {
    const { slug } = this.props

    return (
      <Link href={Page.Project} as={PageAs.Project({ slug })} passHref>
        <Anchor onClick={this.handleLinkClick}>{children}</Anchor>
      </Link>
    )
  }
  public linkOrganization = (children: React.ReactNode) => {
    const { organization } = this.props

    if (!organization) {
      return null
    }

    return (
      <Link
        href={Page.Organization}
        as={PageAs.Organization({ organizationSlug: organization.slug })}
      >
        <a className="tc-gray-600">{children}</a>
      </Link>
    )
  }

  public render() {
    const {
      name,
      address,
      description,
      disponibility,
      image,
      intl,
      applied_count: appliedCount,
      organization,
      className,
      closed,
    } = this.props

    return (
      <Container className={className}>
        {this.link(
          <Header
            className="ratio"
            style={{
              backgroundImage: image
                ? `url('${image.image_medium_url}')`
                : undefined,
            }}
          >
            <HeaderInner
              className="ratio-fill"
              style={{ paddingTop: '66.666666666%' }}
            />
            <Counter title={`${appliedCount} inscritos`}>
              <img
                src="/static/base/icons/volunteer.svg"
                alt=""
                className="mr-2"
              />
              <span>{appliedCount}</span>
            </Counter>
            <Pills>
              {disponibility &&
                disponibility.type === 'work' &&
                disponibility.work.can_be_done_remotely && (
                  <Pill
                    title="Pode ser feita à distância"
                    className="tooltiped tooltiped-hover pill-secondary t-nowrap"
                  >
                    <Icon name="public" />
                    <span className="tooltip">Pode ser feita à distância</span>
                  </Pill>
                )}
            </Pills>
          </Header>,
        )}
        <Author className="text-truncate">
          {closed && (
            <>
              <span className="tc-error tw-medium">ENCERRADA</span> -{' '}
            </>
          )}
          {organization && (
            <>
              {!closed && intl.formatMessage(m.by)}{' '}
              {organization && this.linkOrganization(organization.name)}
            </>
          )}
        </Author>
        {this.link(<Name className="text-truncate">{name}</Name>)}
        <Description>{description}</Description>
        <Footer className="row">
          {address && (
            <div className="col-md-6 mb-2 mb-md-0">
              <Info
                title={`${address.city_state && `${address.city_state}, `} ${
                  address.typed_address
                }`}
                className="block bg-primary-200 tc-primary-700"
              >
                <Icon name="place" />{' '}
                {address.city_state && `${address.city_state}, `}
                {address.typed_address}
              </Info>
            </div>
          )}
          {disponibility && (
            <div className="col-md-6">
              <Info className="bg-primary-200 tc-primary-700">
                <Icon name="date_range" />{' '}
                {formatDisponibility(disponibility, intl)}
              </Info>
            </div>
          )}
        </Footer>
      </Container>
    )
  }
}

export default withIntl(ProjectCard)
