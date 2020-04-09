import styled from 'styled-components'
import Link from 'next/link'
import React from 'react'
import { Page, Color } from '~/common'

const BannerOverlay = styled.div`
  position: relative;
  background-image: url('/static/banner-default.jpg');

  &::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    opacity: 0.4;
    background: linear-gradient(
      180deg,
      ${Color.primary[800]},
      ${Color.primary[400]}
    );
  }
`

export default () => {
  return (
    <BannerOverlay className="bg-cover">
      <div className="container px-2 relative z-10 py-12">
        <p className="text-white text-3xl lg:text-6xl leading-tight font-bold max-w-xl">
          Nós conectamos você com uma vaga de voluntariado
        </p>
        <Link href={Page.SearchProjects}>
          <a className="inline-block bg-primary-500 hover:bg-primary-800 text-white font-bold py-3 px-5 rounded mr-3 mb-3">
            Quero ser voluntário
          </a>
        </Link>
        <Link href={Page.OrganizationOnboarding}>
          <a
            className="inline-block hover:bg-secondary-400 text-white font-bold py-3 px-5 rounded"
            style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
          >
            Anunciar vagas de voluntariado
          </a>
        </Link>
      </div>
    </BannerOverlay>
  )
}
