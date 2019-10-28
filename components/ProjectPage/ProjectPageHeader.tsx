import Link from 'next/link'
import React from 'react'
import styled from 'styled-components'
import { colors, channel } from '~/common/constants'
import { Project } from '~/redux/ducks/project'
import Icon from '../Icon'
import ProjectStatusPill from '../ProjectStatusPill'
import { Page, PageAs } from '~/common'
import { defineMessages } from 'react-intl'
import { useIntl } from 'react-intl'

const Apply = styled.li`
  width: 38px;
  height: 38px;
  border: 3px solid #fff;
  display: inline-block;
  border-radius: 50%;
  background-color: #eee;
  background-size: cover;
  background-position: center;
  vertical-align: top;

  > a {
    width: 100%;
    height: 100%;
    display: block;
  }

  &.apply__more {
    font-size: 13px;
    text-align: center;
    line-height: 2.5;
    background: #0288f6;
    color: #fff;
  }
`

const Applies = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: inline-block;

  ${Apply} + ${Apply} {
    margin-left: -12px;
  }
`

const AppliesCount = styled.span`
  vertical-align: top;
  display: inline-block;
  margin-top: 7px;
`

const Causes = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;

  > li {
    margin-right: 10px;
    display: inline-block;
    vertical-align: top;
  }

  > li > a {
    color: #333;
    font-weight: 500;
  }
`

const CauseIndicator = styled.span`
  display: inline-block;
  vertical-align: top;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #999;
  margin: 7px 5px 0 0;
`

const Pills = styled.div`
  margin: -5px;
`

const Progress = styled.div`
  height: 5px;
  background: #eee;
  border-radius: 10px;
  overflow: hidden;
`

const ProgressValue = styled.div`
  background: ${channel.theme.color.primary[500]};
  height: 5px;
`

const Pill = styled.span`
  display: inline-block;
  height: 32px;
  border-radius: 16px;
  padding: 5px 16px;
  margin: 5px;
  white-space: nowrap;
`

const Showcase = styled.div`
  min-width: 352px;
  max-width: 352px;
  margin-left: 32px;
  border-radius: 10px;
`

const Thumbnail = styled.div`
  .ratio-body {
    background: #f85a40;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.1);
    background-size: cover;
    background-position: center;
  }
`

const OwnerAvatar = styled.figure`
  width: 40px;
  height: 40px;
  min-width: 40px;
  border-radius: 3px;
`

const {
  INSCRITO,
  INSCRITOS,
  PODE_SER,
  FALTAM,
  VOLUNTARIOS,
  REALIZADO,
} = defineMessages({
  INSCRITO: {
    id: 'INSCRITO',
    defaultMessage: 'inscrito',
  },
  INSCRITOS: {
    id: 'INSCRITOS',
    defaultMessage: 'inscritos',
  },
  PODE_SER: {
    id: 'PODE_SER',
    defaultMessage: 'Pode ser feito à distância',
  },
  FALTAM: {
    id: 'FALTAM',
    defaultMessage: 'Faltam',
  },
  VOLUNTARIOS: {
    id: 'VOLUNTARIOS',
    defaultMessage: 'voluntários',
  },
  REALIZADO: {
    id: 'REALIZADO',
    defaultMessage: 'Realizado pela ONG:',
  },
})

interface ProjectPageHeaderProps {
  readonly className?: string
  readonly project: Project
  readonly isOwner?: boolean
}

const ProjectPageHeader: React.FC<ProjectPageHeaderProps> = ({
  className,
  project,
  isOwner,
}) => {
  const intl = useIntl()

  return (
    <div className={`container pt-5${className ? ` ${className}` : ''}`}>
      <div className="flex">
        <div className="flex-grow">
          <h1 id="geral">{project.name}</h1>
          <h2 className="tw-normal ts-medium tl-base">{project.description}</h2>
          {project.address && (
            <p className="tc-muted">
              {project.address.typed_address}
              {project.address.typed_address2 && (
                <>
                  {'. Complemento: '}
                  {project.address.typed_address2}
                </>
              )}
            </p>
          )}

          <div className="xl:flex">
            <div className="t-nowrap">
              {project.applies.length > 0 && (
                <Applies className="mr-2">
                  {project.applies.slice(0, 4).map((application, i) => (
                    <Apply
                      key={application.user ? application.user.uuid : i}
                      style={{
                        backgroundColor: colors[i],
                        backgroundImage:
                          application.user && application.user.avatar
                            ? `url('${application.user.avatar.image_small_url}')`
                            : undefined,
                      }}
                    >
                      {application.user && (
                        <Link
                          href={Page.PublicUser}
                          as={PageAs.PublicUser({
                            slug: application.user.slug,
                          })}
                        >
                          <a />
                        </Link>
                      )}
                    </Apply>
                  ))}
                  {project.applied_count > 4 && (
                    <Apply className="apply__more">
                      +{Math.min(99, project.applied_count - 4)}
                    </Apply>
                  )}
                </Applies>
              )}
              {(project.applied_count > 0 || isOwner) && (
                <AppliesCount>
                  <b>{project.applied_count}</b>{' '}
                  {project.applied_count === 1
                    ? intl.formatMessage(INSCRITO)
                    : intl.formatMessage(INSCRITOS)}{' '}
                </AppliesCount>
              )}
            </div>
            <div className="mr-auto" />
            <Pills className="ta-xl-right ta-left mt-2 mt-xl-0">
              {project.disponibility &&
                project.disponibility.type === 'work' &&
                project.disponibility.work.can_be_done_remotely && (
                  <Pill className="bg-secondary-100 tc-secondary-500">
                    <Icon name="public" className="mr-2" />
                    {intl.formatMessage(PODE_SER)}
                  </Pill>
                )}
              {!project.closed &&
                project.max_applies_from_roles - project.applied_count > 0 && (
                  <Pill className="bg-primary-100 tc-primary-500">
                    <Icon name="person" className="mr-2" />
                    {`${intl.formatMessage(FALTAM)} `}
                    {project.max_applies_from_roles - project.applied_count}
                    {` ${intl.formatMessage(VOLUNTARIOS)}`}
                  </Pill>
                )}
              {isOwner && (
                <ProjectStatusPill project={project} className="ml-2" />
              )}
            </Pills>
          </div>
          <Progress className="mb-3 mt-3">
            <ProgressValue
              style={{
                width: `${Math.min(
                  1,
                  project.applied_count / project.max_applies_from_roles,
                ) * 100}%`,
              }}
            />
          </Progress>
          <div className="xl:flex">
            <Causes>
              {project.causes.map(cause => (
                <li key={cause.id}>
                  <Link
                    as={PageAs.Cause({ slug: cause.slug })}
                    href={Page.Cause}
                  >
                    <a>
                      <CauseIndicator
                        style={{ backgroundColor: cause.color }}
                      />
                      {cause.name}
                    </a>
                  </Link>
                </li>
              ))}
            </Causes>
            <div className="mr-auto" />
          </div>
        </div>
        <Showcase className="hidden lg:block">
          <Thumbnail className="ratio">
            <span className="ratio-fill" style={{ paddingTop: '56%' }} />
            <div
              className="ratio-body"
              style={
                project.image
                  ? {
                      backgroundImage: `url('${project.image.image_medium_url}')`,
                    }
                  : undefined
              }
            />
          </Thumbnail>
          {project.organization && (
            <div className="mt-4">
              <Link
                href={Page.Organization}
                as={PageAs.Organization({
                  organizationSlug: project.organization.slug,
                })}
              >
                <a className="media tc-base text-truncate">
                  <OwnerAvatar
                    className="bg-cover mb-0 mr-2"
                    style={
                      project.organization.image
                        ? {
                            backgroundImage: `url(${project.organization.image
                              .image_medium_url ||
                              project.organization.image.image_url})`,
                          }
                        : { backgroundColor: '#ddd' }
                    }
                  />
                  <div className="media-body tl-heading">
                    <span className="tc-muted block ts-small mb-1">
                      {intl.formatMessage(REALIZADO)}
                    </span>
                    <span className="text-truncate tw-medium text-truncate block">
                      {project.organization.name}
                    </span>
                  </div>
                </a>
              </Link>
            </div>
          )}
        </Showcase>
      </div>
    </div>
  )
}

ProjectPageHeader.displayName = 'ProjectPageHeader'

export default React.memo(ProjectPageHeader)
