import ProjectCardFooter from '~/components/ProjectCard/ProjectCardFooter'
import ProjectCardPills from '~/components/ProjectCard/ProjectCardPills'
import ProjectCardBody from '~/components/ProjectCard/ProjectCardBody'
import { pushToDataLayer } from '~/lib/tag-manager'
import { Project } from '~/redux/ducks/project'
import { Page, PageAs, Color } from '~/common'
import { APP_URL } from '~/common/constants'
import { WithIntlProps } from 'react-intl'
import styled from 'styled-components'
import { withIntl } from '~/lib/intl'
import Link from 'next/link'
import React from 'react'

const Container = styled.div`
  background: none;
  transition: background 0.1s, box-shadow 0.1s;
  box-shadow: 0 0 transparent;
  border-radius: 10px;

  &:hover {
    background: ${Color.gray[200]};
    box-shadow: 0 0 0 10px ${Color.gray[200]};
  }
`
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

const Footer = styled.div`
  margin: 0 -5px;
`

const Counter = styled.div`
  position: absolute;
  left: 8px;
  bottom: 8px;
  padding: 5px 12px;
  background: ${Color.primary[500]};
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

export const styles = {
  Name,
  Description,
  Header,
  HeaderInner,
  Author,
  Footer,
  Counter,
  Pill,
}

interface ProjectCardProps extends Project {
  readonly className?: string
  readonly nameClassName?: string
  readonly descriptionClassName?: string
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
        <a className="text-gray-600">{children}</a>
      </Link>
    )
  }

  public render() {
    const { image, applied_count: appliedCount, className } = this.props

    return (
      <Container className={className}>
        {this.link(
          <Header
            className="ratio rounded-lg"
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
                src="/generated/static/icons/volunteer.svg"
                alt=""
                className="mr-2 inline-block"
              />
              <span>{appliedCount}</span>
            </Counter>
            <ProjectCardPills {...this.props} />
          </Header>,
        )}
        <ProjectCardBody
          link={this.link}
          linkOrganization={this.linkOrganization}
          {...this.props}
        />
        <ProjectCardFooter {...this.props} />
      </Container>
    )
  }
}

export default withIntl(ProjectCard)
