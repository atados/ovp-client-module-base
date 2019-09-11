import React from "react";
import styled from "styled-components";
import GoogleMap from "~/components/GoogleMap/BlockedGoogleMap";
import { Project } from "~/redux/ducks/project";
import MapMark from "../MapMark";
import { defineMessages } from "react-intl";
import useIntl from "~/hooks/use-intl";

const Map = styled(GoogleMap)`
  height: 500px;
`;
interface ProjectPageAddressProps {
  readonly project: Project;
}

const { ENDERECO, COMPLEMENTO } = defineMessages({
  ENDERECO: {
    id: "ENDERECO",
    defaultMessage: "Endereço da vaga"
  },
  COMPLEMENTO: {
    id: "COMPLEMENTO",
    defaultMessage: "Complemento:"
  }
});

const ProjectPageAddress: React.FC<ProjectPageAddressProps> = ({ project }) => {
  const intl = useIntl();

  if (!project.address) {
    return null;
  }

  return (
    <>
      <h4 id="endereco" className="mb-2">
        {intl.formatMessage(ENDERECO)}
      </h4>
      <p className="tw-normal ts-medium mb-4">
        {project.address.typed_address}
        {project.address.typed_address2 && (
          <>
            {" "}
            <b>{intl.formatMessage(COMPLEMENTO)}</b>{" "}
            {project.address.typed_address2}
          </>
        )}
      </p>
      <Map
        defaultCenter={{
          lat: project.address.lat,
          lng: project.address.lng
        }}
      >
        <MapMark lat={project.address.lat} lng={project.address.lng} />
      </Map>
      <hr className="mt-4 mb-4" />
    </>
  );
};

ProjectPageAddress.displayName = "ProjectPageAddress";

export default React.memo(ProjectPageAddress);
