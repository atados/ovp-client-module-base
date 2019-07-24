import moment from 'moment'
import Link from 'next/link'
import * as React from 'react'
import styled from 'styled-components'
import { resolvePage } from '~/common/page'
import { PublicUserApplication } from '~/redux/ducks/public-user'

const Container = styled.article`
  border-left: 2px solid #eaecef;
  padding: 2px 10px 20px 32px;
  position: relative;

  &.on-going {
    border-left-color: #008bff;
  }
`

const Image = styled.a`
  min-width: 100px;
  height: 100px;
  display: block;
  margin-left: 20px;
  background-color: #eee;
  border-radius: 3px;
`

const ItemIcon = styled.article`
  border-radius: 50%;
  width: 39px;
  height: 39px;
  position: absolute;
  top: 10px;
  left: -21px;
  background: #008bff;
  text-align: center;
  padding: 3px 0;
  border: 3px solid #fff;

  > img {
    width: 12px;
  }
`

const Timestamp = styled.abbr`
  font-size: 14px;
  color: #666;
`

interface TimelineItemProps {
  readonly className?: string
  readonly onGoing?: boolean
  readonly application: PublicUserApplication
}

const TimelineItem: React.SFC<TimelineItemProps> = ({
  className,
  application,
  onGoing,
}) => (
  <Container
    key={application.id}
    className={`${onGoing ? 'on-going' : ''}${
      className ? ` ${className}` : ''
    }`}
  >
    <ItemIcon>
      <img src="/base/icons/volunteer.svg" alt="Voluntário" />
    </ItemIcon>
    <div className="bg-muted radius-10">
      <div className="py-2 d-flex px-3">
        <div className="flex-grow">
          <Timestamp>{moment(application.date).format('LL')}</Timestamp>
          <h4 className="tw-normal ts-medium mb-1">
            {onGoing ? 'Está participando da ação ' : 'Participou da ação '}
            <Link
              href={{
                pathname: resolvePage('/project'),
                query: { slug: application.project.slug },
              }}
              as={`/vaga/${application.project.slug}`}
            >
              <a>{application.project.name}</a>
            </Link>
          </h4>
          <p className="tc-muted mb-0">{application.project.description}</p>
        </div>
        <Link
          href={{
            pathname: resolvePage('/project'),
            query: { slug: application.project.slug },
          }}
          as={`/vaga/${application.project.slug}`}
        >
          <Image
            href={`/vaga/${application.project.slug}`}
            className="bg-cover"
            style={{
              backgroundImage: application.project.image
                ? `url('${application.project.image.image_medium_url}')`
                : undefined,
            }}
          />
        </Link>
      </div>
      {application.role && (
        <div className="card-item py-2 px-3">
          <span className="d-block ts-small tc-secondary">
            {application.role.name}
          </span>
        </div>
      )}
    </div>
  </Container>
)

TimelineItem.displayName = 'TimelineItem'

export default TimelineItem
