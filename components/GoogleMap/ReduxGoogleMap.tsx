import * as React from 'react'
import { connect } from 'react-redux'
import { fetchOrganization, Organization } from '~/redux/ducks/organization'
import { fetchProject, Project } from '~/redux/ducks/project'
import { NodeKind } from '~/redux/ducks/search'
import { RootState } from '~/redux/root-reducer'
import MapMark from '../MapMark'
import GoogleMap, {
  GoogleMapPosition,
  isVisibleInBounds,
  MarginBounds,
  Mark,
} from './GoogleMap'

interface ReduxGoogleMapProps {
  readonly className?: string
  readonly nodeKind: NodeKind
  readonly fetching?: boolean
  readonly marks: Mark[]
  readonly node?: Organization | Project
  readonly fetchingNodeId?: any
  readonly defaultCenter?: Mark
  readonly defaultZoom: number
  readonly onNodeOpen?: (id: string) => any
}

interface ReduxGoogleMapState {
  readonly marginBounds?: MarginBounds
  readonly zoom: number
}

class ReduxGoogleMap extends React.PureComponent<
  ReduxGoogleMapProps,
  ReduxGoogleMapState
> {
  constructor(props) {
    super(props)

    this.state = {
      zoom: props.defaultZoom,
    }
  }

  public handleMapChange = ({ zoom, marginBounds }: GoogleMapPosition) => {
    this.setState({ marginBounds, zoom })
  }

  public render() {
    const {
      node,
      fetchingNodeId,
      fetching,
      marks,
      onNodeOpen,
      nodeKind,
      ...props
    } = this.props
    const { marginBounds, zoom } = this.state

    return (
      <GoogleMap onChange={this.handleMapChange} {...props}>
        {marginBounds &&
          marks
            .filter(mark => isVisibleInBounds(mark, marginBounds))
            .map(mark => (
              <MapMark
                key={mark.id}
                nodeId={mark.id}
                onOpen={onNodeOpen}
                node={node && mark.id === node.slug ? node : undefined}
                nodeKind={nodeKind}
                currentZoom={zoom}
                fetchingNode={mark.id === fetchingNodeId && fetching}
                lat={mark.lat}
                lng={mark.lng}
              />
            ))}
      </GoogleMap>
    )
  }
}

const mapStateToProps = (
  { project, organization }: RootState,
  { nodeKind }: ReduxGoogleMapProps,
) => {
  if (nodeKind === NodeKind.Project) {
    return {
      fetchingNodeId: project.slug,
      fetching: project.fetching,
      node: project.node,
    }
  }

  return {
    fetchingNodeId: organization.slug,
    fetching: organization.fetching,
    node: organization.node,
  }
}

const mapDispatchToProps = (dispatch, { nodeKind }: ReduxGoogleMapProps) => ({
  onNodeOpen:
    nodeKind === NodeKind.Project
      ? (slug: string) => dispatch(fetchProject(slug))
      : (slug: string) => dispatch(fetchOrganization(slug)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ReduxGoogleMap)
