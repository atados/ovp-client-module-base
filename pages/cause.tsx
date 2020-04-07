import { useSelector, useDispatch } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import styled from 'styled-components'
import { NextPage } from 'next'
import Link from 'next/link'

import { SearchSourcesSize } from '~/components/SearchSources/SearchSources'
import ActivityIndicator from '~/components/ActivityIndicator'
import { mountAddressFilter } from '~/lib/utils/geo-location'
import VolunteerIcon from '~/components/Icon/VolunteerIcon'
import { Organization } from '~/redux/ducks/organization'
import SearchSources from '~/components/SearchSources'
import { PageAs, Page, Color, Theme } from '~/common'
import { RootState } from '~/redux/root-reducer'
import { Project } from '~/redux/ducks/project'
import useCauses from '~/hooks/use-causes'
import Layout from '~/components/Layout'
import Meta from '~/components/Meta'
import { API } from '~/types/api'
import {
  BaseFiltersJSON,
  mapFiltersToQueryObject,
  search,
  SearchSource,
  SearchType,
} from '~/redux/ducks/search'

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
    background: ${Theme.color.primary[500]};
  }
`

const Sidebar = styled.div`
  min-width: 250px;
  max-width: 250px;
  padding-right: 40px;
  margin-right: 20px;
  border-right: 1px solid #eee;
`

interface CausePageProps {
  readonly projects?: Project[]
  readonly backgroundColor: string
  readonly cause: API.Cause
  readonly causes: API.Cause[]
  readonly page: number
  readonly searchType?: SearchType
  readonly filtersQueryObject: BaseFiltersJSON
  readonly fetching?: boolean
  readonly sources: Array<SearchSource<Project | Organization>>
}

const CausePage: NextPage<CausePageProps> = () => {
  const router = useRouter()
  const slug = router.query.slug
  const dispatch = useDispatch()

  const { geo, search: searchState } = useSelector(
    (reduxState: RootState) => reduxState,
  )

  const { causes, loading: causesLoading } = useCauses()
  const loading = !causes || causesLoading

  const filtersQueryObject = mapFiltersToQueryObject(searchState.filters)
  let sources: Array<SearchSource<Project | Organization>> = []
  const searchType = searchState.searchType
  const page = searchState.page
  const cause = causes?.find(candidate => candidate.slug === slug)

  useEffect(() => {
    if (cause) {
      dispatch(
        search({
          organizationsLength: 4,
          causes: [cause.id],
          address: mountAddressFilter(geo),
        }),
      )

      if (
        searchState.fetched &&
        searchState.filters &&
        searchState.filters.causes &&
        searchState.filters.causes.length === 1 &&
        searchState.filters.causes[0] === cause.id
      ) {
        sources = searchState.sources
      }
    }
  }, [cause, searchState])

  return (
    <Layout
      toolbarProps={{
        flat: true,
        className: 'bg-none',
        float: true,
      }}
    >
      <Meta title={cause?.name} />

      <BannerOverlay
        className="p-toolbar bg-cover bg-center bg-secondary-400"
        style={
          cause?.image
            ? { backgroundImage: `url('${cause?.image.image_url}')` }
            : undefined
        }
      >
        <div className="relative z-50">
          <div className="container px-2 pt-8 text-center">
            <span className="w-16 h-16 bg-white rounded-full block mb-4 mx-auto py-3">
              <VolunteerIcon
                width={32}
                height={32}
                fill={Color.secondary[500]}
              />
            </span>
            <span className="block text-white-alpha-80 text-2xl">
              Lute pela causa
            </span>
            <h1 className="display-1 text-center text-white p-3 rounded-lg cursor-pointer w-auto inline-block">
              {cause?.name || 'Carregando'}
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
      <div className="container px-2 py-8">
        <div className="md:flex md:-mx-2">
          <Sidebar className="hidden md:block px-2">
            <h4 className="text-lg nav-link">
              <FormattedMessage
                id="pages.cause.sidebar.title"
                defaultMessage="Causas"
              />
            </h4>
            {causes?.map(c => (
              <Link
                key={c.id}
                as={PageAs.Cause({ slug: c.slug })}
                href={Page.Cause}
              >
                <CauseLink
                  href={`/causa/${c.slug}`}
                  className={`truncate block nav-link${
                    c.id === cause?.id ? ' active' : ''
                  }`}
                >
                  {c.name}
                </CauseLink>
              </Link>
            ))}
          </Sidebar>
          <div className="px-2 w-full">
            {loading ? (
              <div className="flex justify-center w-full">
                <ActivityIndicator size={40} />
              </div>
            ) : (
              <SearchSources
                size={SearchSourcesSize.Large}
                page={page}
                sources={sources}
                searchType={searchType}
                fetching={loading}
                filtersQueryObject={filtersQueryObject}
              />
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}

CausePage.displayName = 'CausePage'

export default CausePage
