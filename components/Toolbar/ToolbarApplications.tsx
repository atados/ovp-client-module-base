import Link from 'next/link'
import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import { channel } from '~/common/constants'
import { resolvePage } from '~/common/page'
import useFetchAPI from '~/hooks/use-fetch-api'
import { PublicUser } from '~/redux/ducks/public-user'
import { SearchType } from '~/redux/ducks/search'
import { User } from '~/redux/ducks/user'
import { DropdownMenu, DropdownToggler, DropdownWithContext } from '../Dropdown'
import Icon from '../Icon'
import VolunteerIcon from '../Icon/VolunteerIcon'
import { useModal } from '../Modal'
import ProjectApplicationFinish from '../ProjectApplication/ProjectApplicationFinish'
import ToolbarApplicationsItem from './ToolbarApplicationsItem'

const Menu: React.FC<{ className?: string }> = styled(DropdownMenu)`
  left: auto;
  width: 500px;
  min-height: 500px;
`

const Body = styled.div`
  top: 50px;
  overflow-y: auto;
`

const Header = styled.div`
  height: 50px;
  padding-top: 14px;
  padding-bottom: 14px;
`

interface ToolbarApplicationsState {
  readonly focused: boolean
  readonly selectedItemId?: number
}

interface ToolbarApplicationsProps {
  readonly className?: string
  readonly viewer: User
  readonly theme?: 'dark' | 'light'
}

const ToolbarApplications: React.FC<ToolbarApplicationsProps> = ({
  viewer,
  theme,
}) => {
  const openApplicationModal = useModal({
    id: 'Application',
    component: ProjectApplicationFinish,
    cardClassName: 'p-4',
  })
  const [state, setState] = useState<ToolbarApplicationsState>({
    focused: false,
  })
  const currentUserProfile = useFetchAPI<PublicUser>(
    `/public-users/${viewer.slug}/`,
  )
  const applications = currentUserProfile.data
    ? currentUserProfile.data.applies
    : []

  const handleOpenStateChange = useCallback(
    (isOpen: boolean) =>
      setState(prevState => ({ ...prevState, focused: isOpen })),
    [],
  )

  return (
    <DropdownWithContext onOpenStateChange={handleOpenStateChange}>
      <DropdownToggler>
        <button
          className={`rounded-circle w-40 h-40 no-border mr-2 btn-light ${
            state.focused
              ? theme === 'light'
                ? 'bg-primary'
                : 'bg-white text-white'
              : theme === 'light'
              ? 'bg-black-100'
              : 'bg-light'
          } btn`}
        >
          <VolunteerIcon
            width={15}
            height={20}
            fill={
              theme === 'light'
                ? state.focused
                  ? '#fff'
                  : '#333'
                : state.focused
                ? channel.theme.colorPrimary
                : '#fff'
            }
          />
        </button>
      </DropdownToggler>
      <Menu className="mt-1 bg-muted">
        <div className="">
          <Header className="px-2 shadow-sm pos-relative bg-white rounded-t-lg shadow">
            <h4 className="ts-medium mb-0">Minhas inscrições</h4>
          </Header>
          <Body className="absolute bottom-0 left-0 right-0">
            <div className="shadow-sm">
              {applications.length !== 0 && (
                <div className="pt-2 px-2 bg-white">
                  <span className="tc-muted ts-small tw-medium">
                    VAGAS ABERTAS
                  </span>
                </div>
              )}
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
                <h4>Nenhuma inscrição encontrada</h4>
                <span className="d-block mb-3 tc-muted-dark">
                  Ainda não encontrou nenhuma vaga pra você? <br /> Tente usar
                  os filtros
                </span>
                <Link
                  href={{
                    pathname: resolvePage('/explore'),
                    query: { searchType: SearchType.Projects },
                  }}
                  as="/vagas"
                >
                  <a className="btn btn-primary">
                    Ver vagas de voluntariado <Icon name="arrow_forward" />
                  </a>
                </Link>
              </div>
            )}
          </Body>
        </div>
      </Menu>
    </DropdownWithContext>
  )
}

ToolbarApplications.displayName = 'ToolbarApplications'

export default ToolbarApplications
