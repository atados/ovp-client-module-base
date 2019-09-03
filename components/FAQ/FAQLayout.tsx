import React from 'react'
import Layout from '../Layout'
import { defineMessages, useIntl } from 'react-intl'
import ToolbarBrand from '../Toolbar/ToolbarBrand'
import FAQSearchForm from '../FAQSearchForm'
import styled from 'styled-components'

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
      <div className="bg-primary-500">
        <div className="container pt-10 py-5">
          <h1 className="tc-white ta-center mt-4">Central de Ajuda</h1>
          <p className="tc-light ts-large ta-center">Como podemos te ajudar?</p>
          <div className="ta-center mt-4">
            <FAQSearchFormStyled defaultValue={defaultSearchFormValue} />
          </div>
        </div>
      </div>
      {children}
    </Layout>
  )
}

FAQLayout.displayName = 'FAQLayout'

export default FAQLayout
