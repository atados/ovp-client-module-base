import React from 'react'
import Layout from '~/components/Layout'
import { Color } from '~/common'
import { FormattedMessage, defineMessages, useIntl } from 'react-intl'
import styled from 'styled-components'
import Icon from '~/components/Icon'
import { useSelector } from 'react-redux'
import { RootState } from '~/redux/root-reducer'
import { range } from '~/lib/utils/array'
import Meta from '~/components/Meta'
import PageLink from '../components/PageLink'

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
    background: linear-gradient(180deg, ${Color.gray[900]}, ${Color.gray[700]});
  }
`

const m = defineMessages({
  metaTitle: {
    id: 'organizationOnboarding.metaTitle',
    defaultMessage: 'Cadastre sua ONG',
  },
  metaDescription: {
    id: 'organizationOnboarding.metaDescription',
    defaultMessage:
      'Se a sua ONG, coletivo ou movimento social está em busca de voluntários para colaborar com a sua causa, conte com a gente.',
  },
})

interface OrganizationOnboardingPageProps {
  readonly className?: string
}

const OrganizationOnboardingPage: React.FC<OrganizationOnboardingPageProps> = () => {
  const intl = useIntl()
  const stats = useSelector((state: RootState) => state.startup.stats)
  const volunteerCountChars = String(stats.volunteers).split('')
  return (
    <Layout toolbarProps={{ className: 'bg-none', flat: true, float: true }}>
      <Meta
        title={intl.formatMessage(m.metaTitle)}
        description={intl.formatMessage(m.metaDescription)}
      />
      <div
        className="bg-primary-500 bg-cover bg-center"
        style={{
          backgroundImage:
            'url("/static/banners/organization-onboarding-hero.jpg")',
        }}
      >
        <BannerOverlay className="p-toolbar">
          <div className="relative z-50">
            <div className="container py-8 px-2">
              <div className="flex flex-wrap -mx-2">
                <div className="px-2 w-full md:w-7/12 mb-6 md:mb-0">
                  <h1 className="text-white text-6xl max-w-md">
                    <FormattedMessage
                      id="organizationOnboarding.heroTitle"
                      defaultMessage="Faça parte da nossa rede"
                    />
                  </h1>
                  <p className="text-white-alpha-80 text-xl max-w-md mb-0">
                    {intl.formatMessage(m.metaDescription)}
                  </p>
                </div>
                <div className="px-2 w-full md:w-5/12">
                  <div className="bg-white rounded-lg shadow-lg p-5">
                    <div className="text-center truncate mb-4">
                      {range(6, i => (
                        <div key={i} className="inline-block mr-2">
                          <span
                            className={`text-3xl font-medium text-gray-700 bg-gray-200 rounded-lg block px-3 py-2 ${
                              i === 2 ? 'mr-4' : ''
                            }`}
                          >
                            {volunteerCountChars[
                              i - (6 - volunteerCountChars.length)
                            ] || 0}
                          </span>
                        </div>
                      ))}
                    </div>
                    <span className="tt-upper font-medium text-center mb-4 block text-primary-500">
                      <FormattedMessage
                        id="organizationOnboarding.volunteersToEngage"
                        defaultMessage="Voluntários para engajar"
                      />
                    </span>
                    <PageLink
                      href="NewOrganization"
                      params={{ stepId: 'auth' }}
                    >
                      <a className="btn btn--size-3 py-3 bg-secondary-500 hover:bg-secondary-600 btn--block rounded text-xl">
                        <FormattedMessage
                          id="organizationOnboarding.start"
                          defaultMessage="Cadastrar minha ONG"
                        />
                        <Icon name="arrow_forward" className="ml-2" />
                      </a>
                    </PageLink>
                  </div>
                </div>
              </div>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="100%"
              height="96px"
              viewBox="0 0 100 100"
              version="1.1"
              preserveAspectRatio="none"
              className="block"
            >
              <path
                fill="#fff"
                d="M0,0 C6.83050094,50 15.1638343,75 25,75 C41.4957514,75 62.4956597,0 81.2456597,0 C93.7456597,0 99.9971065,0 100,0 L100,100 L0,100"
              ></path>
            </svg>
          </div>
        </BannerOverlay>
      </div>
      <div className="container px-2 py-8">
        <div className="flex flex-wrap -mx-2 text-center md:text-left">
          <div className="w-full md:w-1/3 px-2">
            <div className="max-w-xs mx-auto">
              <span className="w-12 h-12 text-gray-700 bg-gray-200 font-medium rounded-full inline-block text-center leading-relaxed py-2 text-xl mb-4">
                <Icon name="public" />
              </span>
              <h5 className="font-medium text-2xl leading-normal mb-2 ">
                <FormattedMessage
                  id="organizationOnboarding.info.1.title"
                  defaultMessage="Conte sua história"
                />
              </h5>
              <p className="text-gray-800">
                <FormattedMessage
                  id="organizationOnboarding.info.1.text"
                  defaultMessage="Tenha uma página para contar sua história. Isso ajuda os voluntários a se conectarem com seu propósito"
                />
              </p>
            </div>
          </div>
          <div className="w-full md:w-1/3 px-2">
            <div className="max-w-xs mx-auto">
              <span className="w-12 h-12 text-gray-700 bg-gray-200 font-medium rounded-full inline-block text-center leading-relaxed py-2 text-xl mb-4">
                <Icon name="group" />
              </span>
              <h5 className="font-medium text-2xl leading-normal mb-2">
                <FormattedMessage
                  id="organizationOnboarding.info.2.title"
                  defaultMessage="Faça parte da Rede"
                />
              </h5>
              <p className="text-gray-800">
                <FormattedMessage
                  id="organizationOnboarding.info.2.text"
                  defaultMessage="Publique suas vagas de voluntariado. Nós trabalhamos para que seu projeto receba inscrições"
                />
              </p>
            </div>
          </div>
          <div className="w-full md:w-1/3 px-2">
            <div className="max-w-xs mx-auto">
              <span className="w-12 h-12 text-gray-700 bg-gray-200 font-medium rounded-full inline-block mx-auto text-center leading-relaxed py-2 text-xl mb-4">
                <Icon name="phone" />
              </span>
              <h5 className="font-medium text-2xl leading-normal mb-2">
                <FormattedMessage
                  id="organizationOnboarding.info.3.title"
                  defaultMessage="Receba seus voluntários"
                />
              </h5>
              <p className="text-gray-800">
                <FormattedMessage
                  id="organizationOnboarding.info.3.text"
                  defaultMessage="É muito importante que, após receber as inscrições, sua ONG contate os voluntários"
                />
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

OrganizationOnboardingPage.displayName = 'OrganizationOnboardingPage'

export default OrganizationOnboardingPage
