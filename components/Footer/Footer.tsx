import Link from 'next/link'
import React from 'react'
import { defineMessages } from 'react-intl'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { Page, PageAs, Asset, Color } from '~/common'
import { channel } from '~/common/constants'
import NewsletterForm from '~/components/NewsletterForm'
import SocialMediaIcon from '~/components/SocialMediaIcon/SocialMediaIcon'
import { useIntl } from 'react-intl'
import { Cause } from '~/common/channel'
import { RootState } from '~/redux/root-reducer'
import FooterNav from './FooterNav'
import LanguageDropdown from '~/components/LanguageDropdown/LanguageDropdown'
import Tooltip from '../Tooltip'

const Container = styled.div`
  background: ${props => props.theme.footerBackground || Color.gray[200]};
  ${props =>
    props.theme.footerTheme === 'dark'
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

const { appName } = defineMessages({
  appName: {
    id: 'app.name',
    defaultMessage: 'Channel name',
  },
})

export interface FooterProps {
  readonly causes: Cause[]
  readonly className?: string
}

const messages = defineMessages({
  appDescription: {
    id: 'app.description',
    defaultMessage:
      'Conheça oportunidades de trabalho voluntário e inscreva-se.',
  },
})

const Footer: React.FC<FooterProps> = ({ causes, className }) => {
  const intl = useIntl()

  return (
    <Container className={className}>
      <div className="container px-2 py-8">
        <div className="lg:flex -mx-2">
          <div className="md:w-1/4 px-2 mb-4 md:mb-0">
            <FooterNav title={intl.formatMessage(appName)}>
              {channel.config.footer.links.length === 0 && (
                <span>{intl.formatMessage(messages.appDescription)}</span>
              )}
              {channel.config.footer.links.map(link => (
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
              {Asset.FooterBrand && (
                <img
                  src={Asset.FooterBrand}
                  alt=""
                  height="42"
                  className="mr-4"
                />
              )}
              <span className="text-lg">{intl.formatMessage(appName)}</span>
            </a>
          </Link>
          <div className="mr-auto" />
          {channel.social.map(social => (
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
