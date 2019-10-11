import React, { useState } from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import ToolbarApplicationsItem from './Toolbar/ToolbarApplicationsItem'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/root-reducer'
import { useModal } from './Modal'
import ProjectApplicationFinish from './ProjectApplication/ProjectApplicationFinish'
import useFetchAPI from '../hooks/use-fetch-api'
import { PublicUser } from '../redux/ducks/public-user'
import PageLink from './PageLink'
import Icon from './Icon'

const Body = styled.div`
  top: 50px;
  overflow-y: auto;
`

const Header = styled.div`
  height: 50px;
  padding-top: 14px;
  padding-bottom: 14px;
`

interface ViewerApplicationsProps {
  readonly className?: string
  readonly scroll?: boolean
}

interface ViewerApplicationsState {
  readonly focused: boolean
  readonly selectedItemId?: number
}

const ViewerApplications: React.FC<ViewerApplicationsProps> = ({
  className,
  scroll = true,
}) => {
  const viewer = useSelector((reduxState: RootState) => reduxState.user)
  const openApplicationModal = useModal({
    id: 'Application',
    component: ProjectApplicationFinish,
    cardClassName: 'p-4',
  })
  const [state, setState] = useState<ViewerApplicationsState>({
    focused: false,
  })
  const currentUserProfile = useFetchAPI<PublicUser>(
    `/public-users/${viewer!.slug}/`,
  )
  const applications = currentUserProfile.data
    ? currentUserProfile.data.applies
    : []

  return (
    <div className={className}>
      <Header className="px-2 shadow-sm relative bg-white rounded-t-lg shadow">
        <h4 className="ts-medium mb-0">
          <FormattedMessage
            id="toolbarApplications.title"
            defaultMessage="Minhas inscrições"
          />
        </h4>
      </Header>
      <Body className={scroll ? 'absolute bottom-0 left-0 right-0' : ''}>
        <div className="shadow-sm">
          {applications.map(application => (
            <ToolbarApplicationsItem
              key={application.id}
              application={application}
              active={application.id === state.selectedItemId}
              className={
                application.id === state.selectedItemId
                  ? 'bg-white my-2 transition'
                  : 'bg-white'
              }
              onClick={event => {
                event.preventDefault()
                if (state.selectedItemId === application.id) {
                  setState({ ...state, selectedItemId: undefined })
                  return
                }
                setState({ ...state, selectedItemId: application.id })
              }}
              onOpenApplication={() => {
                openApplicationModal({
                  project: application.project,
                  application,
                })
              }}
            />
          ))}
        </div>
        {applications.length === 0 && (
          <div className="p-5 ta-center">
            <h4>
              <FormattedMessage
                id="toolbarApplications.noApplicationsFound.title"
                defaultMessage="Nenhuma inscrição encontrada"
              />
            </h4>
            <span className="block mb-3 tc-muted-dark">
              <FormattedMessage
                id="toolbarApplications.noApplicationsFound.text"
                defaultMessage="Ainda não encontrou nenhuma vaga pra você? Tente usar os filtros"
              />
            </span>
            <PageLink href="SearchProjects">
              <a className="btn btn-primary">
                <FormattedMessage
                  id="toolbarApplications.noApplicationsFound.button"
                  defaultMessage="Ver vagas de voluntariado"
                />{' '}
                <Icon name="arrow_forward" />
              </a>
            </PageLink>
          </div>
        )}
      </Body>
    </div>
  )
}

ViewerApplications.displayName = 'ViewerApplications'

export default ViewerApplications
