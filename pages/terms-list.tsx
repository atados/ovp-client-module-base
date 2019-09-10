import React from 'react'
import Layout from '~/components/Layout'
import styled from 'styled-components'
import { useIntl } from 'react-intl'
import { defineMessages } from 'react-intl'
import Icon from '~/components/Icon'
import Link from 'next/link'
import { Page } from '~/common'

const PageStyled = styled.div`
  background: #edf2f7;
  background-image: url("data:image/svg+xml,%3Csvg width='52' height='26' viewBox='0 0 52 26' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23002244' fill-opacity='0.15'%3E%3Cpath d='M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4v2c-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6zm25.464-1.95l8.486 8.486-1.414 1.414-8.486-8.486 1.414-1.414z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
`

const m = defineMessages({
  appName: {
    id: 'app.name',
    defaultMessage: 'Channel',
  },
})

const TermsPage: React.FC<{}> = () => {
  const intl = useIntl()

  return (
    <Layout>
      <PageStyled>
        <div className="container container--md py-5">
          <div className="bg-white rounded-lg p-5 shadow-lg">
            <h1 className="h3 mb-4">
              Termos - {intl.formatMessage(m.appName)}
            </h1>

            <Link href={Page.ApprovalTerms}>
              <a className="ts-large rounded-lg bg-muted p-2 block mb-3 tc-base">
                <Icon name="insert_drive_file" className="mr-2" />
                Termos de Aprovação
              </a>
            </Link>
            <Link href={Page.PrivacyTerms}>
              <a className="ts-large rounded-lg bg-muted p-2 block mb-3 tc-base">
                <Icon name="insert_drive_file" className="mr-2" />
                Termos de Privacidade
              </a>
            </Link>
            <Link href={Page.VolunteerTerms}>
              <a className="ts-large rounded-lg bg-muted p-2 block tc-base">
                <Icon name="insert_drive_file" className="mr-2" />
                Termos de Voluntariado
              </a>
            </Link>
          </div>
        </div>
      </PageStyled>
    </Layout>
  )
}

TermsPage.displayName = 'TermsPage'

export default TermsPage
