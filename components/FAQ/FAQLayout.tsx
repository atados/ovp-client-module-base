import React from 'react'
import Layout from '../Layout'
import { defineMessages, useIntl, FormattedMessage } from 'react-intl'
import ToolbarBrand from '../Toolbar/ToolbarBrand'
import FAQSearchForm from '../FAQSearchForm'
import styled from 'styled-components'
import Icon from '../Icon'
import { Page, Color } from '~/common'
import Link from 'next/link'
import { useRouter } from 'next/router'

const FAQSearchFormStyled = styled(FAQSearchForm)`
  max-width: 600px;
  margin: 0 auto;
`

const m = defineMessages({
  title: {
    id: 'faq.title',
    defaultMessage: 'Central de Ajuda',
  },
})

interface FAQLayoutProps {
  readonly className?: string
  readonly defaultSearchFormValue?: string
}

const FAQLayout: React.FC<FAQLayoutProps> = ({
  className,
  children,
  defaultSearchFormValue,
}) => {
  const intl = useIntl()
  const { pathname } = useRouter() || { pathname: '' }

  return (
    <Layout
      className={className}
      toolbarProps={{
        searchFormEnabled: false,
        flat: true,
        float: true,
        className: 'bg-none',
        brand: (
          <Link href="/" passHref>
            <ToolbarBrand innerClassName="inline-block">
              <span className="text-toolbar border-l border-color-white pl-3 align-middle ml-3">
                {intl.formatMessage(m.title)}
              </span>
            </ToolbarBrand>
          </Link>
        ),
      }}
    >
      <div className="relative bg-primary-500">
        <div className="relative container px-3 pt-32 py-8 z-30">
          <Link href={Page.FAQ}>
            <a className="td-hover-none">
              <h1 className="text-white text-center mt-6">
                {pathname !== Page.FAQ && (
                  <button className="btn w-10 h-10 bg-primary-400 rounded-full mr-4 text-white text-xl px-0 animate-slideInLeft">
                    <Icon name="arrow_back" />
                  </button>
                )}
                <FormattedMessage
                  id="faqLayout.title"
                  defaultMessage="Central de Ajuda"
                />
              </h1>
            </a>
          </Link>
          <p className="text-white-alpha-80 text-xl text-center">
            <FormattedMessage
              id="faqLayout.subtitle"
              defaultMessage="Como podemos te ajudar?"
            />
          </p>
          <div className="text-center mt-6">
            <FAQSearchFormStyled defaultValue={defaultSearchFormValue} />
          </div>
        </div>
        <svg viewBox="0 0 100 15" className="absolute left-0 right-0 bottom-0">
          <path
            fill={Color.primary[200]}
            opacity="0.5"
            d="M0 30 V15 Q30 3 60 15 V30z"
          />
          <path
            fill={Color.primary[300]}
            d="M0 30 V12 Q30 17 55 12 T100 11 V30z"
          />
        </svg>
      </div>
      {children}
    </Layout>
  )
}

FAQLayout.displayName = 'FAQLayout'

export default FAQLayout
