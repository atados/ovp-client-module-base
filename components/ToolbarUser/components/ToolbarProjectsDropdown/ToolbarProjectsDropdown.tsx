import Link from 'next/link'
import * as React from 'react'
import { InjectedIntlProps } from 'react-intl'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { resolvePage } from '~/common/page'
import VolunteerIcon from '~/components/Icon/VolunteerIcon'
import ToolbarDropdown from '~/components/ToolbarUser/components/ToolbarDropdown'
import { withIntl } from '~/lib/intl'
import { fetchCurrentUserProfile } from '~/redux/ducks/current-user-profile'
import { Project } from '~/redux/ducks/project'
import { BookmarksList, PublicUserApplication } from '~/redux/ducks/public-user'
import { fetchRatings, Rating } from '~/redux/ducks/ratings'
import { fetchUnratedProjects } from '~/redux/ducks/unrated-projects'
import { User } from '~/redux/ducks/user'
import { RootState } from '~/redux/root-reducer'
import ToolbarProjectItem from './ToolbarProjectItem'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`

const Header = styled.div`
  box-shadow: 0 1px rgba(0, 0, 0, 0.15);
  z-index: 2;
  min-height: 36px;
  max-height: 36px;
`

const Tab = styled.button`
  position: relative;
  background: none;
  padding: 8px 12px;
  cursor: pointer;
  border: 0;
  font-size: 14px;
  color: #666;

  &:hover,
  &.active {
    color: #222;
  }

  &:focus {
    outline: none;
  }

  &.active {
    font-weight: 500;
    box-shadow: 0 2px ${props => props.theme.colorSecondary};
  }
`

const Body = styled.div`
  overflow-y: scroll;
  flex: 1 1 auto;
`

const SectionHeader = styled.h5`
  background: #eaf0f5;
  padding: 8px 12px;
  color: #556d82;
  font-size: 12px;
  margin: 0;
`

const CountIndicator = styled.span`
  position: absolute;
  top: 2px;
  right: 0;
  background: #ff4d4d;
  border-radius: 10px;
  color: #fff;
  font-size: 11px;
  padding: 3px 5px;
  line-height: 1;
  font-weight: 500;
  pointer-events: none;
`

interface ToolbarProjectsDropdownProps {
  readonly user: User | null
  readonly fetching: boolean
  readonly className?: string
  readonly button: React.ReactElement<any>
  readonly unratedProjects: Project[]
  readonly onFetchUnratedProjects: () => void
  readonly onFetchApplications: () => void
  readonly onFetchRatings: () => void
  readonly applies: PublicUserApplication[]
  readonly bookmarks: BookmarksList
}

interface ToolbarProjectsDropdownProps {
  readonly className?: string
}

enum TabKey {
  Applications,
  Bookmarks,
  Ratings,
}
interface ToolbarProjectsDropdownState {
  currentTab: TabKey
}

class ToolbarProjectsDropdown extends React.Component<
  ToolbarProjectsDropdownProps & InjectedIntlProps,
  ToolbarProjectsDropdownState
> {
  public static getDerivedStateFromProps(
    _,
    state?: ToolbarProjectsDropdownState,
  ): ToolbarProjectsDropdownState {
    return {
      currentTab: state ? state.currentTab : TabKey.Applications,
    }
  }

  constructor(props) {
    super(props)

    this.state = ToolbarProjectsDropdown.getDerivedStateFromProps(props)
  }

  public setCurrentTab = (tabKey: TabKey) => {
    if (tabKey === TabKey.Ratings) {
      this.props.onFetchUnratedProjects()
    }

    this.setState({ currentTab: tabKey })
  }

  public handleOpen = () => {
    const { onFetchApplications, onFetchRatings } = this.props

    onFetchApplications()
    onFetchRatings()
  }

  public render() {
    const {
      bookmarks,
      user,
      className,
      fetching,
      applies,
      intl,
      unratedProjects,
    } = this.props
    const { currentTab } = this.state
    let body

    if (!user) {
      return null
    }

    if (currentTab === TabKey.Applications) {
      const openApplications: PublicUserApplication[] = []
      const closedApplications: PublicUserApplication[] = []
      const canceledApplications: PublicUserApplication[] = []

      applies.forEach(application => {
        if (application.canceled) {
          canceledApplications.push(application)
          return
        }

        if (application.project.closed || application.project.canceled) {
          closedApplications.push(application)
        } else {
          openApplications.push(application)
        }
      })

      if (
        !fetching &&
        openApplications.length === 0 &&
        closedApplications.length === 0
      ) {
        body = (
          <div className="px-2 py-4 ta-center">
            <h4 className="tw-medium ts-medium mb-1">
              Você não está inscrito em nenhum vaga :(
            </h4>
            <p className="tc-muted-dark">
              Encontre agora uma vaga que se encaixe com você.
            </p>
            <Link href={{ pathname: resolvePage('/explore') }} as="/explorar">
              <a className="btn btn-primary">Explorar vagas</a>
            </Link>
          </div>
        )
      } else {
        body = (
          <>
            {openApplications.length > 0 && (
              <>
                <SectionHeader>INSCRIÇÕES ABERTAS</SectionHeader>
                <div className="px-2 pt-2">
                  {openApplications.map(application => (
                    <ToolbarProjectItem
                      className="mb-3"
                      key={application.id}
                      intl={intl}
                      application={application}
                    />
                  ))}
                </div>
              </>
            )}

            {closedApplications.length > 0 && (
              <>
                <SectionHeader>INSCRIÇÕES FECHADAS</SectionHeader>
                <div className="px-2 pt-2">
                  {closedApplications.map(application => (
                    <ToolbarProjectItem
                      className="mb-3"
                      key={application.id}
                      intl={intl}
                      application={application}
                    />
                  ))}
                </div>
              </>
            )}

            {canceledApplications.length > 0 && (
              <>
                <SectionHeader>INSCRIÇÕES CANCELADAS</SectionHeader>
                <div className="px-2 pt-2">
                  {canceledApplications.map(application => (
                    <ToolbarProjectItem
                      className="mb-3"
                      key={application.id}
                      intl={intl}
                      application={application}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        )
      }
    }

    if (currentTab === TabKey.Bookmarks) {
      body = (
        <>
          <SectionHeader>VAGAS FAVORITADAS</SectionHeader>
          <div className="px-2 pt-2">
            {bookmarks.map(bookmark => (
              <ToolbarProjectItem
                className="mb-3"
                key={bookmark.project.slug}
                intl={intl}
                project={bookmark.project}
              />
            ))}
          </div>
        </>
      )
    }

    if (currentTab === TabKey.Ratings) {
      body = (
        <>
          <SectionHeader>AVALIE OS VOLUNTÁRIOS</SectionHeader>
          <div className="px-2 pt-2">
            {unratedProjects.map(project => (
              <ToolbarProjectItem
                className="mb-3"
                key={project.slug}
                intl={intl}
                project={project}
                asVolunteersRatingLink
              />
            ))}
          </div>
        </>
      )
    }

    const pendingCount =
      user.rating_requests_project_count +
      user.rating_requests_projects_with_unrated_users
    return (
      <ToolbarDropdown
        menuWidth="400px"
        menuHeight="500px"
        onOpen={this.handleOpen}
        className={className}
        title="Inscrições"
        icon={<VolunteerIcon width={24} height={24} />}
        pendingCount={pendingCount}
        popover={
          pendingCount && (
            <>
              <h4 className="tc-white ts-normal tw-normal mb-1">
                Avalie as vagas que você se inscreveu
              </h4>
              <p className="ts-small tc-light mb-2">
                Conte-nos como foi sua experiência com as vagas que se inscreveu
                ou indique se não conseguiu ir. Isso nos ajuda a criar uma
                melhor experiência pros voluntários e ONGs.
              </p>
            </>
          )
        }
        popoverId="volunteer-rating"
        // 3 Months
        popoverExpiration={7776000000}
      >
        <Container>
          <Header className="nav">
            <Tab
              onClick={() => this.setCurrentTab(TabKey.Applications)}
              className={currentTab === TabKey.Applications ? 'active' : ''}
            >
              {user.rating_requests_project_count > 0 && (
                <CountIndicator>
                  {user.rating_requests_project_count}
                </CountIndicator>
              )}
              Inscrições
            </Tab>
            <Tab
              onClick={() => this.setCurrentTab(TabKey.Bookmarks)}
              className={currentTab === TabKey.Bookmarks ? 'active' : ''}
            >
              Favoritos
            </Tab>
            {user.rating_requests_projects_with_unrated_users > 0 && (
              <Tab
                onClick={() => this.setCurrentTab(TabKey.Ratings)}
                className={currentTab === TabKey.Ratings ? 'active' : ''}
              >
                <CountIndicator>
                  {user.rating_requests_projects_with_unrated_users}
                </CountIndicator>
                Avaliações pendentes
              </Tab>
            )}
          </Header>
          <Body>
            {body}
            {fetching ? (
              <div className="ta-center py-3">Carregando...</div>
            ) : (
              ''
            )}
          </Body>
        </Container>
      </ToolbarDropdown>
    )
  }
}

const mapStateToProps = ({
  user,
  currentUserProfile,
  ratings: { nodes: ratings },
  unratedProjects,
}: RootState): Partial<ToolbarProjectsDropdownProps> => {
  const ratingsBySlug: { [slug: string]: Rating } = {}

  ratings.forEach(rating => {
    if (rating.object_type === 'project') {
      ratingsBySlug[rating.rated_object.slug] = rating
    }
  })

  return {
    user,
    fetching:
      !currentUserProfile.node ||
      currentUserProfile.fetching ||
      unratedProjects.fetching,
    unratedProjects: unratedProjects.nodes,
    applies: currentUserProfile.node
      ? currentUserProfile.node.applies.map(application => {
          const rating = ratingsBySlug[application.project.slug]
          if (rating && rating.object_type === 'project') {
            return {
              ...application,
              project_rating: rating,
            }
          }

          return application
        })
      : [],
    bookmarks: currentUserProfile.node
      ? currentUserProfile.node.bookmarked_projects
      : [],
  }
}

const mapDispatchToProps = (
  dispatch,
): Partial<ToolbarProjectsDropdownProps> => ({
  onFetchApplications: () => dispatch(fetchCurrentUserProfile(undefined)),
  onFetchUnratedProjects: () => dispatch(fetchUnratedProjects(undefined)),
  onFetchRatings: () => dispatch(fetchRatings({ object_type: 'project' })),
})

export default withIntl(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(ToolbarProjectsDropdown),
)
