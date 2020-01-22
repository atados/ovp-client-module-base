import Link from 'next/link'
import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { Page, PageAs, Color, Config, GlobalMessages } from '~/common'
import NewsletterForm from '~/components/NewsletterForm'
import SocialMediaIcon from '~/components/SocialMediaIcon/SocialMediaIcon'
import { useIntl } from 'react-intl'
import { RootState } from '~/redux/root-reducer'
import FooterNav from './FooterNav'
import LanguageDropdown from '~/components/LanguageDropdown/LanguageDropdown'
import Tooltip from '../Tooltip'
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

const SocialMedia = styled.a`
  display: inline-block;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  cursor: pointer;
  margin-left: 10px;
  text-align: center;

  &.facebook {
    background: #3b5998;
  }

  &.instagram {
    background: #c13584;
  }

  &.github {
    background: #333;
  }
`
export interface FooterProps {
  readonly causes: API.Cause[]
  readonly className?: string
}

const Footer: React.FC<FooterProps> = ({ causes, className }) => {
  const intl = useIntl()

  return (
    <Container className={className}>
      <div className="container px-2 py-8">
        <div className="lg:flex -mx-2">
          <div className="md:w-1/4 px-2 mb-4 md:mb-0">
            <FooterNav title={intl.formatMessage(GlobalMessages.appName)}>
              {Config.footer.links.length === 0 && (
                <span>{intl.formatMessage(GlobalMessages.appDescription)}</span>
              )}
              {Config.footer.links.map(link => (
                <li key={link.href + link.as} className="nav-item">
                  {link.as ? (
                    <Link href={link.href} as={link.as}>
                      <a className="nav-link">{link.label}</a>
                    </Link>
                  ) : (
                    <a href={link.href} target="__blank" className="nav-link">
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
              <li className="nav-item">
                <LanguageDropdown />
              </li>
            </FooterNav>
          </div>
          <div className="md:w-1/4 px-2 mb-4 md:mb-0">
            <FooterNav title="Causas">
              {causes.slice(0, 8).map(cause => (
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
              {causes.slice(8, 16).map(cause => (
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
        <div className="py-3 flex">
          <Link href={Page.Home} as={PageAs.Home()}>
            <a>
              {Config.footer.brand && (
                <img
                  src={Config.footer.brand}
                  alt=""
                  height="42"
                  className="mr-4"
                />
              )}
              <span className="text-lg">
                {intl.formatMessage(GlobalMessages.appName)}
              </span>
            </a>
          </Link>
          <div className="mr-auto" />
          {Config.social.map(social => (
            <Tooltip
              key={social.url}
              value={
                social.kind === 'facebook'
                  ? 'Facebook'
                  : social.kind === 'instagram'
                  ? 'Instagram'
                  : 'Github'
              }
            >
              <SocialMedia
                key={social.kind}
                href={social.url}
                target="__blank"
                className={`${social.kind} leading-loose`}
              >
                <SocialMediaIcon social={social} />
              </SocialMedia>
            </Tooltip>
          ))}
        </div>
      </div>
    </Container>
  )
}

Footer.displayName = 'Footer'
Footer.defaultProps = {
  className: undefined,
}

export default connect((state: RootState) => ({
  causes: state.startup.causes,
}))(Footer)
