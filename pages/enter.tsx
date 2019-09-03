import Router from 'next/router'
import React from 'react'
import Authentication from '~/components/Authentication'
import {
  AUTH_ERROR_EMAIL_CODE,
  AUTH_ERROR_INTERNAL_CODE,
} from '~/components/Authentication/constants'
import Layout from '~/components/Layout'
import Meta from '~/components/Meta'
import * as RouterSwitch from '~/components/RouterSwitch/RouterSwitch'

interface EnterPageProps {
  readonly path: string
  readonly successRedirect?: string
  readonly errorCode?: string
}

interface EnterPageState {
  location: RouterSwitch.Location
}

class EnterPage extends React.Component<EnterPageProps, EnterPageState> {
  public static getDerivedStateFromProps(
    props: EnterPageProps,
  ): EnterPageState {
    return {
      location: { path: props.path },
    }
  }

  public static getInitialProps = ({
    query: { path, successRedirect, errorCode },
  }) => ({
    path,
    successRedirect,
    errorCode:
      errorCode &&
      (errorCode === AUTH_ERROR_EMAIL_CODE
        ? AUTH_ERROR_EMAIL_CODE
        : AUTH_ERROR_INTERNAL_CODE),
  })

  constructor(props) {
    super(props)

    this.state = EnterPage.getDerivedStateFromProps(props)
  }

  public handleLocationChange = ({ path: nextPath }: RouterSwitch.Location) => {
    const { successRedirect } = this.props
    const search = `?next=${successRedirect}`
    Router.push(
      `/enter?path=${nextPath}&successRedirect=${successRedirect}`,
      nextPath === '/recover'
        ? `/redefinir-senha${search}`
        : nextPath === '/login'
        ? `/entrar${search}`
        : `/entrar/cadastro${search}`,
    )
  }

  public render() {
    const { location } = this.state

    const isLogin = location.path === '/login'

    return (
      <Layout>
        <Meta
          title={isLogin ? 'Entrar' : 'Cadastro'}
          description="Faça parte da plataforma Channel"
        />
        <div className="py-5 bg-muted">
          <div className="container container--sm">
            <div className="card rounded-lg p-5">
              <Authentication />
            </div>
          </div>
        </div>
      </Layout>
    )
  }
}

export default EnterPage
