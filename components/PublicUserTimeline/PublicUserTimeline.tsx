import React from 'react'
import { Waypoint } from 'react-waypoint'
import styled, { StyledProps } from 'styled-components'
import { PublicUserApplication } from '~/redux/ducks/public-user'
import TimelineItem from './TimelineItem'
import { Color } from '~/common'

const TimelineCrossedHr = styled.div`
  background-image: url(/static/base/icons/cross-x.svg);
  background-repeat: repeat-x;
  height: 10px;
  padding-left: 30px;
  text-align: center;

  > span {
    background: #fff;
    font-size: 14px;
    font-weight: 500;
    position: relative;
    padding: 0 10px;
    top: -8px;
  }
`

const TimelineItemDivisor = styled.div`
  border-left: 2px solid #eaecef;
  padding-bottom: 20px;
`

const Timeline = styled.div`
  display: flex;
`

const TimelineBody = styled.div`
  flex: 1 1 auto;
  padding-left: 16px;
`

const TimelineSidebarWrapper = styled.div`
  min-width: 150px;
  margin-left: 30px;
`
interface TimelineSidebarProps {
  fixed: boolean
}
const TimelineSidebar = styled.div`
  width: 150px;

  ${(props: StyledProps<TimelineSidebarProps>) =>
    props.fixed
      ? `
    top: ${props.theme.toolbarHeight + 10}px;
    position: fixed;`
      : ''};
`

interface TimelineYearProps {
  active?: boolean
}
const TimelineYear = styled.a`
  padding: 8px 16px;
  font-size: 13px;
  margin-bottom: 8px;
  cursor: pointer;
  border-radius: 4px;
  display: block;

  ${(props: StyledProps<TimelineYearProps>) =>
    props.active
      ? `
    background: ${Color.primary[500]};
    color: #fff;

    &:hover {
      color: #fff;
      text-decoration: none;
    }`
      : `
    color: #333;

    &:hover {
      color: #333;
      background: #eaecef;
    }`};
`

const TimelineSection = styled.h4`
  font-size: 14px;
  margin: 10px 0 10px -16px;
  position: relative;

  > span {
    position: relative;
    z-index: 10;
    background: #fff;
    padding-right: 10px;
  }

  &::after {
    content: '';
    position: absolute;
    height: 1px;
    background: #eee;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
  }
`

interface PublicUserTimelineProps {
  readonly className?: string
  readonly applies: PublicUserApplication[]
}

interface PublicUserTimelineState {
  readonly timelineActiveYear?: number
  readonly isTimelineSidebarFixed: boolean
  readonly timelineYears: number[]
  readonly appliesHistory: PublicUserApplication[]
  readonly currentApplies: PublicUserApplication[]
}

class PublicUserTimeline extends React.Component<
  PublicUserTimelineProps,
  PublicUserTimelineState
> {
  public static getDerivedStateFromProps(
    props: PublicUserTimelineProps,
    state?: PublicUserTimelineState,
  ): PublicUserTimelineState {
    const newState = {
      timelineActiveYear: state ? state.timelineActiveYear : undefined,
      isTimelineSidebarFixed: state ? state.isTimelineSidebarFixed : false,
      timelineYears: state ? state.timelineYears : [],
      appliesHistory: state ? state.appliesHistory : [],
      currentApplies: state ? state.currentApplies : [],
    }

    if (!state) {
      let lastYear: number | undefined
      props.applies.forEach(application => {
        if (application.date) {
          const year = new Date(application.date).getFullYear()

          if (!newState.timelineActiveYear) {
            newState.timelineActiveYear = year
          }

          if (year !== lastYear) {
            lastYear = year
            newState.timelineYears.push(year)
          }
        }

        if (application.project.closed) {
          newState.appliesHistory.push({ ...application, dateYear: lastYear })
        } else {
          newState.currentApplies.push(application)
        }
      })
    }

    return newState
  }

  constructor(props) {
    super(props)

    this.state = PublicUserTimeline.getDerivedStateFromProps(props)
  }

  public handleTimelineWaypointPositionChange = (
    waypointState: Waypoint.CallbackArgs,
  ) => {
    if (
      !this.state.isTimelineSidebarFixed &&
      waypointState.currentPosition === Waypoint.above
    ) {
      this.setState({ isTimelineSidebarFixed: true })
    } else if (this.state.isTimelineSidebarFixed) {
      this.setState({ isTimelineSidebarFixed: false })
    }
  }

  public handleTimelineYearPositionChange = (
    year: number,
    waypointState: Waypoint.CallbackArgs,
  ) => {
    const { timelineActiveYear } = this.state
    if (waypointState.currentPosition === Waypoint.inside) {
      this.setState({ timelineActiveYear: year })
      return
    }

    if (
      waypointState.currentPosition === Waypoint.above &&
      (!timelineActiveYear || year < timelineActiveYear)
    ) {
      this.setState({ timelineActiveYear: year })
      return
    }

    if (
      timelineActiveYear === year &&
      waypointState.currentPosition === Waypoint.below
    ) {
      const index = this.state.timelineYears.indexOf(year)

      if (index !== 0) {
        this.setState({
          timelineActiveYear: this.state.timelineYears[index - 1],
        })
      }
    }
  }

  public render() {
    const { applies } = this.props
    const {
      timelineActiveYear,
      isTimelineSidebarFixed,
      appliesHistory,
      currentApplies,
      timelineYears,
    } = this.state

    let lastYear: number | undefined
    return (
      <div>
        <Waypoint
          onPositionChange={this.handleTimelineWaypointPositionChange}
        />
        <h4 className="text-lg mb-1">Linha do tempo</h4>
        <p className="text-gray-600 text-sm">
          {applies.length} participações voluntárias
        </p>
        <Timeline>
          <TimelineBody>
            {currentApplies.map(application => (
              <TimelineItem
                key={application.id}
                application={application}
                onGoing
              />
            ))}
            {appliesHistory.length > 0 && currentApplies.length > 0 && (
              <TimelineItemDivisor>
                <TimelineCrossedHr>
                  <span>Histórico</span>
                </TimelineCrossedHr>
              </TimelineItemDivisor>
            )}
            {appliesHistory.map(application => {
              const item = (
                <TimelineItem key={application.id} application={application} />
              )

              if (lastYear !== application.dateYear) {
                lastYear = application.dateYear
                return (
                  <React.Fragment key={application.dateYear}>
                    <Waypoint
                      onPositionChange={position =>
                        this.handleTimelineYearPositionChange(
                          application.dateYear as number,
                          position,
                        )
                      }
                    />
                    <TimelineSection
                      id={`timeline-year-${application.dateYear}`}
                    >
                      <span>{application.dateYear}</span>
                    </TimelineSection>
                    {item}
                  </React.Fragment>
                )
              } else {
                return item
              }
            })}
          </TimelineBody>
          <TimelineSidebarWrapper className="hidden md:block">
            <TimelineSidebar fixed={isTimelineSidebarFixed}>
              {timelineYears.map(year => (
                <TimelineYear
                  href={`#timeline-year-${year}`}
                  key={year}
                  active={!!timelineActiveYear && year === timelineActiveYear}
                  onClick={() => this.setState({ timelineActiveYear: year })}
                >
                  {year}
                </TimelineYear>
              ))}
            </TimelineSidebar>
          </TimelineSidebarWrapper>
        </Timeline>
      </div>
    )
  }
}

export default PublicUserTimeline
