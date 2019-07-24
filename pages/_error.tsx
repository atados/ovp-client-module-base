import { NextContext } from 'next'
import React from 'react'
import styled from 'styled-components'
import { dev } from '~/common/constants'
import Layout from '~/components/Layout'
import Meta from '~/components/Meta'

const Container = styled.div`
  padding-top: 150px;
  padding-bottom: 150px;
`

interface ErrorPageProps {
  readonly statusCode?: number
  readonly stack?: string
}

class ErrorPage extends React.Component<ErrorPageProps> {
  public static getInitialProps({
    res,
    err,
  }: NextContext & { err?: Error & { statusCode?: number } }) {
    const statusCode = res ? res.statusCode : err ? err.statusCode : null
    return {
      statusCode: statusCode || 404,
      stack: dev && err ? err.stack : undefined,
    }
  }

  public render() {
    const { statusCode, stack } = this.props
    const title = statusCode === 404 ? 'Página não encontrada' : 'Erro interno'

    return (
      <Layout>
        <Meta title={title} />
        <Container className="container container--sm ta-center">
          <h1 className="tc-muted-dark">{title}.</h1>
          <p>
            Esta página pode ser particular. Se alguém deu este link a você, ele
            precisa convidá-lo para a ONG.
          </p>
          {stack && <pre>{stack}</pre>}
        </Container>
      </Layout>
    )
  }
}

export default ErrorPage
