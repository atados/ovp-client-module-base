import React from 'react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { FormattedMessage } from 'react-intl'

import handleInputChange from '~/pages/city/handleInputChange'
import BannerOverlay from '~/pages/city/BannerOverlay'
import mountApiPath from '~/pages/city/mountApiPath'
import { ApiPagination } from '~/redux/ducks/search'
import ProjectCard from '~/components/ProjectCard'
import { RootState } from '~/redux/root-reducer'
import useFetchAPI from '~/hooks/use-fetch-api'
import { useSelector } from 'react-redux'
import Layout from '~/components/Layout'
import Icon from '~/components/Icon'
import Meta from '~/components/Meta'
import { API } from '~/types/api'

interface CityProps {
  cityName: string
  cause?: string
  skill?: string
}

const City: NextPage<CityProps> = ({ cityName, cause, skill }) => {
  const router = useRouter()
  const { causes, skills } = useSelector((state: RootState) => state.startup)
  const response = useFetchAPI<ApiPagination<API.Project>>(
    mountApiPath(cityName, cause, skill),
  )

  const projects = response.data?.results || []

  return (
    <Layout toolbarProps={{ float: true, flat: true, className: 'bg-none' }}>
      <Meta />
      <span className="px-md-3"></span>
      <BannerOverlay
        className="p-toolbar bg-cover bg-center mb-10"
        style={{ backgroundImage: `url('/static/banners/home-fast.jpg')` }}
      >
        <div className="relative z-50">
          <div className="container px-3 pt-8">
            <div className="w-16 h-16 rounded-full bg-white mx-auto mb-4 flex justify-center items-center">
              <Icon name="place" className="text-4xl text-blue-600" />
            </div>
            <h1 className="text-white text-6xl font-medium text-center">
              {cityName}
            </h1>
            <p className="max-w-xl text-xl text-center text-white mx-auto mb-6">
              <FormattedMessage
                id="home.subtitle"
                defaultMessage="O Atados é uma plataforma de voluntariado que conecta pessoas a oportunidades voluntárias."
              />
            </p>
            <div className="bg-white rounded-lg max-w-3xl mx-auto mb-4 p-2 md:flex">
              <select
                value={cause}
                className="rounded-lg input md:mr-2 block mb-2 md:mb-0 bg-gray-300 border-0 text-xl px-4 h-12"
                name="cause"
                onChange={handleInputChange(router, cityName, skill, cause)}
              >
                <option key={0} value="">
                  Filtre por causa
                </option>
                {causes.map(cause => (
                  <option key={cause.id} value={cause.id}>
                    {cause.name}
                  </option>
                ))}
              </select>
              <select
                value={skill}
                className="rounded-lg input md:mr-2 block mb-2 md:mb-0 bg-gray-300 border-0 text-xl px-4 h-12"
                name="skill"
                onChange={handleInputChange(router, cityName, skill, cause)}
              >
                <option key={0} value="">
                  Filtre por habilidade
                </option>
                {skills.map(skill => (
                  <option key={skill.id} value={skill.id}>
                    {skill.name}
                  </option>
                ))}
              </select>
            </div>
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
      <div className="container mx-auto px-2">
        <h4 className="mb-4">Vagas recentes</h4>
        <div className="flex -mx-2 flex-wrap">
          {projects.map(project => (
            <div
              key={project.slug}
              className="px-2 w-full sm:w-1/2 lg:w-1/4 mb-6"
            >
              <ProjectCard {...project} />
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}

City.getInitialProps = async context => {
  return {
    cityName: String(context.query.cityName),
    cause: context.query.cause && String(context.query.cause),
    skill: context.query.skill && String(context.query.skill),
  }
}

export default City
