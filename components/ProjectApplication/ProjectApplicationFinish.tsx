import React, { useCallback } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import useIntl from '~/hooks/use-intl'
import useTriggerableFetchApi from '~/hooks/use-trigglerable-fetch-api'
import { formatDisponibility } from '~/lib/project/utils'
import {
  Project,
  ProjectApplication,
  updateProject,
} from '~/redux/ducks/project'
import { User } from '~/redux/ducks/user'
import { RootState } from '~/redux/root-reducer'
import GoogleMap from '../GoogleMap'
import Icon from '../Icon'
import MapMark from '../MapMark'

const Avatar = styled.span`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #eee;
  vertical-align: top;
  display: inline-block;
  border: 2px solid #fff;
  cursor: pointer;
  background-size: cover;
  background-position: center;
  position: relative;

  > .icon {
    color: rgba(0, 0, 0, 0.4);
    font-size: 24px;
    float: right;
    margin-right: -28px;
  }
`
const Map = styled(GoogleMap)`
  height: 300px;
  border-radius: 0 0 10px 10px;
`

interface ProjectApplicationFinishProps {
  readonly className?: string
  readonly project: Project
  readonly viewer: User
  readonly application: ProjectApplication
  readonly new?: boolean
  readonly onUpdateProject: (
    changes: Partial<Project> & { slug: string },
  ) => any
}

const ProjectApplicationFinish: React.FC<ProjectApplicationFinishProps> = ({
  viewer,
  project,
  application,
  new: isNew,
  onUpdateProject,
}) => {
  const intl = useIntl()
  const unapplyTrigger = useTriggerableFetchApi(
    `/projects/${project.slug}/applies/unapply/`,
    { method: 'POST' },
  )
  const handleUnapplication = useCallback(async () => {
    await unapplyTrigger.trigger()
    onUpdateProject({
      slug: project.slug,
      applies: project.applies.filter(apply => apply !== application),
    })
  }, [unapplyTrigger, application])

  return (
    <div>
      <div className="card no-border radius-10  p-4 mb-3 bg-success tc-white">
        <h4 className="tw-normal">
          {isNew ? 'Inscrição bem sucedida!' : 'Você está inscrito nessa ação'}
        </h4>
        <p className="tc-light mb-0">
          Fique atento as datas e contate a ONG para mais informações.
        </p>
      </div>

      <div className="card no-border radius-10  mb-3 ">
        <div className="p-4 card-item">
          <a
            href={`/voluntario/${viewer.slug}`}
            className="media td-hover-none"
          >
            <Avatar
              style={
                viewer.avatar
                  ? { backgroundImage: `url('${viewer.avatar.image_url}')` }
                  : { backgroundColor: viewer.profile.color }
              }
              className="mr-2"
            />
            <div className="media-body">
              <span className="tw-medium tc-base d-block text-truncate">
                {viewer.name}
              </span>
              <span className="tc-success">Voluntário inscrito</span>
            </div>
          </a>

          <hr />
          {application && application.role && (
            <>
              <h4 className="ts-large mb-1">{application.role.name}</h4>
              <span className="tc-muted ts-small tw-medium">FUNÇÃO</span>
              <p>{application.role.details}</p>
              <span className="tc-muted ts-small tw-medium">
                PRÉ-REQUISITOS
              </span>
              <p className="mb-0">{application.role.details}</p>
            </>
          )}
        </div>
      </div>
      <div className="card no-border radius-10  mb-3">
        <div className="p-4">
          {project.disponibility && (
            <>
              <h4 className="ts-large mb-2">Descrição dos horários</h4>
              <div className="tc-muted-dark">
                {project.disponibility.type === 'work' ? (
                  <>
                    <p className="mb-1 ts-medium">
                      <Icon name="event" className="mr-2" />
                      {project.disponibility.work.description}
                    </p>
                    <p className="mb-1 ts-medium">
                      <Icon name="access_time" className="mr-2" />
                      {project.disponibility.work.weekly_hours} Horas semanais
                    </p>
                    {project.disponibility.work.can_be_done_remotely && (
                      <p className="mb-1 ts-medium">
                        <Icon name="public" className="mr-2" />
                        Você pode atuar à distância
                      </p>
                    )}
                  </>
                ) : (
                  formatDisponibility(project.disponibility, intl)
                )}
              </div>
            </>
          )}
          {project.address && (
            <>
              <h4 className="ts-large mb-1 mt-4">Endereço</h4>
              <p className="mb-0 tc-muted-dark">
                {project.address.typed_address}
                {project.address.typed_address2 && (
                  <>
                    {' '}
                    <b>Complemento:</b> {project.address.typed_address2}
                  </>
                )}
              </p>
            </>
          )}
        </div>
        {project.address && (
          <Map
            defaultCenter={{
              lat: project.address.lat,
              lng: project.address.lng,
            }}
          >
            <MapMark lat={project.address.lat} lng={project.address.lng} />
          </Map>
        )}
      </div>
      <div className="card no-border radius-10  shadow bg-error-light p-4">
        <h4 className="tw-normal">Cancelar minha inscrição</h4>
        <span className="tc-muted-dark mb-0 d-block mb-3">
          Ao cancelar sua inscrição você não fará mais parte dessa vaga. Não se
          preocupe, você pode se inscrever novamente.
        </span>
        <button
          type="button"
          className="btn btn-error"
          onClick={handleUnapplication}
          disabled={unapplyTrigger.loading}
        >
          <Icon name="close" /> Cancelar minha inscrição nessa vaga
        </button>
      </div>
    </div>
  )
}

ProjectApplicationFinish.displayName = 'ProjectApplicationFinish'

export default connect(
  (state: RootState) => ({ viewer: state.user }),
  { onUpdateProject: updateProject },
)(ProjectApplicationFinish)
