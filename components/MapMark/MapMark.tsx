import Link from 'next/link'
import React from 'react'
import styled from 'styled-components'
import { Page, PageAs } from '~/common'
import { Organization } from '~/redux/ducks/organization'
import { Project } from '~/redux/ducks/project'
import { NodeKind } from '~/redux/ducks/search'
import ActivityIndicator from '../ActivityIndicator'
import { Mark } from '../GoogleMap/GoogleMap'
import Icon from '../Icon'
import { styles as organizationStyles } from '../OrganizationCard/OrganizationCard'

const Container = styled.div`
  position: relative;
`

const Button = styled.button`
  width: 24px;
  height: 24px;
  background: #0366d6;
  border-radius: 50%;
  border: 3px solid #fff;
  position: relative;
  box-shadow: 0 0 1px rgba(0, 0, 0, 0.4), 0 0 8px rgba(0, 0, 0, 0.4);
  outline: none !important;
  transition: transform 0.2s;
  cursor: pointer;

  &:hover {
    transform: scale(1.2);
  }

  &::before {
    content: '';
    border-width: 8px 8px 0;
    border-style: solid;
    border-color: #fff rgba(255, 255, 255, 0);
    position: absolute;
    bottom: -6px;
    right: 0;
    left: 0;
    width: 0;
    margin: auto;
  }

  &::after {
    content: '';
    border-width: 9px 9px 0;
    border-style: solid;
    border-color: #0366d6 rgba(255, 255, 255, 0);
    position: absolute;
    bottom: -3px;
    right: 0;
    left: 0;
    width: 0;
    margin: auto;
  }
`

const Card = styled.div`
  width: 240px;
  bottom: 40px;
  min-height: 200px;
  position: absolute;
  z-index: 120;
  outline: none !important;
  font-size: 1rem;
  background: #fff;
  left: -110px;
  box-shadow: 0 0px 0 1px rgba(0, 0, 0, 0.2),
    0px 14px 36px 2px rgba(0, 0, 0, 0.15);
  border-radius: 4px;

  &::after,
  &::before {
    content: '';
    border-width: 8px 8px 0;
    border-style: solid;
    position: absolute;
    bottom: -7px;
    right: 0;
    left: 0;
    margin: auto;
    width: 0;
    width: 0;
    height: 0;
  }

  &::after {
    border-color: #fff rgba(255, 255, 255, 0);
  }

  &::before {
    border-color: rgba(0, 0, 0, 0.5) rgba(255, 255, 255, 0);
    bottom: -8px;
  }
`

const CloseButton = styled.button`
  position: absolute;
  right: -42px;
  top: 0;
  font-size: 24px;
  padding: 5px;
  background: #d6efff;
  color: #0366d6;

  &:hover,
  &:focus {
    background: #c5dfff;
  }
`

const Counter = styled.div`
  position: absolute;
  left: 8px;
  bottom: 8px;
  padding: 5px 12px;
  background: #0366d6;
  color: #fff;
  font-size: 14px;
  line-height: 1.5;
  height: 30px;
  border-radius: 15px;
  vertical-align: top;

  > img {
    height: 18px;
    vertical-align: top;
  }

  > span {
    display: inline-block;
  }
`

const Author = styled.span`
  color: #bbb;
  display: block;
  font-size: 13px;
  margin-bottom: 5px;
`

const { Info, Name, Description, Anchor } = organizationStyles

interface MapMarkProps {
  readonly className?: string
  readonly nodeId?: any
  readonly fetchingNode?: boolean
  readonly nodeKind?: NodeKind
  readonly lat: number
  readonly lng: number
  readonly currentZoom?: number
  readonly node?: Project | Organization
  readonly onOpen?: (id: string, mark: Mark) => any
  readonly onRecenterMap?: (mark: Mark) => any
}

interface MapMarkState {
  open?: boolean
}

type OnCloseCallback = () => any

class MapMark extends React.Component<MapMarkProps, MapMarkState> {
  public static onCloseConsumers: OnCloseCallback[] = []

  constructor(props) {
    super(props)

    this.state = {}
  }

  public componentDidMount() {
    MapMark.onCloseConsumers.push(this.close)
  }

  public componentWillUnmount() {
    MapMark.onCloseConsumers = MapMark.onCloseConsumers.filter(
      consumer => consumer !== this.close,
    )
  }

  public close = () => {
    if (this.state.open) {
      this.setState({ open: false })
    }
  }

  public toggle = () => {
    const { currentZoom, onOpen, onRecenterMap } = this.props

    if (onOpen) {
      onOpen(this.props.nodeId, {
        lng: this.props.lng,
        lat: this.props.lat,
      })

      this.setState({ open: !this.state.open })
      MapMark.onCloseConsumers.forEach(consumer => {
        if (consumer !== this.close) {
          consumer()
        }
      })
    }

    if (onRecenterMap) {
      onRecenterMap({
        lng: this.props.lng,
        lat:
          this.props.lat +
          0.005 * Math.max(1, currentZoom ? 10 - currentZoom : 1),
      })
    }
  }

  public link = (children: React.ReactNode) => {
    const { node, nodeKind } = this.props

    if (!node) {
      return null
    }

    return (
      <Link
        href={nodeKind === NodeKind.Project ? Page.Project : Page.Organization}
        as={
          nodeKind === NodeKind.Project
            ? PageAs.Project({ slug: node.slug })
            : PageAs.Organization({ organizationSlug: node.slug })
        }
        passHref
      >
        <Anchor>{children}</Anchor>
      </Link>
    )
  }

  public linkProjectOrganization = () => {
    const { node, nodeKind } = this.props

    if (!node || nodeKind !== NodeKind.Project) {
      return null
    }

    const { organization } = node as Project

    return (
      organization && (
        <Link
          href={Page.Organization}
          as={PageAs.Organization({ organizationSlug: organization.slug })}
        >
          <a>{organization.name}</a>
        </Link>
      )
    )
  }

  public render() {
    const {
      fetchingNode,
      node,
      onOpen,
      onRecenterMap,
      className,
      nodeKind,
      nodeId,
      ...props
    } = this.props
    const { open } = this.state

    const renderedNode = !fetchingNode && node && (
      <>
        {this.link(
          <div className="ratio relative">
            <span
              className="ratio-fill"
              style={{
                paddingTop:
                  nodeKind === NodeKind.Project ? '66.666666666%' : '100%',
              }}
            />
            <span
              className="ratio-body bg-cover bg-center"
              style={
                node.image
                  ? {
                      backgroundImage: `url('${node.image.image_url}')`,
                    }
                  : undefined
              }
            >
              {nodeKind === NodeKind.Project && (
                <Counter title={`${(node as Project).applied_count} inscritos`}>
                  <img
                    src="/static/base/icons/volunteer.svg"
                    alt=""
                    className="mr-2"
                  />
                  <span>{(node as Project).applied_count}</span>
                </Counter>
              )}
            </span>
          </div>,
        )}
        <div className="p-2">
          {nodeKind === NodeKind.Organization ? (
            node.address && (
              <Info
                title={`${node.address.city_state &&
                  `${node.address.city_state}, `} ${
                  node.address.typed_address
                }`}
                className="w-full text-secondary-500"
              >
                {node.address.city_state && `${node.address.city_state}, `}
                {node.address.typed_address}
              </Info>
            )
          ) : (
            <Author className="truncate">
              {closed && (
                <>
                  <span className="text-red-600 font-medium">ENCERRADA</span> -{' '}
                </>
              )}
              {!closed && 'por '}
              {this.linkProjectOrganization()}
            </Author>
          )}

          {this.link(<Name className="truncate">{node.name}</Name>)}
          <Description className="m-0">{node.description}</Description>
        </div>
      </>
    )

    return (
      <Container className={className} {...props}>
        {open && (
          <Card>
            <CloseButton
              type="button"
              className="btn btn-text"
              onClick={this.close}
            >
              <Icon name="close" />
            </CloseButton>
            {fetchingNode ? (
              <ActivityIndicator size={64} className="absolute-center" />
            ) : (
              renderedNode
            )}
          </Card>
        )}
        <Button type="button" onClick={nodeId ? this.toggle : undefined} />
      </Container>
    )
  }
}

export default React.memo(MapMark)
