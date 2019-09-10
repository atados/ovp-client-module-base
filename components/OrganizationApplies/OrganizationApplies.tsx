import Link from "next/link";
import * as React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { defineMessages } from "react-intl";
import useIntl from "~/hooks/use-intl";
import { colors } from "~/common/constants";
import { resolvePage } from "~/common/page";
import { OrganizationAppliesPayload } from "~/redux/ducks/organization-applies";
import { RootState } from "~/redux/root-reducer";

const Volunteer = styled.a`
  display: inline-block;
  margin: 1px 4px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
`;

const { VOLUNTARIOS } = defineMessages({
  VOLUNTARIOS: {
    id: "VOLUNTARIOS",
    defaultMessage: "Voluntários"
  }
});

interface OrganizationAppliesProps {
  readonly className?: string;
  readonly fetching?: boolean;
  readonly payload?: OrganizationAppliesPayload;
}

const OrganizationApplies: React.SFC<OrganizationAppliesProps> = ({
  fetching,
  payload
}) => {
  if (fetching) {
    return null;
  }

  if (!payload) {
    return null;
  }

  const intl = useIntl();

  return (
    <div className="bg-muted radius-10 mb-3 p-3">
      {fetching}
      <h4 className="ts-normal mb-0">{intl.formatMessage(VOLUNTARIOS)}</h4>
      <span className="tc-muted mb-2 ts-small d-block">
        {payload.applied_count} {intl.formatMessage(VOLUNTARIOS)}
      </span>
      {payload.applies.map((application, i) => {
        if (!application.user) {
          return (
            <Volunteer
              as="span"
              key={application.id}
              className="bg-cover"
              style={{
                backgroundColor: colors[i % colors.length]
              }}
            />
          );
        }

        return (
          <Link
            key={application.id}
            href={{
              pathname: resolvePage("/public-user"),
              query: { slug: application.user.slug }
            }}
            as={`/voluntario/${application.user.slug}`}
          >
            <Volunteer
              key={application.id}
              href={`/voluntario/${application.user.slug}`}
              className="bg-cover"
              style={{
                backgroundColor: colors[i % colors.length],
                backgroundImage:
                  application.user && application.user.avatar
                    ? `url('${application.user.avatar.image_small_url}')`
                    : undefined
              }}
            />
          </Link>
        );
      })}
    </div>
  );
};

OrganizationApplies.displayName = "OrganizationApplies";

const mapStateToProps = ({
  organizationApplies
}: RootState): Partial<OrganizationAppliesProps> => ({
  fetching: organizationApplies.fetching,
  payload: organizationApplies.payload
});

export default connect(mapStateToProps)(OrganizationApplies);
