import React from 'react'
import Layout from '../Layout'
import { defineMessages, useIntl } from 'react-intl'
import ToolbarBrand from '../Toolbar/ToolbarBrand'
import FAQSearchForm from '../FAQSearchForm'
import styled from 'styled-components'
import { channel } from '~/base/common/constants'
import Icon from '../Icon'
import { Page } from '~/base/common'
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
        className: 'no-background',
        brand: (
          <>
            <ToolbarBrand />
            <span className="tc-toolbar border-l border-color-white pl-2">
              {intl.formatMessage(m.title)}
            </span>
          </>
        ),
      }}
    >
      <div className="relative bg-primary-500">
        <div className="relative container pt-10 py-5 z-30">
          <Link href={Page.FAQ}>
            <a className="td-hover-none">
              <h1 className="tc-white ta-center mt-4">
                {pathname !== Page.FAQ && (
                  <button className="btn w-10 h-10 bg-primary-400 rounded-circle mr-3 tc-white ts-large px-0 animate-slideInLeft">
                    <Icon name="arrow_back" />
                  </button>
                )}
                Central de Ajuda
              </h1>
            </a>
          </Link>
          <p className="tc-light ts-large ta-center">Como podemos te ajudar?</p>
          <div className="ta-center mt-4">
            <FAQSearchFormStyled defaultValue={defaultSearchFormValue} />
          </div>
        </div>
        <svg viewBox="0 0 100 15" className="absolute left-0 right-0 bottom-0">
          <path
            fill={channel.theme.color.primary[200]}
            opacity="0.5"
            d="M0 30 V15 Q30 3 60 15 V30z"
          />
          <path
            fill={channel.theme.color.primary[300]}
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
