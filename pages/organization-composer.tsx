import { NextPageContext } from 'next'
import Router from 'next/router'
import React from 'react'
import styled from 'styled-components'
import { StepIds, StepIdType } from '~/components/FormComposer/FormComposer'
import Meta from '~/components/Meta'
import OrganizationComposer from '~/components/OrganizationComposer'
import Toolbar from '~/components/Toolbar'
import { Page, PageAs } from '../common'

const Container = styled.div`
  padding-top: 56px;
`

interface OrganizationComposerPageProps {
  readonly stepId: string
  readonly className?: string
}

class OrganizationComposerPage extends React.Component<
  OrganizationComposerPageProps
> {
  public static getInitialProps = ({ query: { stepId } }: NextPageContext) => ({
    stepId: stepId || StepIds.Introduction,
  })

  public handleStepChange = (stepId: StepIdType) => {
    Router.push(Page.NewOrganization, PageAs.NewOrganization({ stepId }))
  }

  public render() {
    const { stepId } = this.props

    return (
      <Container>
        {
          // @ts-ignore
          <Toolbar fixed flat />
        }
        <Meta title="Cadastro de ONG" />
        {
          // @ts-ignore
          <OrganizationComposer
            stepId={stepId}
            onStepChange={this.handleStepChange}
            skipingDisabled
          />
        }
      </Container>
    )
  }
}

export default OrganizationComposerPage
