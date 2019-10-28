import React from 'react'
import Layout from '../components/Layout'
import styled from 'styled-components'
import Meta from '../components/Meta'
import { Color } from '../common'
import useFetchAPI from '../hooks/use-fetch-api'
import { ApiPagination } from '../redux/ducks/search'
import { Project } from '../redux/ducks/project'
import ProjectCard from '../components/ProjectCard'
import Icon from '../components/Icon'
import { APP_URL } from '../common/constants'

const Hero = styled.div`
  background-image: url('/static/banners/banner-oleo.png');
  background-position: left top;
  min-height: 400px;
`

const CardSection = styled.section`
  > .container {
    margin-top: -100px;
  }

  .icon {
    line-height: 2;
  }
`

const NordestePage: React.FC<{}> = () => {
  const projectsQuery = useFetchAPI<ApiPagination<Project>>(
    '/search/projects/?category=16',
  )
  const projects = projectsQuery.data ? projectsQuery.data.results : []
  return (
    <Layout
      toolbarProps={{ float: true, className: 'no-background', flat: true }}
    >
      <Meta
        title="Colabore com a limpeza do litoral nordestino"
        description="Estamos mobilizando parceiros, ONGs, movimentos e voluntários das regiões afetadas para atuar na limpeza das praias e com os danos causados pelas manchas de óleo."
        image={`${APP_URL}/static/banners/banner-oleo.png`}
      />
      <Hero className="bg-cover p-toolbar">
        <div className="container py-5">
          <span className="text-3xl tc-white tw-medium text-upper block">
            #ÓleoNoNordeste
          </span>

          <h1 className="text-6xl tc-white tw-medium text-upper block">
            Colabore com a limpeza do litoral nordestino.
          </h1>
          <p className="text-xl tc-white max-w-lg">
            Estamos mobilizando parceiros, ONGs, movimentos e voluntários das
            regiões afetadas para atuar na limpeza das praias e com os danos
            causados pelas manchas de óleo.
          </p>
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
            fill={Color.gray[800]}
            d="M0,0 C16.6666667,66 33.3333333,99 50,99 C66.6666667,99 83.3333333,66 100,0 L100,100 L0,100 L0,0 Z"
          ></path>
        </svg>
      </Hero>
      <CardSection className="bg-gray-800 py-5">
        <div className="container">
          <div className="row">
            <div className="col-md-4 mb-4 mb-md-0">
              <div className="bg-white rounded-lg p-4 h-full">
                <Icon
                  name="person"
                  className="w-12 h-12 bg-primary-500 tc-white rounded-circle text-2xl ta-center block mb-3"
                />
                <h4 className="tc-gray-800">Seja voluntário</h4>
                <p className="tc-gray-600">
                  Se você quer ser voluntário(a) e colocar a mão na massa.
                </p>
                <span className="block tw-medium">
                  <span className="vertical-align-middle mr-2">
                    Confira as vagas abaixo{' '}
                  </span>
                  <Icon
                    name="arrow_downward"
                    className="vertical-align-middle"
                  />
                </span>
              </div>
            </div>
            <div className="col-md-4 mb-4 mb-md-0">
              <div className="bg-white rounded-lg p-4 h-full">
                <Icon
                  name="group"
                  className="w-12 h-12 bg-secondary-500 tc-white rounded-circle text-2xl ta-center block mb-3"
                />
                <h4 className="tc-gray-800">Colabore</h4>
                <p className="tc-gray-600">
                  Se você é uma empresa, ONG ou movimento social, entre em
                  contato com{' '}
                  <a href="mailto:contato@atados.com.br">
                    contato@atados.com.br
                  </a>
                </p>
              </div>
            </div>
            <div className="col-md-4 mb-4 mb-md-0">
              <a
                href="https://blog.atados.com.br/2019/10/22/oleononordeste-o-litoral-nordestino-precisa-da-sua-colaboracao/"
                target="__blank"
                className="block td-hover-none bg-gray-700 rounded-lg p-4 h-full"
              >
                <Icon
                  name="edit"
                  className="w-12 h-12 bg-primary-500 tc-white rounded-circle text-2xl ta-center block mb-3"
                />
                <h4 className="tc-white">Leia nosso manifesto</h4>
                <p className="tc-gray-500">
                  #ÓleoNoNordeste – O litoral nordestino precisa da sua
                  colaboração!
                </p>
                <span className="tc-white td-underline">
                  Leia no nosso blog
                </span>
              </a>
            </div>
          </div>
        </div>
      </CardSection>
      <div className="container py-5">
        <h4 className="text-2xl mb-4">Vagas de voluntariado</h4>
        <div className="row">
          {projects.map(p => (
            <div key={p.slug} className="col-6 col-lg-3 mb-4">
              <ProjectCard {...p} />
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}

NordestePage.displayName = 'NordestePage'

export default NordestePage
