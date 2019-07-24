import React from 'react'
import styled from 'styled-components'
import GoogleMap from '~/components/GoogleMap'
import { Project } from '~/redux/ducks/project'
import MapMark from '../MapMark'

const Map = styled(GoogleMap)`
  height: 500px;
`
interface ProjectPageAddressProps {
  readonly project: Project
}

const ProjectPageAddress: React.FC<ProjectPageAddressProps> = ({ project }) => {
  if (!project.address) {
    return null
  }

  return (
    <>
      <h4 id="endereco" className="mb-2">
        Endereço da vaga
      </h4>
      <p className="tw-normal ts-medium mb-4">
        {project.address.typed_address}
        {project.address.typed_address2 && (
          <>
            {' '}
            <b>Complemento:</b> {project.address.typed_address2}
          </>
        )}
      </p>
      <Map
        defaultCenter={{
          lat: project.address.lat,
          lng: project.address.lng,
        }}
      >
        <MapMark lat={project.address.lat} lng={project.address.lng} />
      </Map>
      <hr className="mt-4 mb-4" />
    </>
  )
}

ProjectPageAddress.displayName = 'ProjectPageAddress'

export default React.memo(ProjectPageAddress)
