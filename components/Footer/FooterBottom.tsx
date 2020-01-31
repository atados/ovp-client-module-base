import SocialMediaIcon from '~/components/SocialMediaIcon/SocialMediaIcon'
import { Page, PageAs, Config, GlobalMessages } from '~/common'
import Tooltip from '~/components/Tooltip'
import styled from 'styled-components'
import { useIntl } from 'react-intl'
import Link from 'next/link'
import React from 'react'

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

const FooterBottom = () => {
  const intl = useIntl()

  return (
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
  )
}

export default FooterBottom
