import { NextStatelessComponent } from 'next'
import Link from 'next/link'
import * as React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { resolvePage } from '~/common/page'
import Layout from '~/components/Layout'
import Meta from '~/components/Meta'
import SearchSources from '~/components/SearchSources'
import { SearchSourcesSize } from '~/components/SearchSources/SearchSources'
import { rgba } from '~/lib/color/transformers'
import { NotFoundPageError } from '~/lib/next/errors'
import { mountAddressFilter } from '~/lib/utils/geo-location'
import { Cause } from '~/redux/ducks/channel'
import { Organization } from '~/redux/ducks/organization'
import { Project } from '~/redux/ducks/project'
import {
  BaseFiltersJSON,
  mapFiltersToQueryObject,
  search,
  SearchSource,
  SearchType,
} from '~/redux/ducks/search'
import { RootState } from '~/redux/root-reducer'

const Hero = styled.div`
  padding: 100px 0;
`

const CauseLink = styled.a`
  border-radius: 3px;
  color: #666;

  &:hover {
    color: #555;
    background: #f6f6f6;
  }

  &.active {
    color: #fff !important;
    background: ${props => props.theme.colorPrimary};
  }
`

const Sidebar = styled.div`
  min-width: 250px;
  max-width: 250px;
  padding-right: 40px;
  margin-right: 40px;
  border-right: 1px solid #eee;
`

interface CausePageProps {
  readonly projects?: Project[]
  readonly backgroundColor: string
  readonly cause: Cause
  readonly causes: Cause[]
  readonly page: number
  readonly searchType?: SearchType
  readonly filtersQueryObject: BaseFiltersJSON
  readonly fetching?: boolean
  readonly sources: Array<SearchSource<Project | Organization>>
}

const CausePage: NextStatelessComponent<
  CausePageProps,
  Pick<CausePageProps, 'cause' | 'backgroundColor'>
> = ({
  causes,
  page,
  sources,
  searchType,
  filtersQueryObject,
  cause,
  backgroundColor,
  fetching,
}) => (
  <Layout className="p-toolbar" toolbarProps={{ fixed: true }}>
    <Meta title={cause.name} />
    <Hero style={{ backgroundColor }} className="display-3">
      <div className="container">
        <h1 style={{ color: cause.color }} className="display-1">
          <span className="tw-normal tc-base h1">Lute pela causa</span>
          <br />
          {cause.name}
        </h1>
      </div>
    </Hero>
    <div className="d-flex container py-5">
      <Sidebar className="d-none d-md-block">
        <h4 className="ts-medium nav-link">Causas</h4>
        {causes.map(c => (
          <Link
            key={c.id}
            href={{ pathname: resolvePage('/cause'), query: { slug: c.slug } }}
            as={`/causa/${c.slug}`}
          >
            <CauseLink
              href={`/causa/${c.slug}`}
              className={`text-truncate d-block nav-link${
                c.id === cause.id ? ' active' : ''
              }`}
            >
              {c.name}
            </CauseLink>
          </Link>
        ))}
      </Sidebar>
      <div className="flex-grow">
        <SearchSources
          size={SearchSourcesSize.Large}
          page={page}
          sources={sources}
          searchType={searchType}
          fetching={fetching}
          filtersQueryObject={filtersQueryObject}
        />
      </div>
    </div>
  </Layout>
)

CausePage.displayName = 'CausePage'
CausePage.getInitialProps = async ({ store, query: { slug } }) => {
  const { startup, geo } = store.getState()
  const cause = startup.causes.find(candidate => candidate.slug === slug)

  if (!cause) {
    throw new NotFoundPageError()
  }

  await store.dispatch(
    search({
      organizationsLength: 4,
      causes: [cause.id],
      address: mountAddressFilter(geo),
    }),
  )

  return { cause, backgroundColor: rgba(cause.color, 10) }
}

const mapStateToProps = (
  { startup, search: searchState }: RootState,
  { cause }: CausePageProps,
) => {
  let sources: Array<SearchSource<Project | Organization>> = []

  if (
    searchState.fetched &&
    searchState.filters &&
    searchState.filters.causes &&
    searchState.filters.causes.length === 1 &&
    searchState.filters.causes[0] === cause.id
  ) {
    sources = searchState.sources
  }

  return {
    causes: startup.causes,
    filtersQueryObject: mapFiltersToQueryObject(searchState.filters),
    fetching: searchState.fetching,
    searchType: searchState.searchType,
    page: searchState.page,
    sources,
    filters: searchState.filters || {},
  }
}

export default connect(mapStateToProps)(CausePage)
