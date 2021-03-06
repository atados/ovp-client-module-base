import styled from 'styled-components'
import Link from 'next/link'
import React from 'react'

import FooterFirstCollumn from '~/components/Footer/FooterFirstCollumn'
import ActivityIndicator from '~/components/ActivityIndicator'
import FooterBottom from '~/components/Footer/FooterBottom'
import NewsletterForm from '~/components/NewsletterForm'
import { Page, PageAs, Color, Config } from '~/common'
import FooterNav from '~/components/Footer/FooterNav'
import useCauses from '~/hooks/use-causes'
import { API } from '~/types/api'

const Container = styled.div`
  background: ${Config.footer.background || Color.gray[200]};
  ${Config.footer.theme === 'dark'
    ? `
      color: #fff;

      a {
        color: #fff;
      }`
    : `
    a {
      color: #333;
    }`}
`

export interface FooterProps {
  readonly causes?: API.Cause[]
  readonly className?: string
}

const Footer: React.FC<FooterProps> = ({ className }) => {
  const { causes, loading } = useCauses()

  return (
    <Container className={className}>
      <div className="container px-2 py-8">
        <div className="lg:flex -mx-2">
          <div className="md:w-1/4 px-2 mb-4 md:mb-0">
            <FooterFirstCollumn />
          </div>
          <div className="md:w-1/4 px-2 mb-4 md:mb-0">
            <FooterNav title="Causas">
              {loading && <ActivityIndicator size={36} />}
              {causes &&
                causes.slice(0, 8).map(cause => (
                  <span key={cause.id}>
                    <Link
                      as={PageAs.Cause({ slug: cause.slug })}
                      href={Page.Cause}
                    >
                      <a className="nav-link">{cause.name}</a>
                    </Link>
                  </span>
                ))}
            </FooterNav>
          </div>
          <div className="md:w-1/4 px-2 mb-4 md:mb-0">
            <FooterNav title="+">
              {loading && <ActivityIndicator size={36} />}
              {causes &&
                causes.slice(8, 16).map(cause => (
                  <span key={cause.slug}>
                    <Link
                      as={PageAs.Cause({ slug: cause.slug })}
                      href={Page.Cause}
                    >
                      <a className="nav-link">{cause.name}</a>
                    </Link>
                  </span>
                ))}
            </FooterNav>
          </div>
          <div className="md:w-1/4 px-2">
            <NewsletterForm />
          </div>
        </div>
        <hr className="mt-6" />
        <FooterBottom />
      </div>
    </Container>
  )
}

Footer.displayName = 'Footer'
Footer.defaultProps = {
  className: undefined,
}

export default Footer
