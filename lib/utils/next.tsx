import React from 'react'
import { NextPage } from 'next'
import { ParsedUrlQuery } from 'querystring'

export function withQuery<Props, InitialProps = Props>(
  Component: NextPage<Props, InitialProps>,
  query: ParsedUrlQuery | ((ctx: ParsedUrlQuery) => ParsedUrlQuery),
) {
  const WrapperComponent: NextPage<Props, InitialProps> = props => (
    <Component {...props} />
  )

  if (Component.getInitialProps) {
    WrapperComponent.getInitialProps = async ctx => {
      Object.assign(ctx.query, query)

      return Component.getInitialProps!(ctx)
    }
  }

  return WrapperComponent
}
