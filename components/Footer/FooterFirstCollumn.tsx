import FooterNav from '~/components/Footer/FooterNav'
import { Config, GlobalMessages } from '~/common'
import { useIntl } from 'react-intl'
import Link from 'next/link'
import React from 'react'

const FooterFirstCollumn = () => {
  const intl = useIntl()

  return (
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
    </FooterNav>
  )
}

export default FooterFirstCollumn
