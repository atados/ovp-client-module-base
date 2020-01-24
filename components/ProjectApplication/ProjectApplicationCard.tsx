import moment from 'moment'
import Link from 'next/link'
import React from 'react'
import { defineMessages, WithIntlProps } from 'react-intl'
import styled from 'styled-components'
import Icon from '~/components/Icon'
import { withIntl } from '~/lib/intl'
import { findNearestDate, formatDisponibility } from '~/lib/project/utils'
import { Project } from '~/redux/ducks/project'
import { Page, PageAs, Color } from '~/common'

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
  background: ${Color.primary[500]};
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

interface ProjectApplicationCardProps extends WithIntlProps<any> {
  readonly className?: string
  readonly project: Project
  readonly renderThumbnail?: boolean
  readonly onApply: (roleId: number) => void
  readonly onUnapply: () => void
}

interface ProjectApplicationCardState {
  selectedRoleIndex: string
}

const {
  REALIZADO,
  INSCREVASE,
  SELECIONE,
  FUNCAO,
  DESINSCREVER,
  SEGUNDA_ETAPA,
  VOLUNTARIOS_INSCRITOS,
} = defineMessages({
  REALIZADO: {
    id: 'REALIZADO',
    defaultMessage: 'Realizado pela ONG:',
  },
  INSCREVASE: {
    id: 'INSCREVASE',
    defaultMessage: 'Inscreva-se como:',
  },
  SELECIONE: {
    id: 'SELECIONE',
    defaultMessage: 'Selecione uma função',
  },
  FUNCAO: {
    id: 'FUNCAO',
    defaultMessage: 'Função:',
  },
  DESINSCREVER: {
    id: 'DESINSCREVER',
    defaultMessage: 'Desinscrever-se',
  },
  SEGUNDA_ETAPA: {
    id: 'SEGUNDA_ETAPA',
    defaultMessage: 'Há uma segunda etapa de inscrição',
  },
  VOLUNTARIOS_INSCRITOS: {
    id: 'VOLUNTARIOS_INSCRITOS',
    defaultMessage: 'Voluntários inscritos',
  },
})

class ProjectApplicationCard extends React.Component<
  ProjectApplicationCardProps & WithIntlProps<any>,
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
      <div
        className={`rounded-lg bg-muted ${className ? ` ${className}` : ''}`}
      >
        {renderThumbnail && (
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
        )}
        <Info
          className={`card-overflow-x ${
            !renderThumbnail ? 'info--hiden-thumbnail' : ''
          }`}
        >
          <InfoText>{disponibilityText}</InfoText>
        </Info>
        {project.organization && (
          <Block className="py-3 px-4">
            <Link
              href={Page.Organization}
              as={PageAs.Organization({
                organizationSlug: project.organization.slug,
              })}
            >
              <a className="media text-base truncate">
                <OrganizationAvatar
                  className="bg-cover bg-center mb-0 mr-2"
                  style={{
                    backgroundImage: project.organization.image
                      ? `url(${project.organization.image.image_medium_url ||
                          project.organization.image.image_url})`
                      : undefined,
                  }}
                />
                <div className="media-body tl-heading">
                  <span className="text-gray-600 d-block text-sm mb-1">
                    {intl.formatMessage(REALIZADO)}
                  </span>
                  <span className="truncate font-medium truncate block">
                    {project.organization.name}
                  </span>
                </div>
              </a>
            </Link>
          </Block>
        )}
        {project.address && (
          <>
            <Block className="py-3 px-4">
              <div className="media">
                <Icon name="place" className="text-primary-500 text-lg mr-2" />
                <div className="media-body">
                  {project.address.typed_address}
                </div>
              </div>
            </Block>
          </>
        )}
        {!(project.closed || project.canceled) && (
          <div className="p-3 relative">
            {!project.current_user_is_applied && (
              <>
                {project.roles && project.roles.length > 0 && (
                  <>
                    <h4 className="font-normal text-base">
                      {intl.formatMessage(INSCREVASE)}
                    </h4>
                    <select
                      className="input input--size-3 mb-4"
                      value={selectedRoleIndex}
                      onChange={this.handleRoleSelectChange}
                    >
                      {project.roles.length > 1 && (
                        <option value="">
                          {intl.formatMessage(SELECIONE)}
                        </option>
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
                      <h5 className="text-sm mb-1">
                        {intl.formatMessage(FUNCAO)}
                      </h5>
                      <p className="text-sm text-gray-700">
                        {project.roles[selectedRoleIndex].details}
                      </p>
                    </>
                  )}
              </>
            )}

            <button
              className={`btn btn--size-3 btn--block ${
                project.current_user_is_applied
                  ? 'btn-error'
                  : 'text-white bg-primary-500 hover:bg-primary-600'
              }`}
              onClick={this.submit}
            >
              {!project.current_user_is_applied ? (
                'Inscrever-se'
              ) : (
                <>
                  {intl.formatMessage(DESINSCREVER)}
                  <Icon name="clear" className="ml-2" />
                </>
              )}
            </button>
            <span className="text-gray-600 text-center mt-2 d-block text-sm">
              {intl.formatMessage(SEGUNDA_ETAPA)}
            </span>
          </div>
        )}
        {(project.closed || project.canceled) && (
          <div className="p-3">
            <h3 className="font-normal">{project.applied_count}</h3>
            <small className="text-gray-600">
              {intl.formatMessage(VOLUNTARIOS_INSCRITOS)}
            </small>
          </div>
        )}
      </div>
    )
  }
}

export default withIntl(ProjectApplicationCard)
