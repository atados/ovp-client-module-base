import { NextContext } from "next";
import Link from "next/link";
import * as React from "react";
import { connect } from "react-redux";
import { defineMessages, InjectedIntlProps } from "react-intl";
import styled from "styled-components";
import { resolvePage } from "~/common/page";
import GoogleMap from "~/components/GoogleMap";
import Icon from "~/components/Icon";
import Layout from "~/components/Layout";
import MapMark from "~/components/MapMark";
import Markdown from "~/components/Markdown";
import OrganizationApplies from "~/components/OrganizationApplies";
import OrganizationPageLayout from "~/components/OrganizationLayout/OrganizationPageLayout";
import { NotFoundPageError } from "~/lib/next/errors";
import { throwActionError } from "~/lib/utils/redux";
import { fetchOrganization, Organization } from "~/redux/ducks/organization";
import { fetchOrganizationApplies } from "~/redux/ducks/organization-applies";
import { User } from "~/redux/ducks/user";
import { RootState } from "~/redux/root-reducer";
import { withIntl } from "~/lib/intl";

const Row = styled.div`
  margin: 0 -7px;

  .col-lg-8,
  .col-lg-4 {
    padding-left: 7px;
    padding-right: 7px;
  }
`;

const Info = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
`;

const InfoItem = styled.div`
  padding: 5px 10px 5px 30px;
  font-size: 16px;
`;

const InfoItemIcon = styled(Icon)`
  float: left;
  margin-left: -30px;
  color: #6a6c75;
  font-size: 18px;
`;

const Map = styled(GoogleMap)`
  height: 300px;
`;

const CauseIndicator = styled.span`
  display: inline-block;
  vertical-align: top;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #999;
  margin: 7px 5px 0 0;
`;

const Rating = styled.div`
  padding-left: 52px;
  line-height: 1.3;
  font-size: 14px;
  min-height: 66px;
`;

const RatingIndicator = styled.span`
  display: inline-block;
  width: 42px;
  height: 42px;
  background: ${props => props.theme.colorPrimary};
  color: #fff;
  border-radius: 50%;
  font-size: 16px;
  text-align: center;
  padding: 12px 0;
  margin-left: -52px;
  float: left;
`;

const { SOBRE_A_ONG, ENDERECO, AVALIACOES, COM_BASE, CAUSAS } = defineMessages({
  SOBRE_A_ONG: {
    id: "SOBRE_A_ONG",
    defaultMessage: "Sobre a ONG"
  },
  ENDERECO: {
    id: "ENDERECO",
    defaultMessage: "Endereço"
  },
  AVALIACOES: {
    id: "AVALIACOES",
    defaultMessage: "Avaliações"
  },
  COM_BASE: {
    id: "COM_BASE",
    defaultMessage: "Com base na opinião dos voluntários"
  },
  CAUSAS: {
    id: "CAUSAS",
    defaultMessage: "Causas"
  }
});

interface OrganizationPageProps {
  readonly isCurrentUserMember: boolean;
  readonly className?: string;
  readonly organization: Organization;
  readonly authenticatedUser: User | null;
}

class OrganizationPage extends React.Component<
  OrganizationPageProps & InjectedIntlProps
> {
  public static async getInitialProps({
    store,
    query: { slug },
    req
  }: NextContext): Promise<Partial<OrganizationPageProps>> {
    const { user } = store.getState();
    if (typeof slug !== "string") {
      throw new NotFoundPageError();
    }

    try {
      await store.dispatch(fetchOrganization(slug)).then(throwActionError);
      const appliesPromise = store.dispatch(fetchOrganizationApplies(slug));

      if (req) {
        await appliesPromise;
      }

      return {
        isCurrentUserMember: Boolean(
          user && user.organizations.some(o => o.slug === slug)
        )
      };
    } catch (error) {
      if (error.status === 404) {
        throw new NotFoundPageError();
      }

      throw error;
    }
  }

  public render() {
    const { organization, isCurrentUserMember, intl } = this.props;

    if (!organization) {
      return <Layout toolbarProps={{ fixed: true }} disableFooter />;
    }

    return (
      <OrganizationPageLayout
        organization={organization}
        isCurrentUserMember={isCurrentUserMember}
      >
        <Row className="row">
          <div className="col-lg-8">
            {organization.details && (
              <>
                <h1 className="ts-medium tw-medium mb-2">
                  {intl.formatMessage(SOBRE_A_ONG)}
                </h1>
                <Markdown value={organization.details} className="ts-normal" />
                <hr />
              </>
            )}

            {organization.address && !organization.hidden_address && (
              <section>
                <h1 className="ts-medium tw-medium mb-2">
                  {intl.formatMessage(ENDERECO)}
                </h1>

                <Map
                  defaultCenter={{
                    lat: organization.address.lat,
                    lng: organization.address.lng
                  }}
                  disableChildrenMaping
                >
                  {
                    // @ts-ignore
                    <MapMark
                      lat={organization.address.lat}
                      lng={organization.address.lng}
                    />
                  }
                </Map>
                <p className="tc-muted-dark ts-small mt-3">
                  {organization.address.typed_address} -{" "}
                  {organization.address.typed_address2}
                </p>
              </section>
            )}
          </div>

          <div className="d-none d-lg-block col-lg-4 pb-5">
            {organization.rating && (
              <Rating className="bg-muted radius-10 mb-3">
                <div className="p-2">
                  <RatingIndicator>
                    {String(organization.rating * 5).substr(0, 3)}
                  </RatingIndicator>
                  <span>
                    <b>{intl.formatMessage(AVALIACOES)}</b>
                    <br />
                    <i>{String(organization.rating * 5).substr(0, 3)} de 5</i> ·
                    {intl.formatMessage(COM_BASE)}
                  </span>
                </div>
              </Rating>
            )}

            <div className="bg-muted radius-10 mb-3 p-3">
              <h4 className="ts-normal">{intl.formatMessage(CAUSAS)}</h4>
              {organization.causes.map((cause, i) => (
                <Link
                  key={cause.id}
                  href={{
                    pathname: resolvePage("/cause"),
                    query: { slug: cause.slug }
                  }}
                  as={`/causa/${cause.slug}`}
                >
                  <a
                    className={`d-block tc-base ${
                      i !== organization.causes.length - 1 ? "mb-1" : ""
                    }`}
                  >
                    <CauseIndicator
                      style={{ backgroundColor: cause.color }}
                      className="mr-2"
                    />
                    {cause.name}
                  </a>
                </Link>
              ))}
            </div>
            <OrganizationApplies />
            <div className="bg-muted radius-10 mb-3">
              <Info className="py-2 px-3">
                {organization.address && !organization.hidden_address && (
                  <InfoItem>
                    <InfoItemIcon name="place" />
                    {organization.address.typed_address} -{" "}
                    {organization.address.typed_address2}
                  </InfoItem>
                )}

                <InfoItem className="text-truncate">
                  <InfoItemIcon name="mail" />
                  <a href={`mailto:${organization.contact_email}`}>
                    {organization.contact_email}
                  </a>
                </InfoItem>

                {organization.website && (
                  <InfoItem className="text-truncate">
                    <InfoItemIcon name="public" />
                    <a href={organization.facebook_page}>Facebook</a>
                  </InfoItem>
                )}

                {organization.website && (
                  <InfoItem className="text-truncate">
                    <InfoItemIcon name="public" />
                    <a href={organization.website}>{organization.website}</a>
                  </InfoItem>
                )}
              </Info>
            </div>
          </div>
        </Row>
      </OrganizationPageLayout>
    );
  }
}
const mapStateToProps = ({
  user,
  organization
}: RootState): Partial<OrganizationPageProps> => ({
  authenticatedUser: user,
  organization: organization.node
});

export default connect(mapStateToProps)(withIntl(OrganizationPage));
