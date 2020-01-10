import React, { useCallback, useMemo, useState, useEffect } from 'react'
import { connect } from 'react-redux'
import useFetchAPI from '~/hooks/use-fetch-api'
import { fetchAPI } from '~/lib/fetch/fetch.client'
import { download } from '~/lib/utils/dom'
import {
  Project,
  ProjectApplication,
  ProjectApplicationStatus,
} from '~/redux/ducks/project'
import { User } from '~/redux/ducks/user'
import { RootState } from '~/redux/root-reducer'
import Icon from '../Icon'
import { useToasts } from '~/components/Toasts'
import { FormattedMessage } from 'react-intl'
import { API } from '~/types/api'
import ProjectApplicationTableRow from './ProjectApplicationTableRow'
import { useModal } from '../Modal'
import RemoveApplicationForm from '../RemoveApplicationForm'
import useFetchAPIMutation from '~/hooks/use-fetch-api-mutation'

interface ProjectManagePageApplicationsReduxProps {
  readonly viewer: User
}

interface ProjectManagePageApplicationsProps
  extends ProjectManagePageApplicationsReduxProps {
  readonly className?: string
  readonly project: Project
}

const ProjectManagePageApplications: React.FC<ProjectManagePageApplicationsProps> = ({
  className,
  viewer,
  project,
}) => {
  const toasts = useToasts()
  const query = useFetchAPI<ProjectApplication[]>(
    `/projects/${project.slug}/applies/`,
  )
  const [applications, setApplications] = useState(query.data || [])
  useEffect(() => {
    if (applications !== query.data) {
      setApplications(query.data || [])
    }
  }, [query])
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
  const roles = useMemo(() => {
    const arr: API.ProjectRole[] = []
    project.roles.forEach(role => {
      if (arr.some(r => r.id === role.id)) {
        return
      }

      arr.push(role)
    })

    return arr
  }, [project])
  const [selectedRoleId] = useState<number | undefined>(
    roles && roles.length ? roles[0].id : undefined,
  )
  const [
    confirmedApplications,
    appliedApplications,
    closedApplications,
  ] = useMemo<
    [ProjectApplication[], ProjectApplication[], ProjectApplication[]]
  >(() => {
    const mapByStatus: {
      [k in ProjectApplicationStatus]: ProjectApplication[]
    } = {
      'confirmed-volunteer': [],
      'not-volunteer': [],
      'unapplied-by-deactivation': [],
      applied: [],
      unapplied: [],
    }
    applications.forEach(a => {
      if (
        selectedRoleId !== undefined &&
        (!a.role || a.role.id !== selectedRoleId)
      ) {
        return
      }

      if (!mapByStatus[a.status]) {
        mapByStatus[a.status] = []
      }

      mapByStatus[a.status].push(a)
    })

    return [
      mapByStatus['confirmed-volunteer'],
      mapByStatus.applied,
      mapByStatus.unapplied.concat(
        mapByStatus['not-volunteer'],
        mapByStatus['unapplied-by-deactivation'],
      ),
    ]
  }, [applications, selectedRoleId])
  const handleApplicationConfirm = (application: API.ProjectApplication) => {
    setApplications(
      applications.map(a => {
        if (a.id === application.id) {
          return {
            ...a,
            status: 'confirmed-volunteer',
          }
        }
        return a
      }),
    )
    toasts.add(
      application.user
        ? `${application.user.name} foi confirmado`
        : 'Inscrição confirmada',
      'success',
    )
  }
  const openRemoveApplicationModal = useModal({
    id: 's',
    cardWrapperClassName: 'max-w-md mx-auto',
    cardClassName: 'p-8',
    component: RemoveApplicationForm,
    onClosePropName: 'onCancel',
  })

  const updateApplicationStatusMutation = useFetchAPIMutation(
    ({ application, status }) => ({
      endpoint: `/projects/${project.slug}/applies/${application.id}`,
      method: 'POST',
      body: {
        status,
      },
      meta: {
        applicationId: application.id,
      },
    }),
  )
  const handleApplicationRemove = (application: API.ProjectApplication) => {
    openRemoveApplicationModal({
      application,
      onRemove: () =>
        updateApplicationStatusMutation.mutate({
          application,
          status: 'unapplied-by-deactivation',
        }),
    })
  }

  return (
    <div
      id="voluntarios"
      className={`rounded-lg bg-white shadow mb-6 ${
        className ? ` ${className}` : ''
      }`}
    >
      <div className="md:flex">
        <div className="p-4 flex-grow">
          <h4 className="font-normal mb-0">Voluntários</h4>
        </div>

        <div className="pt-0 p-3 md:pt-3">
          <button
            type="button"
            onClick={handleExport}
            className="btn bg-gray-200 hover:bg-gray-300 mr-3"
          >
            <Icon name="filter_list" className="mr-2" />
            <FormattedMessage
              id="projectManagePageApplications.filter"
              defaultMessage="Filtrar"
            />
          </button>
          <button
            type="button"
            onClick={handleExport}
            className="btn bg-gray-200 hover:bg-gray-300"
          >
            <Icon name="filter" className="mr-2" />
            <FormattedMessage
              id="projectManagePageApplications.exportApplies"
              defaultMessage="Exportar planilha"
            />
          </button>
        </div>
      </div>
      {confirmedApplications.length > 0 && (
        <div className="border-t border-b">
          <div className="border-b shadow-sm relative z-10 px-4 py-2 font-medium">
            <span className="w-3 h-3 rounded-full z-20 inline-block  bg-green-500 mr-3" />
            <FormattedMessage
              id="page.projectManagePageApplications.confirmed"
              defaultMessage="Confirmados"
            />
          </div>
          {confirmedApplications.length > 0 && (
            <div className="overflow-x-auto border-b">
              <table className="w-full">
                <tbody>
                  {confirmedApplications.map((application, i) => (
                    <ProjectApplicationTableRow
                      key={application.id}
                      application={application}
                      className={i % 2 === 0 ? 'bg-gray-100' : ''}
                      readOnly
                      onRemove={handleApplicationRemove}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
      {appliedApplications.length > 0 && (
        <div className="border-t border-b">
          <div className="border-b shadow-sm relative z-10 px-4 py-2 font-medium">
            <span className="w-3 h-3 rounded-full z-20 inline-block  bg-yellow-500 mr-3" />
            <FormattedMessage
              id="page.projectManagePageApplications.applied"
              defaultMessage="Inscritos"
            />
          </div>
          {appliedApplications.length > 0 && (
            <div className="overflow-x-auto border-b">
              <table className="w-full">
                <tbody>
                  {appliedApplications.map((application, i) => (
                    <ProjectApplicationTableRow
                      key={application.id}
                      application={application}
                      className={i % 2 === 0 ? 'bg-gray-100' : ''}
                      readOnly={project.closed}
                      onConfirm={handleApplicationConfirm}
                      onRemove={handleApplicationRemove}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
      {closedApplications.length > 0 && (
        <div className="border-t border-b">
          <div className="border-b shadow-sm relative z-10 px-4 py-2 font-medium">
            <span className="w-3 h-3 rounded-full z-20 inline-block  bg-red-500 mr-3" />
            <FormattedMessage
              id="page.projectManagePageApplications.dropouts"
              defaultMessage="Desistentes"
            />
          </div>
          {closedApplications.length > 0 && (
            <div className="overflow-x-auto border-b">
              <table className="w-full">
                <tbody>
                  {closedApplications.map((application, i) => (
                    <ProjectApplicationTableRow
                      key={application.id}
                      application={application}
                      className={i % 2 === 0 ? 'bg-gray-100' : ''}
                      readOnly
                      removing={
                        updateApplicationStatusMutation.action?.meta
                          .applicationId === application.id
                      }
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
      <div className="px-5 py-4">
        <span className="text-gray-700">
          <Icon name="info" className="mr-2" />{' '}
          <FormattedMessage
            id="projectManagePageApplications.hint"
            defaultMessage="É muito importante que você faça contato com os voluntários"
          />
        </span>
      </div>
    </div>
  )
}

ProjectManagePageApplications.displayName = 'ProjectManagePageApplications'

const mapStateToProps = (
  state: RootState,
): ProjectManagePageApplicationsReduxProps => ({ viewer: state.user! })

export default React.memo(
  connect(mapStateToProps)(ProjectManagePageApplications),
)
