import Link from 'next/link'
import React from 'react'
import styled from 'styled-components'
import { colors, channel } from '~/common/constants'
import { rgba } from '~/lib/color/transformers'
import { Project } from '~/redux/ducks/project'
import { SearchType } from '~/redux/ducks/search'
import { Page, PageAs } from '~/common'

const RoleName = styled.h2`
  font-size: 20px;
  font-weight: normal;
  line-height: 1.5;
`

const RoleText = styled.p`
  font-size: 16px;
  margin-bottom: 12px;
`

const RoleSectionTitle = styled.h3`
  font-size: 12px;
  color: #666;
  font-weight: 500;
`

const Apply = styled.li`
  width: 28px;
  height: 28px;
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
    font-size: 11px;
    text-align: center;
    line-height: 2.2;
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

const RoleApply = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  border-radius: 10px;
  background: ${rgba(channel.theme.color.primary[500], 90)};
  opacity: 0;
  transition: opacity 0.2s;
  cursor: pointer;
  color: #fff;
  font-size: 18px;
  text-align: center;

  > div {
    display: none;
    height: 40px;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
  }
`

const Role = styled.button`
  padding: 16px;
  border: 1px solid #e5e5e5;
  background: #fff;
  border-radius: 10px;
  width: 100%;
  text-align: left;
  outline: none;
  position: relative;

  &:hover ${RoleApply} {
    opacity: 1;

    > div {
      display: block;
    }
  }
`

interface ProjectPageRolesProps {
  readonly className?: string
  readonly project: Project
  readonly isOwner?: boolean
  readonly onApply?: (roleId?: number) => void
}

const ProjectPageRoles: React.FC<ProjectPageRolesProps> = ({
  className,
  project,
  onApply,
}) => {
  if (!project.roles.length) {
    return null
  }

  if (project.closed || project.canceled) {
    return (
      <div className={className}>
        <div className="card radius-10 p-4">
          <span className="ts-large block">Essa vaga foi encerrada</span>
          <span className="ts-small tc-muted">
            Essa vaga não necessita mais de voluntários. Mas não precisa parar
            por aqui! Clique abaixo para encontrar outras vagas relacionadas.
          </span>
          <hr />
          <Link
            href={{
              pathname: Page.SearchProjects,
              query: { searchType: SearchType.Projects },
            }}
            as={PageAs.SearchProjects()}
          >
            <a className="btn btn-white tc-primary-500 btn--size-3 btn--block">
              Buscar outras vagas
            </a>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className={className}>
      <h4 className="mb-4">Como contribuir</h4>
      {project.roles.map(role => (
        <Role
          key={role.id}
          type="button"
          className="mb-4"
          onClick={onApply ? () => onApply(role.id) : undefined}
        >
          <RoleApply>
            <div className="animte-slideInUp">
              Quero contribuir como <b className="block">{role.name}</b>
            </div>
          </RoleApply>
          <RoleName>{role.name}</RoleName>
          <RoleSectionTitle>FUNÇÃO</RoleSectionTitle>
          <RoleText>{role.details}</RoleText>
          <RoleSectionTitle>PRÉ-REQUISITOS</RoleSectionTitle>
          <RoleText>{role.prerequisites}</RoleText>
          <div className="flex">
            <span className="tw-medium mr-2">
              {role.applied_count}/{role.vacancies}
            </span>
            <div className="mr-auto" />
            {role.applies && role.applies.length > 0 && (
              <Applies className="mr-2">
                {role.applies.slice(0, 10).map((application, i) => (
                  <Apply
                    key={application.user ? application.user.uuid : i}
                    style={{
                      backgroundColor: colors[i],
                      backgroundImage:
                        application.user && application.user.avatar
                          ? `url('${application.user.avatar.image_small_url}')`
                          : undefined,
                    }}
                  />
                ))}
                {project.applied_count > 10 && (
                  <Apply className="apply__more">
                    +{Math.min(99, project.applied_count - 10)}
                  </Apply>
                )}
              </Applies>
            )}
          </div>
        </Role>
      ))}
    </div>
  )
}

ProjectPageRoles.displayName = 'ProjectPageRoles'

export default React.memo(ProjectPageRoles)
