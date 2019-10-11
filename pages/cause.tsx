import { NextPage } from 'next'
import Link from 'next/link'
import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import Layout from '~/components/Layout'
import Meta from '~/components/Meta'
import SearchSources from '~/components/SearchSources'
import { SearchSourcesSize } from '~/components/SearchSources/SearchSources'
import { rgba } from '~/lib/color/transformers'
import { NotFoundPageError } from '~/lib/next/errors'
import { mountAddressFilter } from '~/lib/utils/geo-location'
import { Cause } from '~/common/channel'
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
import { PageAs, Page, Color } from '~/common'
import { channel } from '../common/constants'
import VolunteerIcon from '~/components/Icon/VolunteerIcon'

const BannerOverlay = styled.div`
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    opacity: 0.6;
    background: linear-gradient(
      180deg,
      ${Color.secondary[700]},
      ${Color.secondary[500]}
    );
  }
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
    background: ${channel.theme.color.primary[500]};
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

const CausePage: NextPage<
  CausePageProps,
  Pick<CausePageProps, 'cause' | 'backgroundColor'>
> = ({
  causes,
  page,
  sources,
  searchType,
  filtersQueryObject,
  cause,
  fetching,
}) => {
  return (
    <Layout
      toolbarProps={{
        flat: true,
        className: 'no-background',
        float: true,
      }}
    >
      <Meta title={cause.name} />

      <BannerOverlay
        className="p-toolbar bg-cover bg-secondary-400"
        style={
          cause.image
            ? { backgroundImage: `url('${cause.image.image_url}')` }
            : undefined
        }
      >
        <div className="relative z-50">
          <div className="container pt-10 pb-5 ta-center">
            <span className="w-16 h-16 bg-white rounded-circle block mb-3 mx-auto py-2">
              <VolunteerIcon
                width={32}
                height={32}
                fill={Color.secondary[500]}
              />
            </span>
            <span className="block tc-light text-2xl">Lute pela causa</span>
            <h1 className="display-1 ta-center tc-white p-3 rounded-lg cursor-pointer w-auto inline-block">
              {cause.name}
            </h1>
          </div>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="96px"
            viewBox="0 0 100 100"
            version="1.1"
            preserveAspectRatio="none"
            className="block h-16"
          >
            <path
              fill="#fff"
              d="M0,0 C16.6666667,66 33.3333333,99 50,99 C66.6666667,99 83.3333333,66 100,0 L100,100 L0,100 L0,0 Z"
            ></path>
          </svg>
        </div>
      </BannerOverlay>
      <div className="flex container py-5">
        <Sidebar className="hidden md:block">
          <h4 className="ts-medium nav-link">Causas</h4>
          {causes.map(c => (
            <Link
              key={c.id}
              as={PageAs.Cause({ slug: c.slug })}
              href={Page.Cause}
            >
              <CauseLink
                href={`/causa/${c.slug}`}
                className={`text-truncate block nav-link${
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
}
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
