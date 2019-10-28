import React from 'react'
import { NextPage, NextPageContext } from 'next'
import { ParsedUrlQuery } from 'querystring'
import Router from 'next/router'

export function withQuery<Props, InitialProps = Props>(
  Component: NextPage<Props, InitialProps>,
  query: ParsedUrlQuery | ((ctx: ParsedUrlQuery) => ParsedUrlQuery),
) {
  const WrapperComponent: NextPage<Props, InitialProps> = props => (
    <Component {...props} />
  )

  WrapperComponent.getInitialProps = async ctx => {
    Object.assign(ctx.query, query)

    if (Component.getInitialProps) {
      return Component.getInitialProps(ctx)
    }

    return {} as InitialProps
  }

  return WrapperComponent
}

export const redirect = (context: NextPageContext, target: string) => {
  if (context.res) {
    // server
    // 303: "See other"
    context.res.writeHead(303, { Location: target })
    context.res.end()
  } else {
    // In the browser, we just pretend like this never even happened ;)
    Router.replace(target)
  }
}
