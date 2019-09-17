import escapeRegExp from 'escape-string-regexp'
import Router from 'next/router'
import queryString from 'query-string'
import React from 'react'
import {
  defineMessages,
  WithIntlProps,
  FormattedMessage,
  IntlShape,
} from 'react-intl'
import { connect } from 'react-redux'
import styled, { StyledProps } from 'styled-components'
import { withIntl } from '~/base/lib/intl'
import { Page, PageAs } from '~/common'
import { channel, regionLongNameMap } from '~/common/constants'
import Dropdown, { DropdownMenu } from '~/components/Dropdown'
import Icon from '~/components/Icon'
import { getPlacePredictions } from '~/lib/maps/google-maps-autocomplete'
import { createAccentFriendlyRegexp } from '~/lib/regex/utils'
import { pushToDataLayer } from '~/lib/tag-manager'
import { Cause, Skill } from '~/common/channel'
import { Geolocation } from '~/redux/ducks/geo'
import {
  BaseFilters,
  mapFiltersToQueryObject,
  SearchType,
} from '~/redux/ducks/search'
import { StartupData } from '~/redux/ducks/startup'
import { RootState } from '~/redux/root-reducer'

const m = defineMessages({
  placeholder: {
    id: 'searchForm.placeholder',
    defaultMessage: 'Busque vagas de voluntariado ou ONGs',
  },
  remote: {
    id: 'searchForm.remote',
    defaultMessage: 'Buscar vagas à distância',
  },
})

function resolveDefaultOptions(
  intl: IntlShape,
  startupData: StartupData,
): SearchOption[] {
  const { search } = channel.config

  return [
    ...((search && search.defaultOptions) || []),
    ...startupData.causes
      .sort((x, y) => x.id - y.id)
      .slice(0, 4)
      .map(
        (cause): CauseOption => ({
          id: `cause-${cause.id}`,
          kind: 'cause',
          label: cause.name,
          value: cause.id,
        }),
      ),
    {
      id: 'remote',
      kind: 'remote',
      label: intl.formatMessage(m.remote),
    },
  ]
}

interface Option<Node> {
  id: string
  kind: string
  label: React.ReactNode | string
  value: Node
}

interface RemoteOption {
  id: string
  kind: 'remote'
  label: string
}

interface AddressNode {
  id: string
  description: string
  address_components: Array<{
    types: string[]
    long_name: string
  }>
}

interface AddressOption extends Option<AddressNode> {
  kind: 'address'
}

interface RemoveQueryOption {
  id: string
  kind: 'remove-query'
}

interface QueryOption extends Option<string> {
  kind: 'query'
}

interface CauseOption extends Option<number> {
  kind: 'cause'
}

interface SkillOption extends Option<number> {
  kind: 'skill'
}

export type SearchOption =
  | RemoteOption
  | AddressOption
  | QueryOption
  | CauseOption
  | SkillOption
  | RemoveQueryOption

const DropdownInputWrapper = styled(Dropdown)`
  width: 100%;
  height: 40px;
  box-shadow: ${props =>
    props.theme.toolbarBackground
      ? '0 0 1px rgba(0,0,0,.2), 0 0 2px rgba(0,0,0,.2)'
      : ''};
  border-radius: 20px;

  > input {
    height: 40px;
    padding-left: 40px;
    position: absolute;
    z-index: 50;
    top: 0;
    left: 0;
    right: 0;
    border-radius: 20px;
  }

  > .searchForm__icon {
    position: absolute;
    left: 12px;
    top: 5px;
    font-size: 20px;
    color: #666;
    z-index: 54;
  }
`

const Form = styled.form`
  color: #222;
  text-align: left;

  &.focused ${DropdownInputWrapper}::after {
    content: '';
    left: 16px;
    right: 16px;
    background: rgba(0, 0, 0, 0.1);
    height: 1px;
    position: absolute;
    bottom: -1px;
    z-index: 56;
  }

  &.focused ${DropdownInputWrapper} > input {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }

  @media (max-width: 767px) {
    &.focused {
      margin-right: 0 !important;
    }

    &.focused ${DropdownInputWrapper} > input {
      padding-right: 46px;
    }
  }

  @media (min-width: 768px) {
    ${DropdownInputWrapper} {
      max-width: 450px;
      transition: max-width 0.1s;
    }

    &.focused {
      ${DropdownInputWrapper} {
        max-width: 600px;
      }

      .searchForm__icon {
        color: ${channel.theme.color.primary[500]};
      }
    }
  }
`

const Menu = styled(DropdownMenu)`
  margin-top: 0 !important;
  top: 100%;
  left: 0;
  right: 0;
  padding-bottom: 10px;
  border-radius: 0 0 10px 10px !important;
  z-index: 48;
`

const Options = styled.ul`
  margin: 0;
  padding: 0;
  list-style-type: none;
`

interface OptionItemProps {
  active: boolean
}

const OptionItem = styled.li`
  padding: 8px 12px;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  > .icon {
    margin-right: 9px;
    font-size: 18px;
    width: 20px;
    text-align: center;
  }

  ${(props: StyledProps<OptionItemProps>) =>
    props.active
      ? `
        background: #f0f0f0;`
      : ''};
`

const CloseButton = styled.button`
  border-radius: 50%;
  padding: 2px;
  color: #666;
  background: none;
  border: 1px solid #999;
  font-size: 16px;
  width: 24px;
  height: 24px;
  position: absolute;
  right: 5px;
  top: 0;
  bottom: 0;
  margin: auto;
  z-index: 52;
`

const Highlight = styled.strong`
  background: #ffeee3;
`

interface SearchFormProps {
  readonly startupData: StartupData
  readonly geo: Geolocation
  readonly causes: Cause[]
  readonly skills: Skill[]
  readonly filters?: BaseFilters
  readonly currentSearchType?: SearchType
  readonly defaultValue: string
  readonly className?: string
  readonly theme?: 'dark' | 'light'
  readonly onOpenStateChange?: (focused: boolean) => void
}

interface SearchFormState {
  focused: boolean
  inputValue: string
  options: SearchOption[]
  focusedOptionIndex: number
}

class SearchForm extends React.Component<
  SearchFormProps & WithIntlProps<any>,
  SearchFormState
> {
  public static defaultProps = {
    className: undefined,
  }
  public dropdown: Dropdown | null = null

  public timeout?: number
  public dispatchKey?: string
  public state: SearchFormState

  constructor(props: SearchFormProps & WithIntlProps<any>) {
    super(props)

    const inputValue = props.defaultValue
    let options = resolveDefaultOptions(props.intl, props.startupData)

    if (inputValue.length > 1) {
      options = [
        {
          id: `query-${inputValue}`,
          kind: 'query',
          label: inputValue,
          value: inputValue,
        },
        ...options,
      ]
    }

    this.state = {
      focused: false,
      inputValue,
      options,
      focusedOptionIndex: -1,
    }
  }

  public open = () => {
    if (this.dropdown) {
      this.dropdown.show()
    }
  }

  public close = () => {
    if (this.dropdown) {
      this.dropdown.hide()
    }
  }

  public handleDropdownStateChange = (focused: boolean) => {
    this.setState({ focused })
  }

  public resolveOptionClassName = (kind: string): string | undefined => {
    if (kind === 'remote') {
      return 'tc-secondary-500'
    }

    return undefined
  }

  public resolveOptionIcon = (kind: string): string => {
    if (kind === 'skill') {
      return 'school'
    }

    if (kind === 'remove-query') {
      return 'close'
    }

    if (kind === 'remote') {
      return 'public'
    }

    if (kind === 'address') {
      return 'place'
    }

    if (kind === 'cause') {
      return 'favorite_border'
    }

    return 'search'
  }

  public componentDidUpdate(_: any, prevState: SearchFormState) {
    if (this.state.focused !== prevState.focused) {
      const { onOpenStateChange } = this.props
      if (onOpenStateChange) {
        onOpenStateChange(this.state.focused)
      }
    }
  }

  public replaceMatch = (match: string, i: number) => (
    <Highlight key={i}>{match}</Highlight>
  )

  public handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { startupData } = this.props
    const {
      target: { value: inputValue },
    } = event
    const valueRegexp = createAccentFriendlyRegexp(
      `(${escapeRegExp(inputValue)})`,
      'gi',
    )

    if (inputValue.length >= 1) {
      clearTimeout(this.timeout)
      const queryOption: QueryOption = {
        id: `query-${inputValue}`,
        kind: 'query',
        label: inputValue,
        value: inputValue,
      }

      this.setState({
        focused: true,
        inputValue,
        options: [queryOption, ...this.state.options.slice(1)],
      })

      const dispatchKey = inputValue
      this.dispatchKey = dispatchKey
      this.timeout = window.setTimeout(async () => {
        const options: SearchOption[] = []

        options.push(queryOption)

        let causesPushed: number = 0
        startupData.causes.some(cause => {
          if (causesPushed === 4) {
            return true
          }

          if (valueRegexp.test(cause.name)) {
            causesPushed += 1
            options.push({
              id: `cause-${cause.id}`,
              kind: 'cause',
              label: cause.name,
              value: cause.id,
            })
          }

          return false
        })

        let skillsPushed: number = 0
        startupData.skills.some(skill => {
          if (skillsPushed + causesPushed === 6 || skillsPushed === 4) {
            return true
          }

          if (valueRegexp.test(skill.name)) {
            skillsPushed += 1
            options.push({
              id: `skill-${skill.id}`,
              kind: 'skill',
              label: skill.name,
              value: skill.id,
            })
          }

          return false
        })

        try {
          await getPlacePredictions({
            input: inputValue,
            types: ['geocode'],
          }).then(nodes =>
            nodes.forEach((node, i) => {
              if (i < 3) {
                options.push({
                  id: node.place_id,
                  kind: 'address',
                  label: node.description,
                  value: {
                    id: node.place_id,
                    description: node.description,
                    address_components: [
                      {
                        types: node.types,
                        long_name: node.structured_formatting.main_text,
                      },
                    ],
                  },
                })
              }
            }),
          )
        } catch {
          // ...
        }

        // Place predictions resolved between another commit
        if (this.dispatchKey !== dispatchKey) {
          return
        }

        options.push({
          id: 'remote',
          kind: 'remote',
          label: 'Buscar vagas à distância',
        })

        this.setState({
          options,
          focusedOptionIndex: options.length > 0 ? 0 : -1,
        })
      })
    } else {
      const options: SearchOption[] = []

      if (this.props.filters && this.props.filters.query) {
        options.push({
          id: `query-${inputValue}`,
          kind: 'remove-query',
        })
      }

      options.push(...resolveDefaultOptions(this.props.intl, startupData))
      this.setState({
        focused: true,
        inputValue,
        options,
      })
    }
  }

  public handleInputKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    const { focusedOptionIndex, options } = this.state
    if (event.keyCode === 27) {
      this.close()
      return
    }

    let newIndex = focusedOptionIndex

    if (event.keyCode === 38) {
      // ARROW UP
      newIndex = Math.max(0, focusedOptionIndex - 1)
    } else if (event.keyCode === 40) {
      // ARROW DOWN
      newIndex = Math.min(focusedOptionIndex + 1, options.length - 1)
    }

    if (newIndex !== focusedOptionIndex) {
      this.setState({ focusedOptionIndex: newIndex })
    }
  }

  public handleOptionMouseEnter = (event: React.MouseEvent<HTMLLIElement>) => {
    let index = -1
    if (event && event.target) {
      index = parseInt((event.target as HTMLElement).dataset.index || '-1', 10)
    }

    this.setState({ focusedOptionIndex: index })
  }

  public submit = (event?: React.FormEvent) => {
    if (event) {
      event.preventDefault()
    }

    const { geo, currentSearchType, filters: currentFilters } = this.props
    const { focusedOptionIndex, inputValue, options } = this.state
    const queryObject: BaseFilters = {
      address: currentFilters && currentFilters.address,
    }

    if (Router.pathname === Page.Search && currentFilters) {
      Object.assign(queryObject, currentFilters, { query: '' })
    }

    let searchType =
      Router.pathname === Page.Search
        ? currentSearchType || SearchType.Any
        : SearchType.Any

    if (focusedOptionIndex > -1) {
      const option = options[focusedOptionIndex]
      if (option.kind === 'cause') {
        queryObject.causes = [option.value]

        pushToDataLayer({
          event: 'search',
          type: 'cause',
          text: String(option.label),
        })
      } else if (option.kind === 'skill') {
        queryObject.skills = [option.value]

        pushToDataLayer({
          event: 'search',
          type: 'skill',
          text: String(option.label),
        })
      } else if (option.kind === 'query') {
        queryObject.query = option.value

        pushToDataLayer({
          event: 'search',
          type: 'query',
          text: option.value,
        })
      } else if (option.kind === 'address') {
        queryObject.remoteOnly = false
        queryObject.address = option.value
      } else if (option.kind === 'remote') {
        queryObject.address = undefined
        searchType = SearchType.Projects
        queryObject.remoteOnly = true

        pushToDataLayer({
          event: 'search',
          type: 'remote-only',
          text:
            regionLongNameMap[geo.region as keyof typeof regionLongNameMap] ||
            geo.region,
        })
      }
    } else {
      queryObject.query = inputValue

      if (inputValue) {
        pushToDataLayer({
          event: 'search',
          type: 'query',
          text: inputValue,
        })
      }
    }

    let pageName: keyof typeof Page = 'Search'
    if (searchType === SearchType.Projects) {
      pageName = 'SearchProjects'
    } else if (searchType === SearchType.Organizations) {
      pageName = 'SearchOrganizations'
    }

    const searchQueryString = queryString.stringify({
      ...mapFiltersToQueryObject(queryObject),
      searchType,
    })
    Router.push(
      `${Page[pageName]}?${searchQueryString}`,
      `${PageAs[pageName]()}?${searchQueryString}`,
    )
    this.close()
  }

  public render() {
    const { theme, intl, className } = this.props
    const { inputValue, options, focused, focusedOptionIndex } = this.state

    return (
      <Form
        className={`form-inline ml-0 mr-2 flex-grow ${
          className ? `${className} ` : ''
        }${focused ? 'focused' : ''}`}
        onSubmit={this.submit}
      >
        <DropdownInputWrapper
          ref={ref => {
            this.dropdown = ref as Dropdown
          }}
          open={focused}
          onOpenStateChange={this.handleDropdownStateChange}
          className="search-form-input-wrapper"
        >
          <Icon className="searchForm__icon" name="search" />
          <input
            id="search-form-input"
            type="text"
            className={`input border-transparent ${
              theme === 'light' ? 'bg-black-100' : 'bg-white'
            }`}
            placeholder={intl.formatMessage(m.placeholder)}
            onChange={this.handleInputChange}
            onKeyDown={this.handleInputKeyDown}
            onFocus={this.open}
            value={inputValue}
            autoComplete="off"
          />

          {focused && (
            <CloseButton
              type="button"
              onClick={this.close}
              className="btn search-form-close-button"
            >
              <Icon name="clear" />
            </CloseButton>
          )}
          <Menu>
            <Options>
              {options.map((option, i) => (
                <OptionItem
                  key={option.id}
                  tabIndex={i}
                  className={this.resolveOptionClassName(option.kind)}
                  active={focusedOptionIndex === i}
                  onMouseEnter={this.handleOptionMouseEnter}
                  data-index={i}
                  onClick={this.submit}
                >
                  <Icon
                    name={this.resolveOptionIcon(option.kind)}
                    className="icon"
                  />
                  {option.kind === 'remove-query' ? (
                    <FormattedMessage
                      id="searchForm.removeTermsSearch"
                      defaultMessage="Remover pesquisa por termo"
                    />
                  ) : (
                    option.label
                  )}
                  {option.kind === 'cause' && (
                    <span className="tc-muted">
                      {' '}
                      -{' '}
                      <FormattedMessage
                        id="searchForm.cause"
                        defaultMessage="Causa"
                      />
                    </span>
                  )}
                  {option.kind === 'skill' && (
                    <span className="tc-muted">
                      {' '}
                      -{' '}
                      <FormattedMessage
                        id="searchForm.skill"
                        defaultMessage="Habilidade"
                      />
                    </span>
                  )}
                </OptionItem>
              ))}
            </Options>
          </Menu>
        </DropdownInputWrapper>
      </Form>
    )
  }
}

const mapStateToProps = ({ startup, geo, search }: RootState) => ({
  geo,
  startupData: startup,
  filters: search.filters,
  currentSearchType: search.searchType,
  defaultValue: (search && search.filters && search.filters.query) || '',
})

export default connect(mapStateToProps)(withIntl(SearchForm))
