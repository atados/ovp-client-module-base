import Link from 'next/link'
import React from 'react'
import { defineMessages } from 'react-intl'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { Page, PageAs, Asset } from '~/common'
import { channel } from '~/common/constants'
import NewsletterForm from '~/components/NewsletterForm'
import SocialMediaIcon from '~/components/SocialMediaIcon/SocialMediaIcon'
import { useIntl } from 'react-intl'
import { Cause } from '~/common/channel'
import { RootState } from '~/redux/root-reducer'
import FooterNav from './FooterNav'
import LanguageDropdown from '~/components/LanguageDropdown/LanguageDropdown'

const Container = styled.div`
  background: ${props => props.theme.footerBackground || '#f5f6f7'};
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
  padding: 8px 0;
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
      <div className="container py-5">
        <div className="row">
          <div className="col-md-3 mb-3 mb-md-0">
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
          <div className="col-md-3 mb-3 mb-md-0">
            <FooterNav title="Causas">
              {causes.slice(0, 8).map(cause => (
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
          <div className="col-md-3 mb-3 mb-md-0">
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
          <div className="col-md-3">
            <NewsletterForm />
          </div>
        </div>
        <hr className="mt-4" />
        <div className="py-2 flex">
          <Link href={Page.Home} as={PageAs.Home()}>
            <a>
              {Asset.FooterBrand && (
                <img
                  src={Asset.FooterBrand}
                  alt=""
                  height="42"
                  className="mr-3"
                />
              )}
              <span className="ts-medium">{intl.formatMessage(appName)}</span>
            </a>
          </Link>
          <div className="mr-auto" />
          {channel.social.map(social => (
            <SocialMedia
              key={social.kind}
              href={social.url}
              target="__blank"
              className={`tooltiped tooltiped-hover ${social.kind}`}
            >
              <span className="tooltip">
                {social.kind === 'facebook'
                  ? 'Facebook'
                  : social.kind === 'instagram'
                  ? 'Instagram'
                  : 'Github'}
              </span>
              <SocialMediaIcon social={social} />
            </SocialMedia>
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
