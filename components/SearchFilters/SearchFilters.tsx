import isEqual from "fast-deep-equal";
import Router from "next/router";
import queryString from "query-string";
import * as React from "react";
import styled from "styled-components";
import { resolvePage } from "~/common/page";
import CausesFilter from "~/components/CausesFilter";
import DisponibilityFilter from "~/components/DisponibilityFilter";
import SkillsFilter from "~/components/SkillsFilter";
import ToggleSwitch from "~/components/ToggleSwitch";
import {
  BaseFilters,
  DisponibilityFilterValue,
  mapFiltersToQueryObject,
  SearchType
} from "~/redux/ducks/search";
import Icon from "../Icon";
import { SearchFilterButton } from "./SearchFilter";
import { InjectedIntlProps, defineMessages } from "react-intl";
import { withIntl } from "~/lib/intl";

const Container = styled.div`
  .direction-right .dropdown-menu {
    left: 0;
    right: auto;
  }

  .direction-left .dropdown-menu {
    left: auto;
    right: 0;
  }
`;

const MapToggleSwitchLabel = styled.label`
  user-select: none;
  cursor: pointer;

  > .input-map-switch {
    vertical-align: middle;
    margin-left: 10px;
  }
`;

const { VAGAS_A_DISTANCIA, ENDERECO, MOSTRAR_MAPA } = defineMessages({
  VAGAS_A_DISTANCIA: {
    id: "VAGAS_A_DISTANCIA",
    defaultMessage: "Somente vagas à distância"
  },
  ENDERECO: {
    id: "ENDERECO",
    defaultMessage: "Endereço"
  },
  MOSTRAR_MAPA: {
    id: "MOSTRAR_MAPA",
    defaultMessage: "Mostrar mapa"
  }
});

interface SearchFiltersProps {
  readonly value: BaseFilters;
  readonly searchType?: SearchType;
  readonly onOpenStateChange?: (open: boolean) => void;
  readonly onMapSwitchChange: (visible: boolean) => any;
}

interface SearchFiltersState {
  value: BaseFilters;
  dirty: boolean;
}

class SearchFilters extends React.Component<
  SearchFiltersProps & InjectedIntlProps,
  SearchFiltersState
> {
  public static getDerivedStateFromProps(
    props: SearchFiltersProps,
    state?: SearchFiltersState
  ): SearchFiltersState {
    return {
      dirty: state ? state.dirty : false,
      value: state ? (!state.dirty ? props.value : state.value) : props.value
    };
  }

  private fields: {
    [fieldName: string]: {
      open?: boolean;
      onOpenStateChange: (open: boolean) => void;
    };
  };

  constructor(props: SearchFiltersProps & InjectedIntlProps) {
    super(props);

    this.state = SearchFilters.getDerivedStateFromProps(props);
    this.fields = {
      causes: {
        onOpenStateChange: this.handleFilterOpenStateChange.bind(this, "causes")
      },
      skills: {
        onOpenStateChange: this.handleFilterOpenStateChange.bind(this, "skills")
      },
      disponibility: {
        onOpenStateChange: this.handleFilterOpenStateChange.bind(
          this,
          "disponibility"
        )
      },
      remote: {
        onOpenStateChange: this.handleFilterOpenStateChange.bind(this, "remote")
      }
    };
  }

  public handleFilterOpenStateChange = (fieldName: string, open: boolean) => {
    const { onOpenStateChange } = this.props;
    if (onOpenStateChange) {
      this.fields[fieldName].open = open;
      const isOneOpen = Object.keys(this.fields).some(name =>
        Boolean(this.fields[name].open)
      );

      onOpenStateChange(isOneOpen);
    }
  };

  public handleMapToggleSwitchChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { onMapSwitchChange } = this.props;
    const { checked } = event.target;

    onMapSwitchChange(checked);
  };

  public handleDisponibilityFilterChange = (
    newValue: DisponibilityFilterValue
  ) => {
    this.setState({
      dirty: true,
      value: {
        ...this.state.value,
        disponibility: newValue
      }
    });
  };

  public handleRemoteFilterChange = (newValue: boolean) => {
    this.setState({
      dirty: true,
      value: {
        ...this.state.value,
        remoteOnly: newValue
      }
    });
  };

  public handleCausesFilterChange = (newValue: number[]) => {
    this.setState({
      dirty: true,
      value: {
        ...this.state.value,
        causes: newValue
      }
    });
  };

  public handleSkillsFilterChange = (newValue: number[]) => {
    this.setState({
      dirty: true,
      value: {
        ...this.state.value,
        skills: newValue
      }
    });
  };

  public commit = () => {
    const { searchType } = this.props;
    const { value } = this.state;

    if (isEqual(value, this.props.value)) {
      return;
    }

    const query = queryString.stringify({
      ...mapFiltersToQueryObject(value),
      searchType
    });

    let path: string = "/explorar";

    if (searchType === SearchType.Projects) {
      path = "/vagas";
    } else if (searchType === SearchType.Organizations) {
      path = "/ongs";
    }

    Router.push(`${resolvePage("/explore")}?${query}`, `${path}?${query}`);
    this.setState({ dirty: false });
  };

  public handleAddressFilterClick = () => {
    const element = document.getElementById("search-form-input");

    if (element) {
      element.focus();
    }
  };

  public render() {
    const { searchType, intl } = this.props;
    const { value } = this.state;

    return (
      <Container className="d-flex">
        <SearchFilterButton
          active={Boolean(value.address || value.remoteOnly)}
          className="btn mr-2"
          onClick={this.handleAddressFilterClick}
        >
          <Icon name="place" className="mr-1" />
          {value.remoteOnly
            ? intl.formatMessage(VAGAS_A_DISTANCIA)
            : value.address
            ? value.address.description
            : intl.formatMessage(ENDERECO)}
        </SearchFilterButton>
        <CausesFilter
          value={value.causes}
          onCommit={this.commit}
          onChange={this.handleCausesFilterChange}
          onOpenStateChange={this.fields.causes.onOpenStateChange}
          className="mr-2 d-inline-block direction-right"
        />
        {searchType !== SearchType.Organizations && (
          <>
            <SkillsFilter
              value={value.skills}
              onCommit={this.commit}
              onChange={this.handleSkillsFilterChange}
              onOpenStateChange={this.fields.skills.onOpenStateChange}
              className="mr-2 d-inline-block direction-right"
            />
            <DisponibilityFilter
              value={value.disponibility}
              onCommit={this.commit}
              onChange={this.handleDisponibilityFilterChange}
              onOpenStateChange={this.fields.disponibility.onOpenStateChange}
              className="mr-2 d-inline-block direction-right"
            />
          </>
        )}
        <div className="mr-auto" />
        {searchType !== SearchType.Any && (
          <div className="d-none d-md-block">
            <MapToggleSwitchLabel htmlFor="filters-show-map-toggler">
              <span className="ts-small">
                {intl.formatMessage(MOSTRAR_MAPA)}
              </span>
              <ToggleSwitch
                className="input-map-switch"
                id="filters-show-map-toggler"
                height={32}
                onChange={this.handleMapToggleSwitchChange}
                defaultChecked
              />
            </MapToggleSwitchLabel>
          </div>
        )}
      </Container>
    );
  }
}

export default withIntl(SearchFilters);
