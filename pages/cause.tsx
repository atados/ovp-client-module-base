import { FormattedMessage } from 'react-intl'
import { useRouter } from 'next/router'
import styled from 'styled-components'
import { NextPage } from 'next'
import Link from 'next/link'
import React from 'react'

import { BaseFiltersJSON, SearchSource, SearchType } from '~/redux/ducks/search'
import ActivityIndicator from '~/components/ActivityIndicator'
import OrganizationCard from '~/components/OrganizationCard'
import VolunteerIcon from '~/components/Icon/VolunteerIcon'
import { Organization } from '~/redux/ducks/organization'
import { PageAs, Page, Color, Theme } from '~/common'
import ProjectCard from '~/components/ProjectCard'
import { Project } from '~/redux/ducks/project'
import { useFetch } from '~/hooks/use-fetch2'
import useCauses from '~/hooks/use-causes'
import Layout from '~/components/Layout'
import Meta from '~/components/Meta'
import { API } from '~/types/api'

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

interface CardsSectionProps {
  projects: API.Project[] | any
  organizations: API.Organization[] | any
  causeId: number | undefined
}

const CardsSection: React.FC<CardsSectionProps> = ({
  projects,
  organizations,
  causeId,
}) => {
  const router = useRouter()

  return (
    <>
      <section>
        <h2>ONGs</h2>
        <div className="flex flex-wrap">
          {organizations.slice(0, 8).map(organization => (
            <div key={organization.slug} className="pl-3 w-1/3 mb-6 lg:w-1/4">
              <OrganizationCard organization={organization} />
            </div>
          ))}
        </div>
        <div className="flex justify-center">
          <button
            onClick={() => router.push(`/ongs?causes=${causeId}`)}
            className="bg-gray-200 hover:bg-gray-300 rounded-full px-4 py-2 text-lg font-medium"
          >
            Ver mais ONGs
          </button>
        </div>
      </section>
      <section>
        <h2>Vagas de voluntariado</h2>
        <div className="flex flex-wrap">
          {projects.slice(0, 8).map(project => (
            <div key={project.slug} className="pl-3 w-1/3 mb-6 lg:w-1/4">
              <ProjectCard {...project} />
            </div>
          ))}
        </div>
        <div className="flex justify-center">
          <button
            onClick={() => router.push(`/vagas?causes=${causeId}`)}
            className="bg-gray-200 hover:bg-gray-300 rounded-full px-4 py-2 text-lg font-medium"
          >
            Ver mais vagas
          </button>
        </div>
      </section>
    </>
  )
}

const CausePage: NextPage<CausePageProps> = () => {
  const router = useRouter()
  const slug = router.query.slug

  const { causes, loading: causesLoading } = useCauses()

  const cause = causes?.find(candidate => candidate.slug === slug)

  const { data, loading: apiCausesLoading } = useFetch(
    `/api/cause/${cause?.id}`,
  )

  const loading = !causes || causesLoading || apiCausesLoading || !data

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
        <div className="md:flex md:-mx-2 max-w-full">
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
          {loading ? (
            <div className="flex justify-center w-full pt-12">
              <ActivityIndicator size={40} />
            </div>
          ) : (
            <div className="px-2">
              <CardsSection
                projects={data.projects.results}
                organizations={data.organizations.results}
                causeId={cause?.id}
              />
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

CausePage.displayName = 'CausePage'

export default CausePage
