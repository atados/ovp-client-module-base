import Link from 'next/link'
import React, { useCallback } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { APP_SHARE_URL, channel } from '~/common/constants'
import { resolvePage } from '~/common/page'
import useFetchAPI from '~/hooks/use-fetch-api'
import { fetchAPI } from '~/lib/fetch/fetch.client'
import { download } from '~/lib/utils/dom'
import { Project, ProjectApplication } from '~/redux/ducks/project'
import { User } from '~/redux/ducks/user'
import { RootState } from '~/redux/root-reducer'
import Icon from '../Icon'
import VolunteerIcon from '../Icon/VolunteerIcon'
import { useModal } from '../Modal'
import Popover from '../Popover/Popover'
import { ShareList } from '../Share'

const Avatar = styled.span`
  width: 24px;
  height: 24px;
  border-radius: 50%;
`

const CardButtonPopover = styled(Popover)`
  .dropdown-menu {
    width: 400px;
  }

  > .btn {
    width: 100%;
    display: block;
  }

  @media (min-width: 768px) {
    position: absolute;
    right: 20px;
    top: 20px;

    > .btn {
      width: auto;
    }
  }
`

const TableWrapper = styled.div`
  overflow-x: auto;
  width: 100%;

  &::-webkit-scrollbar {
    display: none;
  }
`

const Table = styled.table`
  min-width: 900px;

  tr td,
  tr th {
    &:first-child {
      padding-left: 20px;
    }

    &:last-child {
      padding-right: 20px;
    }
  }

  th {
    font-size: 14px;
  }

  td {
    font-size: 16px;
    padding-top: 16px;
    padding-bottom: 16px;
  }
`
interface ProjectManagePageVolunteersReduxProps {
  readonly viewer: User
}

interface ProjectManagePageVolunteersProps
  extends ProjectManagePageVolunteersReduxProps {
  readonly className?: string
  readonly project: Project
}

const ProjectManagePageVolunteers: React.FC<
  ProjectManagePageVolunteersProps
> = ({ className, viewer, project }) => {
  const query = useFetchAPI<ProjectApplication[]>(
    `/projects/${project.slug}/applies/`,
  )
  const applications = query.error ? [] : query.data || []
  const openShareModal = useModal({
    id: 'Share',
    component: ShareList,
    componentProps: {
      subtitle: project.name,
      url: `${APP_SHARE_URL}/vaga/${project.slug}`,
      meta: {
        title: project.name,
        description: project.description,
      },
    },
    cardClassName: 'p-5',
  })
  const handleExport = useCallback(async () => {
    const resp = await fetchAPI(
      `/projects/${project.slug}/export_applied_users/`,
      {
        asJSON: false,
        sessionToken: viewer.token,
      },
    )

    const blob = await resp.blob()
    const reader = new FileReader()
    reader.onload = () =>
      download(
        'voluntarios.xls',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        String(reader.result),
        true,
      )
    reader.readAsDataURL(blob)
  }, [viewer, project])
  const linkApplicationUser = useCallback(
    (application: ProjectApplication, children: React.ReactNode) => {
      if (!application.user) {
        return children
      }

      return (
        <Link
          href={{
            pathname: resolvePage('/public-user'),
            query: { slug: application.user.slug },
          }}
          as={`/voluntario/${application.user.slug}`}
        >
          <a className="tc-base">{children}</a>
        </Link>
      )
    },
    [],
  )

  return (
    <div
      id="voluntarios"
      className={`radius-10 bg-white shadow mb-4 ${
        className ? ` ${className}` : ''
      }`}
    >
      <div className="p-4 pos-relative">
        <h4 className="tw-normal mb-1">Voluntários incritos</h4>
        <span className="d-block tc-muted-dark mb-0">
          {project.applied_count} inscritos
        </span>

        <CardButtonPopover
          id="export-applies"
          body={
            <>
              <h4 className="tc-white ts-normal tw-normal mb-1">Dica!</h4>
              <p className="ts-small tc-light mb-2">
                Você sabia que pode extrair uma planilha com todos os contatos
                dos inscritos? Isso foi feito para você manter sempre um contato
                próximo com seus voluntários.
              </p>
            </>
          }
          disableButtons
        >
          <button
            type="button"
            onClick={handleExport}
            className="float-right btn btn-outline-primary tc-primary mt-3 mb-3 mt-md-0 mb-md-0"
          >
            <Icon name="get_app" className="mr-2" />
            Exportar planilha de voluntários
          </button>
        </CardButtonPopover>
      </div>
      {applications.length > 0 && (
        <TableWrapper>
          <Table className="table card-item borderless">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>Telefone</th>
                <th>Cargo</th>
                <th>Status</th>
                <th>Avaliação</th>
              </tr>
            </thead>
            <tbody>
              {applications.map(application => (
                <tr key={application.id}>
                  <td>
                    {linkApplicationUser(
                      application,
                      <>
                        <Avatar
                          className="avatar mr-2"
                          style={
                            application.user && application.user.avatar
                              ? {
                                  backgroundImage: `url('${application.user
                                    .avatar.image_small_url ||
                                    application.user.avatar.image_url}')`,
                                }
                              : undefined
                          }
                        />
                        <span
                          className={
                            application.canceled
                              ? 'tc-muted td-line-through'
                              : ''
                          }
                        >
                          {application.user ? application.user.name : ''}
                        </span>
                      </>,
                    )}
                  </td>
                  <td>
                    {application.user && (
                      <a
                        href={`mailto:${application.user.email}`}
                        className="tc-base"
                      >
                        {application.user.email}
                      </a>
                    )}
                  </td>
                  <td>
                    {(application.user ? application.user.phone : '') ||
                      application.phone}
                  </td>
                  <td>{application.role ? application.role.name : '-'}</td>
                  <td>
                    {application.canceled ? (
                      <span className="tc-error tw-medium">Desistiu</span>
                    ) : (
                      <span className="tw-medium tc-primary">Inscrito</span>
                    )}
                  </td>
                  <td>
                    <span className="badge bg-primary">
                      <Icon name={channel.theme.iconRating} className="mr-1" />
                      {application.user &&
                        String((application.user.rating || 0) * 5).substr(0, 3)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableWrapper>
      )}
      {applications.length === 0 && (
        <div className="py-4 ta-center">
          <VolunteerIcon fill="#999" width={64} height={64} className="mb-3" />
          <span className="h4 d-block tw-normal mb-2">
            Essa vaga ainda não possui nenhum inscrito
          </span>
          <span className="tc-muted d-block mb-3">
            {project.published && !project.closed
              ? 'Que tal compartilhar ela nas redes sociais?'
              : project.closed
              ? 'Infelizmente essa vaga não chegou a ter inscritos'
              : 'Assim que ela for publicada você poderá obter inscritos'}
          </span>
          {!project.closed && (
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={() => openShareModal()}
            >
              Compartilhar vaga
              <Icon name="share" className="ml-2" />
            </button>
          )}
        </div>
      )}
      {applications.length > 0 && (
        <div className="px-4 card-item py-3">
          <span className="tc-muted-dark">
            <Icon name="info" className="mr-2" /> É muito importante que você
            faça contato com os voluntários
          </span>
        </div>
      )}
    </div>
  )
}

ProjectManagePageVolunteers.displayName = 'ProjectManagePageVolunteers'

const mapStateToProps = (
  state: RootState,
): ProjectManagePageVolunteersReduxProps => ({ viewer: state.user! })

export default React.memo(connect(mapStateToProps)(ProjectManagePageVolunteers))
