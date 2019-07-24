import moment from 'moment'
import Link from 'next/link'
import React from 'react'
import { InjectedIntlProps } from 'react-intl'
import styled from 'styled-components'
import { resolvePage } from '~/common/page'
import Icon from '~/components/Icon'
import { withIntl } from '~/lib/intl'
import { findNearestDate, formatDisponibility } from '~/lib/project/utils'
import { Project } from '~/redux/ducks/project'

// const Container = styled.div``
const Thumbnail = styled.div`
  .ratio-body {
    background: #f85a40;
    left: -1px;
    top: -1px;
    right: -1px;
    border-radius: 10px 10px 0 0;
    overflow: hidden;
    box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.1);
    background-size: cover;
    background-position: center;
  }
`

const Info = styled.div`
  height: 48px;
  background: ${props => props.theme.colorPrimary};
  color: #fff;
  box-shadow: none;

  &.info--hiden-thumbnail {
    margin-top: -1px;
  }
`

const InfoText = styled.h2`
  font-size: 20px;
  font-weight: normal;
  padding: 12px 16px;
`

const Block = styled.div`
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
`

const OrganizationAvatar = styled.figure`
  width: 40px;
  height: 40px;
  min-width: 40px;
  border-radius: 3px;
  background-color: #ddd;
`

interface ProjectApplicationCardProps extends InjectedIntlProps {
  readonly className?: string
  readonly project: Project
  readonly renderThumbnail?: boolean
  readonly onApply: (roleId: number) => void
  readonly onUnapply: () => void
}

interface ProjectApplicationCardState {
  selectedRoleIndex: string
}

class ProjectApplicationCard extends React.Component<
  ProjectApplicationCardProps & InjectedIntlProps,
  ProjectApplicationCardState
> {
  constructor(props) {
    super(props)

    this.state = {
      selectedRoleIndex:
        props.project.roles && props.project.roles.length > 1 ? '' : '0',
    }
  }

  public handleRoleSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const { value } = event.target

    this.setState({ selectedRoleIndex: value })
  }

  public submit = () => {
    const { project, onApply, onUnapply } = this.props

    if (!project.current_user_is_applied) {
      if (onApply) {
        const role = project.roles[this.state.selectedRoleIndex]
        onApply(role ? role.id : undefined)
      }
    } else if (onUnapply) {
      onUnapply()
    }
  }

  public render() {
    const { intl, project, renderThumbnail, className } = this.props
    const { selectedRoleIndex } = this.state
    let disponibilityText: any = project.canceled
      ? 'Cancelada'
      : project.closed
      ? 'Encerrada'
      : undefined

    if (!(project.closed || project.canceled) && project.disponibility) {
      if (project.disponibility.type === 'work') {
        disponibilityText = formatDisponibility(project.disponibility, intl)
      } else {
        const nearestDate = findNearestDate(project.disponibility)

        if (nearestDate) {
          const startMoment = moment(nearestDate.start_date)
          const endMoment = moment(nearestDate.end_date)

          disponibilityText = (
            <>
              <b>{startMoment.format('L')}</b>
              {' de '}
              {startMoment.format('LT')}
              {' até '}
              {endMoment.format('LT')}
            </>
          )
        }
      }
    }

    return (
      <div className={`radius-10 bg-muted ${className ? ` ${className}` : ''}`}>
        {renderThumbnail && (
          <Thumbnail className="ratio">
            <span className="ratio-fill" style={{ paddingTop: '56%' }} />
            <div
              className="ratio-body"
              style={
                project.image
                  ? {
                      backgroundImage: `url('${
                        project.image.image_medium_url
                      }')`,
                    }
                  : undefined
              }
            />
          </Thumbnail>
        )}
        <Info
          className={`card-overflow-x ${
            !renderThumbnail ? 'info--hiden-thumbnail' : ''
          }`}
        >
          <InfoText>{disponibilityText}</InfoText>
        </Info>
        {project.organization && (
          <Block className="py-2 px-3">
            <Link
              href={{
                pathname: resolvePage('/organization'),
                query: { slug: project.organization.slug },
              }}
              as={`/ong/${project.organization.slug}`}
            >
              <a className="media tc-base text-truncate">
                <OrganizationAvatar
                  className="bg-cover mb-0 mr-2"
                  style={{
                    backgroundImage: project.organization.image
                      ? `url(${project.organization.image.image_medium_url ||
                          project.organization.image.image_url})`
                      : undefined,
                  }}
                />
                <div className="media-body tl-heading">
                  <span className="tc-muted d-block ts-small mb-1">
                    Realizado pela ONG:
                  </span>
                  <span className="text-truncate tw-medium text-truncate d-block">
                    {project.organization.name}
                  </span>
                </div>
              </a>
            </Link>
          </Block>
        )}
        {project.address && (
          <>
            <Block className="py-2 px-3">
              <div className="media">
                <Icon name="place" className="tc-primary ts-medium mr-2" />
                <div className="media-body">
                  {project.address.typed_address}
                </div>
              </div>
            </Block>
          </>
        )}
        {!(project.closed || project.canceled) && (
          <div className="p-3 pos-relative">
            {!project.current_user_is_applied && (
              <>
                {project.roles && project.roles.length > 0 && (
                  <>
                    <h4 className="tw-normal ts-normal">Inscreva-se como:</h4>
                    <select
                      className="input input--size-3 mb-3"
                      value={selectedRoleIndex}
                      onChange={this.handleRoleSelectChange}
                    >
                      {project.roles.length > 1 && (
                        <option value="">Selecione uma função</option>
                      )}
                      {project.roles.map((role, index) => (
                        <option key={role.id} value={index}>
                          {role.name}
                        </option>
                      ))}
                    </select>
                  </>
                )}
                {project.roles[selectedRoleIndex] &&
                  project.roles[selectedRoleIndex].details && (
                    <>
                      <h5 className="ts-small mb-1">Função:</h5>
                      <p className="ts-small tc-muted-dark">
                        {project.roles[selectedRoleIndex].details}
                      </p>
                    </>
                  )}
              </>
            )}

            <button
              className={`btn btn--size-3 btn--block ${
                project.current_user_is_applied ? 'btn-error' : 'btn-apply'
              }`}
              onClick={this.submit}
            >
              {!project.current_user_is_applied ? (
                'Inscrever-se'
              ) : (
                <>
                  Desinscrever-se
                  <Icon name="clear" className="ml-2" />
                </>
              )}
            </button>
            <span className="tc-muted ta-center mt-2 d-block ts-small">
              Há uma segunda etapa de inscrição
            </span>
          </div>
        )}
        {(project.closed || project.canceled) && (
          <div className="p-3">
            <h3 className="tw-normal">{project.applied_count}</h3>
            <small className="tc-muted">Voluntários inscritos</small>
          </div>
        )}
      </div>
    )
  }
}

export default withIntl(ProjectApplicationCard)
